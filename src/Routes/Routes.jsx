import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import ExamQAGenerator from '../components/features/ExamQAGenerator';
import ClassTracker from '../components/features/ClassTracker';
import StudyPlanner from '../components/features/StudyPlanner';
import BudgetTracker from '../components/features/BudgetTracker';
import WellnessTracker from "../components/features/WellnessTracker";
import StudySession from "../components/features/StudySession";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute publicOnly={true}><MainLayout /></ProtectedRoute>,
    children: [
    ]
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <ProtectedRoute publicOnly={true}><Login /></ProtectedRoute>
      },
      {
        path: 'register', 
        element: <ProtectedRoute publicOnly={true}><Register/></ProtectedRoute>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'classes',
        element: <ClassTracker />
      },
      {
        path: 'budget',
        element: <BudgetTracker /> 
      },
      {
        path: 'planner',
        element: <StudyPlanner />
      },
      {
        path: 'exam-qa',
        element: <ExamQAGenerator />
      },
      {
        path: 'wellness',
        element: <WellnessTracker />
      },
      {
        path: 'study-session',
        element: <StudySession />
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
