import DashboardPlaceholder from "./components/Dashboardplaceholder.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <DashboardPlaceholder />
      </div>
    </div>
  );
}
