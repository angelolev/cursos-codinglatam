"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
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
} from "@/utils/adminHelpers";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import MetricsCard, { MetricsGrid } from "@/components/admin/MetricsCard";
import AddRepoForm from "@/components/admin/AddRepoForm";
import ReposTable from "@/components/admin/ReposTable";
import BannerManagement from "@/components/admin/BannerManagement";
import { StarterRepoProps } from "@/types/starter-repo";
import { Plus } from "lucide-react";

type TabType = "usuarios" | "repositorios" | "banner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("usuarios");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [repos, setRepos] = useState<(StarterRepoProps & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
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
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({ field: "updatedAt", direction: "desc" });

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchUsers();
    fetchRepos();
  }, [session, router]);

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
    } finally {
      setLoading(false);
    }
  };

  const togglePremiumStatus = async (aud: string) => {
    try {
      setUpdatingUser(aud);
      setError(null);
      setSuccess(null);

      const docRef = doc(db, "users", aud);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Usuario no encontrado");
      }

      const userData = docSnap.data();
      const currentIsPremium = userData.isPremium;
      const userName = userData.name || userData.email || "Usuario";
      const now = new Date();

      if (!currentIsPremium) {
        // Making user premium
        await updateDoc(docRef, {
          isPremium: true,
          premiumSince: now,
          updatedAt: now,
          subscriptionStatus: "active",
        });
        setSuccess(`${userName} ahora tiene acceso premium`);
      } else {
        // Removing premium status
        await updateDoc(docRef, {
          isPremium: false,
          premiumSince: null,
          updatedAt: now,
          subscriptionStatus: "cancelled",
          subscriptionId: null,
          endsAt: null,
        });
        setSuccess(`Acceso premium removido para ${userName}`);
      }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !users.length) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

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
        <div className="mt-6 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("usuarios")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "usuarios"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab("repositorios")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "repositorios"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Repositorios
            </button>
            <button
              onClick={() => setActiveTab("banner")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "banner"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Banner
            </button>
          </nav>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Usuarios Tab */}
      {activeTab === "usuarios" && (
        <>
      <MetricsGrid>
        <MetricsCard
          title="Usuarios Totales"
          value={metrics.totalUsers}
          subtitle={`${metrics.newUsersThisMonth} nuevos este mes`}
          trend={{
            value: 12.5,
            isPositive: true,
            period: "vs el mes pasado",
          }}
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
          trend={{
            value: 8.2,
            isPositive: true,
            period: "vs el mes pasado",
          }}
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
          trend={{
            value: 2.1,
            isPositive: false,
            period: "vs el mes pasado",
          }}
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
          trend={{
            value: 15.3,
            isPositive: true,
            period: "vs el mes pasado",
          }}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Usuario</span>
                    {sortConfig.field === "name" && (
                      <svg
                        className={`w-3 h-3 ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Correo</span>
                    {sortConfig.field === "email" && (
                      <svg
                        className={`w-3 h-3 ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suscripción
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("premiumSince")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Premium Desde</span>
                    {sortConfig.field === "premiumSince" && (
                      <svg
                        className={`w-3 h-3 ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("updatedAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Última Actualización</span>
                    {sortConfig.field === "updatedAt" && (
                      <svg
                        className={`w-3 h-3 ${
                          sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.aud} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || "Sin nombre"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Se unió {formatRelativeDate(user.createdAt || null)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.email || "Sin correo"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isPremium
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isPremium ? "Premium" : "Gratis"}
                      </span>
                      {user.subscriptionStatus && (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSubscriptionStatusColor(
                            user.subscriptionStatus
                          )}`}
                        >
                          {user.subscriptionStatus}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatRelativeDate(user.premiumSince)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatRelativeDate(user.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => togglePremiumStatus(user.aud)}
                      disabled={updatingUser === user.aud}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center ${
                        updatingUser === user.aud
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : user.isPremium
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {updatingUser === user.aud ? (
                        <>
                          <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
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
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
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
    </div>
  );
}
