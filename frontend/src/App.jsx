import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/header.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Donate from "./pages/Donate.jsx";
import Overview from "./pages/Overview.jsx";
import SignIn from "./pages/SignIn.jsx";

function Layout() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <NavBar />

      <main style={{ padding: 24, flex: 1 }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="donate" element={<Donate />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
