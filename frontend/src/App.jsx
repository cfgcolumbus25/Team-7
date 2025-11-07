import DashboardPlaceholder from './components/dashboardplaceholder.jsx'
import Header from './components/header.jsx'
import Sidebar from './components/sidebar.jsx'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <DashboardPlaceholder />
      </div>
    </div>
  )
}
