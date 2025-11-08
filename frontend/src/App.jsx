import {
    BrowserRouter,
    Outlet,
    Route,
    Routes
} from "react-router-dom";
import Header from "./components/Header.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Overview from "./pages/Overview.jsx";

function Layout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />

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
