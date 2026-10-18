import { Link, NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm px-4">
      <div className="container-fluid">
        {/* Brand / Logo */}
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{ color: "#1e1b4b" }}
        >
          JobPortal
        </Link>

        {/* Nav Links (Simple, No Toggle) */}
        <div className="navbar-nav ms-auto gap-3">
          <NavLink
            className={({ isActive }) =>
              `nav-link fw-semibold ${isActive ? "text-primary" : "text-muted"}`
            }
            to="/"
          >
            Categories
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-link fw-semibold ${isActive ? "text-primary" : "text-muted"}`
            }
            to="/companies"
          >
            Companies
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav-link fw-semibold ${isActive ? "text-primary" : "text-muted"}`
            }
            to="/company-jobs"
          >
            Job Vacancies
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
