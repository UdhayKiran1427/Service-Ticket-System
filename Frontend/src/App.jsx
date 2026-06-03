import "./App.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignIn from './pages/SignIn.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateTicket from './pages/CreateTicket.jsx';
import NotFound from './pages/NotFound.jsx';
import TicketsPages from './pages/TicketsPages.jsx';
import { ProtectedRoutes } from './auth/ProtectedRoutes.jsx';
import Navbar from "./pages/Navbar.jsx";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
