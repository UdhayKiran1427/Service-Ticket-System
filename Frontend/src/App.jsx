import "./App.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignIn from './pages/SignIn.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateTicket from './pages/CreateTicket.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import TicketsPages from './pages/TicketsPages.jsx';
import { ProtectedRoutes } from './auth/ProtectedRoutes.jsx';
import { useAuth } from './auth/AuthProvider.jsx';
import Navbar from "./pages/Navbar.jsx";
import MyTickets from "./pages/MyTickets.jsx";

const RootRedirect = () => {
  const { isAuthed, user } = useAuth();
  
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (user?.role === 'technician') {
    return <Navigate to="/technician-tickets" replace />;
  }
  
  return <Navigate to="/tickets" replace />;
};

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/technician-tickets"
        element={
          <ProtectedRoutes allowedRoles={["technician"]}>
            <MyTickets />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoutes>
            <TicketsPages />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/create-ticket"
        element={
          <ProtectedRoutes allowedRoles={["admin", "user"]}>
            <CreateTicket />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
