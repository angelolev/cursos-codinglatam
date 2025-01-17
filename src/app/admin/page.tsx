// app/admin/users/page.tsx
"use client";
import { useState, useEffect } from "react";
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

interface User {
  aud: string;
  email: string | null;
  github: string | null;
  isPremium: boolean;
  name: string | null;
  premiumSince: Date | null;
  updatedAt: Date | null;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchUsers();
  }, [session, router]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersCollectionDocs = await getDocs(usersCollection);
      const data: User[] = [];

      usersCollectionDocs.forEach((doc) => {
        const docData = doc.data() as User;
        docData.aud = doc.id;
        data.push(docData);
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
      const docRef = doc(db, "users", aud);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const newDate = new Date();
        const currentIsPremium = docSnap.data().isPremium;
        await updateDoc(docRef, {
          isPremium: !currentIsPremium,
          premiumSince: newDate.setMonth(newDate.getMonth()),
          updatedAt: newDate.setMonth(newDate.getMonth() + 1),
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update premium status"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Management Dashboard</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium Since
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Update At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premium Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.aud}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                      {/* {user.photoURL && (
                        <Image
                          className="h-8 w-8 rounded-full mr-3"
                          src={user.photoURL}
                          alt=""
                          fill
                        />
                      )} */}
                    </div>

                    <div>{user.name || "No name"}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email || "No email"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.premiumSince
                    ? new Date(user.premiumSince).toLocaleDateString()
                    : "No date"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "No date"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isPremium
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.isPremium ? "Premium" : "Free"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => togglePremiumStatus(user.aud)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.isPremium
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {user.isPremium ? "Remove Premium" : "Make Premium"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
