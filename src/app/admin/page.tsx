// // app/admin/users/page.tsx
// "use client";
// import { useState, useEffect } from "react";
// // import { useAuth } from "../auth/auth-context";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// interface User {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
//   isPremium: boolean;
//   createdAt: string;
// }

// export default function AdminDashboard() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useAuth();
//   const router = useRouter();

//   // Add your admin emails here

//   useEffect(() => {
//     const ADMIN_EMAILS = ["angelokta7@gmail.com"];
//     // Check if user is admin
//     if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
//       router.push("/");
//       return;
//     }

//     fetchUsers();
//   }, [user, router]);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("/api/admin/users");
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error);

//       setUsers(data.users);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePremiumStatus = async (uid: string, currentStatus: boolean) => {
//     try {
//       const response = await fetch("/api/admin/users", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           uid,
//           isPremium: !currentStatus,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error);

//       // Update local state
//       setUsers(
//         users.map((user) =>
//           user.uid === uid ? { ...user, isPremium: !currentStatus } : user
//         )
//       );
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to update premium status"
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">User Management Dashboard</h1>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Created At
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Premium Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user.uid}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center gap-2">
//                     <div className="relative h-8 w-8">
//                       {user.photoURL && (
//                         <Image
//                           className="h-8 w-8 rounded-full mr-3"
//                           src={user.photoURL}
//                           alt=""
//                           fill
//                         />
//                       )}
//                     </div>

//                     <div>{user.displayName || "No name"}</div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {user.email || "No email"}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       user.isPremium
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {user.isPremium ? "Premium" : "Free"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <button
//                     onClick={() =>
//                       togglePremiumStatus(user.uid, user.isPremium)
//                     }
//                     className={`px-3 py-1 rounded text-sm font-medium ${
//                       user.isPremium
//                         ? "bg-red-100 text-red-700 hover:bg-red-200"
//                         : "bg-green-100 text-green-700 hover:bg-green-200"
//                     }`}
//                   >
//                     {user.isPremium ? "Remove Premium" : "Make Premium"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
