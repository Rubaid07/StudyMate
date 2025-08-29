// import React, { useContext, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import DashboardWidgets from '../components/dashboard/DashboardWidgets';

// const Dashboard = () => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     // এই main ট্যাগটি DashboardLayout এর Outlet এর বদলে রেন্ডার হবে
//     <main className="flex-1 p-6 overflow-y-auto"> 
//       {/* Greeting */}
//       <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.displayName || 'StudyMate User'}!
//         </h1>
//         <p className="text-gray-500">
//           Here's your overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//         </p>
//       </div>

//       <DashboardWidgets />
//     </main>
//   );
// };

// export default Dashboard;
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    // এই main ট্যাগটি DashboardLayout এর Outlet এর বদলে রেন্ডার হবে
    <main className="flex-1 p-6 overflow-y-auto"> 
      {/* Greeting */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.displayName || 'StudyMate User'}!
        </h1>
        <p className="text-gray-500">
          Here's your overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <DashboardWidgets />
    </main>
  );
};

export default DashboardPage;