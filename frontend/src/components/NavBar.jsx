import { NavLink } from "react-router-dom";

export default function NavBar() {
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
        to="/admin"
        className={({ isActive }) =>
          isActive ? "nav-link nav-link--active" : "nav-link"
        }
      >
        Admin Dashboard
      </NavLink>
    </nav>
  );
}
