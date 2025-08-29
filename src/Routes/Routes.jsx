// src/Routes/Routes

import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import ExamQAGenerator from '../components/features/ExamQAGenerator';


export const router = createBrowserRouter([
  {
    path: "/",
    // এই রুটটি শুধুমাত্র লগইনবিহীন ইউজারদের জন্য। লগইন করা থাকলে Dashboard এ রিডাইরেক্ট করবে।
    element: <ProtectedRoute publicOnly={true}><MainLayout /></ProtectedRoute>,
    children: [
      // যদি MainLayout এর ভিতরে কোনো চাইল্ড কন্টেন্ট রেন্ডার করার প্রয়োজন হয়, তবে এখানে যোগ করতে পারেন।
      // বর্তমানে MainLayout তার নিজের LandingPageNavbar এবং Outlet রেন্ডার করে।
    ]
  },
  {
    path: "/", // এই রুটটি /login এবং /register এর জন্য AuthLayout ব্যবহার করবে
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        // লগইন পেজও শুধুমাত্র পাবলিক ইউজারদের জন্য।
        element: <ProtectedRoute publicOnly={true}><Login /></ProtectedRoute>
      },
      {
        path: 'register', 
        // সাইনআপ পেজও শুধুমাত্র পাবলিক ইউজারদের জন্য।
        element: <ProtectedRoute publicOnly={true}><Register/></ProtectedRoute>
      }
    ]
  },
  {
    path: '/dashboard',
    // ড্যাশবোর্ডের মূল রুট, এটি লগইন করা ইউজারদের জন্য সুরক্ষিত।
    // DashboardLayout ড্যাশবোর্ড Navbar এবং Sidebar হ্যান্ডেল করবে।
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true, // `/dashboard` পাথের জন্য ডিফল্ট কম্পোনেন্ট (Dashboard Widgets দেখাবে)
        element: <DashboardPage />
      },
      {
        // path: 'classes',
        // element: <ClassTrackerPage />
      },
      {
        // path: 'budget',
        // element: <BudgetTrackerPage /> 
      },
      {
        // path: 'planner',
        // element: <StudyPlannerPage />
      },
      {
        path: 'exam-qa',
        element: <ExamQAGenerator />
      },
      {
        // path: 'unique-feature',
        // element: <UniqueFeaturePage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
