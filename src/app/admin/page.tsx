"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  AdminUser,
  FilterState,
  PaginationState,
  SortField,
  SortDirection,
} from "@/types/admin";
import {
  filterUsers,
  sortUsers,
  paginateUsers,
  calculateMetrics,
  formatRelativeDate,
  getSubscriptionStatusColor,
  downloadCSV,
} from "@/utils/adminHelpers";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import MetricsCard, { MetricsGrid } from "@/components/admin/MetricsCard";
import AddRepoForm from "@/components/admin/AddRepoForm";
import ReposTable from "@/components/admin/ReposTable";
import BannerManagement from "@/components/admin/BannerManagement";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import TabSkeleton from "@/components/admin/Skeleton";
import SortableHeader from "@/components/admin/SortableHeader";
import { ui, badge } from "@/components/admin/ui";
import { StarterRepoProps } from "@/types/starter-repo";
import { WorkshopProps } from "@/types/workshop";
import { Plus, Download, Copy, Check, ExternalLink, Pencil, Save, X } from "lucide-react";

type TabType = "usuarios" | "repositorios" | "banner" | "waitlist" | "certificados" | "workshops";

const TABS: { id: TabType; label: string }[] = [
  { id: "usuarios", label: "Usuarios" },
  { id: "repositorios", label: "Repositorios" },
  { id: "banner", label: "Banner" },
  { id: "waitlist", label: "Waitlist" },
  { id: "certificados", label: "Certificados" },
  { id: "workshops", label: "Workshops" },
];

interface CertificateEntry {
  id: string;
  code: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateUrl?: string;
  isValid: boolean;
}

interface WaitlistEntry {
  id: string;
  email: string;
  timestamp: Date | string;
  source: string;
  status: string;
}

// useSearchParams exige un límite de Suspense en el build de Next.
export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // La tab activa vive en la URL (?tab=...): sobrevive a refresh, es
  // compartible y el botón atrás funciona.
  const tabParam = searchParams.get("tab");
  const activeTab: TabType = TABS.some((t) => t.id === tabParam)
    ? (tabParam as TabType)
    : "usuarios";
  const setActiveTab = (tab: TabType) => {
    router.replace(tab === "usuarios" ? "/admin" : `/admin?tab=${tab}`, {
      scroll: false,
    });
  };

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [repos, setRepos] = useState<(StarterRepoProps & { id: string })[]>([]);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [certificates, setCertificates] = useState<CertificateEntry[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [certSearch, setCertSearch] = useState("");
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({
    studentName: "",
    courseName: "",
    completionDate: "",
    certificateUrl: "",
  });
  const [savingCert, setSavingCert] = useState(false);
  const [workshops, setWorkshops] = useState<(WorkshopProps & { id: string })[]>([]);
  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(null);
  const [editingAbout, setEditingAbout] = useState("");
  const [savingAbout, setSavingAbout] = useState(false);
  // Cada tab hace su fetch la primera vez que se abre, no todos al montar.
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set());
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<AdminUser | null>(null);
  const [showRepoForm, setShowRepoForm] = useState(false);
  const [editingRepo, setEditingRepo] = useState<(StarterRepoProps & { id: string }) | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    premiumFilter: "all",
    subscriptionFilter: "all",
    dateFilter: "all",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 25,
  });
  const [certPagination, setCertPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 25,
  });
  const [waitlistPagination, setWaitlistPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 25,
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: "updatedAt", direction: "desc" });

  useEffect(() => {
    // "banner" hace su propio fetch dentro de BannerManagement.
    if (activeTab === "banner" || loadedTabs.has(activeTab)) return;

    const fetchers: Partial<Record<TabType, () => Promise<void>>> = {
      usuarios: fetchUsers,
      repositorios: fetchRepos,
      waitlist: fetchWaitlist,
      certificados: fetchCertificates,
      workshops: fetchWorkshops,
    };
    const fetcher = fetchers[activeTab];
    if (!fetcher) return;

    setTabLoading(true);
    fetcher().finally(() => {
      setTabLoading(false);
      setLoadedTabs((prev) => new Set(prev).add(activeTab));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, loadedTabs]);

  const fetchRepos = async () => {
    try {
      const response = await fetch("/api/admin/repos");
      const data = await response.json();

      if (response.ok) {
        setRepos(data.repos || []);
      }
    } catch (err) {
      console.error("Failed to fetch repos:", err);
    }
  };

  const fetchWaitlist = async () => {
    try {
      const response = await fetch("/api/admin/waitlist");
      const data = await response.json();

      if (response.ok) {
        setWaitlistEntries(data.entries || []);
      }
    } catch (err) {
      console.error("Failed to fetch waitlist:", err);
    }
  };

  const fetchCertificates = async () => {
    try {
      const certsCollection = collection(db, "certificates");
      const certsSnapshot = await getDocs(certsCollection);
      const data: CertificateEntry[] = certsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CertificateEntry[];
      setCertificates(data);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const workshopsCollection = collection(db, "workshops");
      const workshopsSnapshot = await getDocs(workshopsCollection);
      const data = workshopsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (WorkshopProps & { id: string })[];
      setWorkshops(data);
    } catch (err) {
      console.error("Failed to fetch workshops:", err);
    }
  };

  const closeWorkshopEditor = () => {
    setEditingWorkshopId(null);
    setEditingAbout("");
  };

  useEffect(() => {
    if (!editingWorkshopId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWorkshopEditor();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingWorkshopId]);

  const handleSaveAbout = async (workshopId: string) => {
    setSavingAbout(true);
    try {
      const paragraphs = editingAbout
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      const res = await fetch("/api/admin/workshops", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workshopId, about: paragraphs }),
      });
      if (!res.ok) throw new Error("Failed to update workshop");
      setEditingWorkshopId(null);
      setEditingAbout("");
      setSuccess("About del workshop actualizado");
      setTimeout(() => setSuccess(null), 3000);
      fetchWorkshops();
    } catch (err) {
      console.error("Failed to save about:", err);
      setError("Error al guardar el about");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSavingAbout(false);
    }
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`https://codinglatam.dev/certificados/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCert(true);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: certForm.studentName,
          courseName: certForm.courseName,
          completionDate: certForm.completionDate,
          certificateUrl: certForm.certificateUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create certificate");
      setCertForm({ studentName: "", courseName: "", completionDate: "", certificateUrl: "" });
      setShowCertForm(false);
      setSuccess("Certificado creado exitosamente");
      setTimeout(() => setSuccess(null), 3000);
      fetchCertificates();
    } catch (err) {
      console.error("Failed to create certificate:", err);
      setError("Error al crear el certificado");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSavingCert(false);
    }
  };

  const filteredCertificates = useMemo(() => {
    let result = [...certificates];
    if (certSearch) {
      const search = certSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.studentName.toLowerCase().includes(search) ||
          c.courseName.toLowerCase().includes(search) ||
          c.code.toLowerCase().includes(search)
      );
    }
    return result.sort((a, b) =>
      a.studentName.localeCompare(b.studentName, "es")
    );
  }, [certificates, certSearch]);

  const paginatedCertificates = useMemo(() => {
    const start = (certPagination.currentPage - 1) * certPagination.itemsPerPage;
    return filteredCertificates.slice(start, start + certPagination.itemsPerPage);
  }, [filteredCertificates, certPagination]);

  const paginatedWaitlist = useMemo(() => {
    const start =
      (waitlistPagination.currentPage - 1) * waitlistPagination.itemsPerPage;
    return waitlistEntries.slice(start, start + waitlistPagination.itemsPerPage);
  }, [waitlistEntries, waitlistPagination]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersCollectionDocs = await getDocs(usersCollection);
      const data: AdminUser[] = [];

      usersCollectionDocs.forEach((doc) => {
        const docData = doc.data();
        const user: AdminUser = {
          aud: doc.id,
          email: docData.email || null,
          name: docData.name || null,
          github: docData.github || null,
          isPremium: docData.isPremium || false,
          premiumSince: docData.premiumSince
            ? docData.premiumSince.seconds
              ? new Date(docData.premiumSince.seconds * 1000)
              : new Date(docData.premiumSince)
            : null,
          updatedAt: docData.updatedAt
            ? docData.updatedAt.seconds
              ? new Date(docData.updatedAt.seconds * 1000)
              : new Date(docData.updatedAt)
            : null,
          subscriptionStatus:
            docData.subscriptionStatus ||
            (docData.isPremium ? "active" : undefined),
          subscriptionId: docData.subscriptionId,
          endsAt: docData.endsAt
            ? docData.endsAt.seconds
              ? new Date(docData.endsAt.seconds * 1000)
              : new Date(docData.endsAt)
            : null,
          createdAt: docData.createdAt
            ? docData.createdAt.seconds
              ? new Date(docData.createdAt.seconds * 1000)
              : new Date(docData.createdAt)
            : undefined,
        };
        data.push(user);
      });

      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    }
  };

  const togglePremiumStatus = async (aud: string) => {
    try {
      setUpdatingUser(aud);
      setError(null);
      setSuccess(null);

      const currentUser = users.find((u) => u.aud === aud);
      if (!currentUser) {
        throw new Error("Usuario no encontrado");
      }

      const currentIsPremium = currentUser.isPremium;
      const userName = currentUser.name || currentUser.email || "Usuario";
      const nextIsPremium = !currentIsPremium;

      // Premium writes go through the server (Admin SDK) so client writes to
      // `users` can be denied by Firestore rules (blocks self-granting isPremium).
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aud, isPremium: nextIsPremium }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "Error al actualizar el estado premium");
      }

      setSuccess(
        nextIsPremium
          ? `${userName} ahora tiene acceso premium`
          : `Acceso premium removido para ${userName}`
      );

      await fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el estado premium"
      );
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const filtered = filterUsers(users, filters);
    return sortUsers(filtered, sortConfig.field, sortConfig.direction);
  }, [users, filters, sortConfig]);

  const paginatedUsers = useMemo(() => {
    return paginateUsers(
      filteredUsers,
      pagination.currentPage,
      pagination.itemsPerPage
    );
  }, [filteredUsers, pagination]);

  const metrics = useMemo(() => {
    return calculateMetrics(users);
  }, [users]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      premiumFilter: "all",
      subscriptionFilter: "all",
      dateFilter: "all",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination({ currentPage: 1, itemsPerPage });
  };

  const exportToCSV = () => {
    // Exporta lo filtrado, no todo el dataset
    const headers = [
      "Name",
      "Email",
      "GitHub",
      "Premium Status",
      "Subscription Status",
      "Premium Since",
      "Created At",
      "Updated At",
      "Ends At",
      "Subscription ID"
    ];

    const rows = filteredUsers.map(user => [
      user.name || "",
      user.email || "",
      user.github || "",
      user.isPremium ? "Premium" : "Free",
      user.subscriptionStatus || "",
      user.premiumSince ? new Date(user.premiumSince).toLocaleDateString() : "",
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
      user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "",
      user.endsAt ? new Date(user.endsAt).toLocaleDateString() : "",
      user.subscriptionId || ""
    ]);

    downloadCSV(headers, rows, "usuarios_codinglatam");

    setSuccess(`${filteredUsers.length} usuarios exportados exitosamente`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-0 pt-24 pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white/90 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-400">
          Gestiona usuarios, suscripciones y repositorios de la plataforma
        </p>

        {/* Tabs Navigation */}
        <div className="mt-6 border-b border-white/10">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {tabLoading ? (
        <TabSkeleton withMetrics={activeTab === "usuarios"} />
      ) : (
        <>
      {/* Usuarios Tab */}
      {activeTab === "usuarios" && (
        <>
      <MetricsGrid>
        <MetricsCard
          title="Usuarios Totales"
          value={metrics.totalUsers}
          subtitle={`${metrics.newUsersThisMonth} nuevos este mes`}
          icon={
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
          color="blue"
        />
        <MetricsCard
          title="Usuarios Premium"
          value={metrics.premiumUsers}
          subtitle={`${metrics.conversionRate.toFixed(1)}% tasa de conversión`}
          icon={
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="green"
        />
        <MetricsCard
          title="Suscripciones Activas"
          value={metrics.activeSubscriptions}
          subtitle={`${metrics.churnRate.toFixed(1)}% tasa de cancelación`}
          icon={
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 8a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2h2z" />
            </svg>
          }
          color="purple"
        />
        <MetricsCard
          title="Ingresos Mensuales"
          value={`${metrics.monthlyRecurringRevenue.toLocaleString()}`}
          subtitle="MRR Estimado"
          icon={
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="yellow"
        />
      </MetricsGrid>

      <FilterBar
        searchTerm={filters.searchTerm}
        onSearchChange={(term) => handleFilterChange({ searchTerm: term })}
        premiumFilter={filters.premiumFilter}
        onPremiumFilterChange={(filter) =>
          handleFilterChange({ premiumFilter: filter })
        }
        subscriptionFilter={filters.subscriptionFilter}
        onSubscriptionFilterChange={(filter) =>
          handleFilterChange({ subscriptionFilter: filter })
        }
        dateFilter={filters.dateFilter}
        onDateFilterChange={(filter) =>
          handleFilterChange({ dateFilter: filter })
        }
        onResetFilters={handleResetFilters}
        totalFilteredUsers={filteredUsers.length}
        totalUsers={users.length}
      />

      {/* Export Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={exportToCSV}
          className={ui.btnPrimary}
        >
          <Download className="h-5 w-5" />
          Exportar a CSV ({filteredUsers.length} usuarios)
        </button>
      </div>

      <div className={ui.card}>
        <div className="overflow-x-auto">
          <table className={ui.table}>
            <thead className={ui.thead}>
              <tr>
                <SortableHeader
                  label="Usuario"
                  field="name"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Correo"
                  field="email"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <th scope="col" className={ui.th}>
                  Suscripción
                </th>
                <SortableHeader
                  label="Premium Desde"
                  field="premiumSince"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Última Actualización"
                  field="updatedAt"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <th scope="col" className={ui.th}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={ui.tbody}>
              {paginatedUsers.map((user) => (
                <tr key={user.aud} className={ui.tr}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-zinc-300">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-zinc-100">
                          {user.name || "Sin nombre"}
                        </div>
                        <div className="text-sm text-zinc-500">
                          Se unió {formatRelativeDate(user.createdAt || null)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-300">
                      {user.email || "Sin correo"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start space-y-1">
                      <span
                        className={user.isPremium ? badge("emerald") : badge("zinc")}
                      >
                        {user.isPremium ? "Premium" : "Gratis"}
                      </span>
                      {user.subscriptionStatus && (
                        <span
                          className={getSubscriptionStatusColor(
                            user.subscriptionStatus
                          )}
                        >
                          {user.subscriptionStatus}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={ui.td}>
                    {formatRelativeDate(user.premiumSince)}
                  </td>
                  <td className={ui.td}>
                    {formatRelativeDate(user.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        user.isPremium
                          ? setConfirmUser(user)
                          : togglePremiumStatus(user.aud)
                      }
                      disabled={updatingUser === user.aud}
                      className={
                        updatingUser === user.aud
                          ? ui.btnGhost
                          : user.isPremium
                          ? ui.btnDanger
                          : ui.btnSuccess
                      }
                    >
                      {updatingUser === user.aud ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Actualizando...
                        </>
                      ) : (
                        user.isPremium ? "Quitar Premium" : "Hacer Premium"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
        </>
      )}

      {/* Repositorios Tab */}
      {activeTab === "repositorios" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white/90">
              Gestión de Repositorios
            </h2>
            <button
              onClick={() => {
                setShowRepoForm(!showRepoForm);
                setEditingRepo(null);
              }}
              className={ui.btnPrimary}
            >
              <Plus className="h-5 w-5" />
              {showRepoForm || editingRepo ? "Cancelar" : "Nuevo Repositorio"}
            </button>
          </div>

          {(showRepoForm || editingRepo) && (
            <AddRepoForm
              mode={editingRepo ? 'edit' : 'create'}
              initialData={editingRepo}
              onSuccess={() => {
                setShowRepoForm(false);
                setEditingRepo(null);
                fetchRepos();
                setSuccess(editingRepo ? "Repositorio actualizado exitosamente" : "Repositorio creado exitosamente");
                setTimeout(() => setSuccess(null), 3000);
              }}
              onCancel={() => {
                setShowRepoForm(false);
                setEditingRepo(null);
              }}
            />
          )}

          <ReposTable
            repos={repos}
            onDelete={fetchRepos}
            onEdit={(repo) => {
              setEditingRepo(repo);
              setShowRepoForm(false);
            }}
          />
        </div>
      )}

      {/* Banner Tab */}
      {activeTab === "banner" && (
        <BannerManagement
          onSuccess={() => {
            setSuccess("Banner actualizado exitosamente");
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      )}

      {/* Certificados Tab */}
      {activeTab === "certificados" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white/90">
                Certificados
              </h2>
              <p className="text-gray-400 mt-1">
                {certificates.length} {certificates.length === 1 ? 'certificado emitido' : 'certificados emitidos'}
              </p>
            </div>
            <button
              onClick={() => setShowCertForm(true)}
              className={ui.btnPrimary}
            >
              <Plus className="h-5 w-5" />
              Nuevo Certificado
            </button>
          </div>

          {showCertForm && (
            <div className={`${ui.cardPadded} mb-6`}>
              <h3 className="text-lg font-semibold text-white mb-4">Crear Certificado</h3>
              <form onSubmit={handleCreateCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={ui.label}>
                    Nombre del estudiante *
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.studentName}
                    onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                    placeholder="Juan Pérez"
                    className={ui.input}
                  />
                </div>
                <div>
                  <label className={ui.label}>
                    Nombre del curso *
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.courseName}
                    onChange={(e) => setCertForm({ ...certForm, courseName: e.target.value })}
                    placeholder="Curso de Claude Code"
                    className={ui.input}
                  />
                </div>
                <div>
                  <label className={ui.label}>
                    Fecha de finalización *
                  </label>
                  <input
                    type="date"
                    required
                    value={certForm.completionDate}
                    onChange={(e) => setCertForm({ ...certForm, completionDate: e.target.value })}
                    className={`${ui.input} [color-scheme:dark]`}
                  />
                </div>
                <div>
                  <label className={ui.label}>
                    URL del PDF (opcional)
                  </label>
                  <input
                    type="url"
                    value={certForm.certificateUrl}
                    onChange={(e) => setCertForm({ ...certForm, certificateUrl: e.target.value })}
                    placeholder="https://..."
                    className={ui.input}
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCertForm(false);
                      setCertForm({ studentName: "", courseName: "", completionDate: "", certificateUrl: "" });
                    }}
                    className={ui.btnGhost}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingCert}
                    className={ui.btnPrimary}
                  >
                    {savingCert ? "Guardando..." : "Crear Certificado"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              value={certSearch}
              onChange={(e) => {
                setCertSearch(e.target.value);
                setCertPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              placeholder="Buscar por nombre, curso o código..."
              aria-label="Buscar certificados por nombre, curso o código"
              className={`${ui.input} max-w-md`}
            />
          </div>

          <div className={ui.card}>
            <div className="overflow-x-auto">
              <table className={ui.table}>
                <thead className={ui.thead}>
                  <tr>
                    <th className={ui.th}>
                      Estudiante
                    </th>
                    <th className={ui.th}>
                      Curso
                    </th>
                    <th className={ui.th}>
                      Fecha
                    </th>
                    <th className={ui.th}>
                      Link
                    </th>
                    <th className={ui.th}>
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody className={ui.tbody}>
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={ui.tdEmpty}>
                        {certSearch ? "No se encontraron certificados" : "No hay certificados aún"}
                      </td>
                    </tr>
                  ) : (
                    paginatedCertificates.map((cert) => (
                      <tr key={cert.id} className={ui.tr}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-zinc-100">
                            {cert.studentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={badge("indigo")}>
                            {cert.courseName}
                          </span>
                        </td>
                        <td className={ui.td}>
                          {new Date(cert.completionDate).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => copyLink(cert.code)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
                          >
                            {copiedCode === cert.code ? (
                              <>
                                <Check className="h-4 w-4 text-emerald-400" />
                                <span className="text-emerald-400">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copiar link
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cert.certificateUrl ? (
                            <a
                              href={cert.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Ver PDF
                            </a>
                          ) : (
                            <span className="text-sm text-zinc-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={certPagination.currentPage}
              totalItems={filteredCertificates.length}
              itemsPerPage={certPagination.itemsPerPage}
              onPageChange={(page) =>
                setCertPagination((prev) => ({ ...prev, currentPage: page }))
              }
              onItemsPerPageChange={(itemsPerPage) =>
                setCertPagination({ currentPage: 1, itemsPerPage })
              }
            />
          </div>
        </div>
      )}

      {/* Workshops Tab */}
      {activeTab === "workshops" && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white/90">Workshops</h2>
            <p className="text-gray-400 mt-1">
              {workshops.length} {workshops.length === 1 ? "workshop" : "workshops"}
            </p>
          </div>

          <div className={ui.card}>
            <div className="overflow-x-auto">
              <table className={ui.table}>
                <thead className={ui.thead}>
                  <tr>
                    <th className={ui.th}>
                      Título
                    </th>
                    <th className={ui.th}>
                      Estado
                    </th>
                    <th className={ui.th}>
                      About
                    </th>
                    <th className={ui.th}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={ui.tbody}>
                  {workshops.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={ui.tdEmpty}>
                        No hay workshops aún
                      </td>
                    </tr>
                  ) : (
                    workshops.map((ws) => (
                      <tr key={ws.id} className={ui.tr}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-zinc-100">{ws.title}</div>
                          <div className="text-xs text-zinc-500">{ws.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={ws.available ? badge("emerald") : badge("amber")}
                          >
                            {ws.available ? "Disponible" : "Próximamente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-500">
                            {ws.about && ws.about.length > 0
                              ? `${ws.about.length} párrafo${ws.about.length === 1 ? "" : "s"}`
                              : "Sin personalizar"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingWorkshopId(ws.id);
                              setEditingAbout(ws.about?.join("\n") || "");
                            }}
                            className={ui.btnGhost}
                          >
                            <Pencil className="h-4 w-4" />
                            Editar About
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {editingWorkshopId && (
            <div
              className="fixed inset-0 z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="workshop-drawer-title"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closeWorkshopEditor}
              />
              <div className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-light-black p-6 shadow-2xl shadow-black/50 animate-[admin-drawer-in_0.25s_ease-out]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      id="workshop-drawer-title"
                      className="text-lg font-semibold text-white"
                    >
                      Editar About
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {workshops.find((w) => w.id === editingWorkshopId)?.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeWorkshopEditor}
                    aria-label="Cerrar editor"
                    className="text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="mt-4 text-sm text-zinc-500">
                  Escribe cada párrafo en una línea separada.
                </p>
                <textarea
                  value={editingAbout}
                  onChange={(e) => setEditingAbout(e.target.value)}
                  rows={14}
                  autoFocus
                  className={`${ui.input} mt-2 flex-1 resize-none`}
                  placeholder={"Primer párrafo del about...\n\nSegundo párrafo..."}
                />
                <div className="mt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={closeWorkshopEditor}
                    className={ui.btnGhost}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSaveAbout(editingWorkshopId)}
                    disabled={savingAbout}
                    className={ui.btnPrimary}
                  >
                    <Save className="h-4 w-4" />
                    {savingAbout ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Waitlist Tab */}
      {activeTab === "waitlist" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white/90">
                Lista de Espera
              </h2>
              <p className="text-gray-400 mt-1">
                {waitlistEntries.length} {waitlistEntries.length === 1 ? 'persona registrada' : 'personas registradas'}
              </p>
            </div>
            <button
              onClick={() => {
                downloadCSV(
                  ["Email", "Fecha de Registro", "Fuente", "Estado"],
                  waitlistEntries.map(entry => [
                    entry.email,
                    new Date(entry.timestamp).toLocaleString('es-ES'),
                    entry.source,
                    entry.status
                  ]),
                  "waitlist"
                );
                setSuccess(`${waitlistEntries.length} entradas exportadas exitosamente`);
                setTimeout(() => setSuccess(null), 3000);
              }}
              className={ui.btnPrimary}
            >
              <Download className="h-5 w-5" />
              Exportar a CSV ({waitlistEntries.length})
            </button>
          </div>

          <div className={ui.card}>
            <div className="overflow-x-auto">
              <table className={ui.table}>
                <thead className={ui.thead}>
                  <tr>
                    <th className={ui.th}>
                      Email
                    </th>
                    <th className={ui.th}>
                      Fecha de Registro
                    </th>
                    <th className={ui.th}>
                      Fuente
                    </th>
                    <th className={ui.th}>
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className={ui.tbody}>
                  {waitlistEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={ui.tdEmpty}>
                        No hay entradas en la waitlist aún
                      </td>
                    </tr>
                  ) : (
                    paginatedWaitlist.map((entry) => (
                      <tr key={entry.id} className={ui.tr}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-indigo-400">
                                  {entry.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-zinc-100">
                                {entry.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-zinc-300">
                            {new Date(entry.timestamp).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {formatRelativeDate(new Date(entry.timestamp))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={badge("blue")}>
                            {entry.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            entry.status === 'pending'
                              ? badge('amber')
                              : entry.status === 'notified'
                              ? badge('blue')
                              : badge('emerald')
                          }>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={waitlistPagination.currentPage}
              totalItems={waitlistEntries.length}
              itemsPerPage={waitlistPagination.itemsPerPage}
              onPageChange={(page) =>
                setWaitlistPagination((prev) => ({ ...prev, currentPage: page }))
              }
              onItemsPerPageChange={(itemsPerPage) =>
                setWaitlistPagination({ currentPage: 1, itemsPerPage })
              }
            />
          </div>
        </div>
      )}

        </>
      )}

      {/* Feedback y confirmaciones */}
      <Toast success={success} error={error} />
      <ConfirmDialog
        open={confirmUser !== null}
        title="Quitar acceso premium"
        description={
          confirmUser && (
            <>
              Vas a quitarle el acceso premium a{" "}
              <span className="font-semibold text-zinc-200">
                {confirmUser.name || confirmUser.email || "este usuario"}
              </span>
              . Perderá el acceso a todo el contenido de pago inmediatamente.
            </>
          )
        }
        confirmLabel="Sí, quitar premium"
        tone="danger"
        onConfirm={() => {
          if (confirmUser) togglePremiumStatus(confirmUser.aud);
          setConfirmUser(null);
        }}
        onCancel={() => setConfirmUser(null)}
      />
    </div>
  );
}
