import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

export default function NavBar() {
  const { user } = useUser();
  
  // Link to sign-in if not authenticated, otherwise link to admin dashboard
  const dashboardLink = user.isAuthenticated ? '/admin' : '/signin';

  return (
    <nav className="nav-bar">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? "nav-link nav-link--active" : "nav-link"
        }
      >
        Overview
      </NavLink>
      <NavLink
        to={dashboardLink}
        className={({ isActive }) =>
          isActive ? "nav-link nav-link--active" : "nav-link"
        }
      >
        Dashboard
      </NavLink>
    </nav>
  );
}
