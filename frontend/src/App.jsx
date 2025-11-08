import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  NavLink,
} from "react-router-dom";
import Overview from "./pages/Overview.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function Layout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 20px",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
        }}
      >
        <strong style={{ marginRight: 12 }}>My App</strong>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#6366f1" : "#111",
            fontWeight: isActive ? "600" : "400",
          })}
        >
          Overview
        </NavLink>
        <NavLink
          to="/admin"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#6366f1" : "#111",
            fontWeight: isActive ? "600" : "400",
          })}
        >
          Admin Dashboard
        </NavLink>
      </header>

      <main style={{ padding: 24, flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
