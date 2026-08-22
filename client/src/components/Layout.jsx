import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

function Layout() {
  return (
    <>
     <nav className="navbar">

  <div className="logo">
   Adhikar<span>AI</span>
  </div>

  <div className="nav-links">

    <NavLink to="/">
      Home
    </NavLink>

    <NavLink to="/rights">
      Rights Navigator
    </NavLink>

    <NavLink to="/rti">
      RTI Drafting
    </NavLink>

    <NavLink to="/schemes">
      Schemes
    </NavLink>

    <NavLink to="/forms">
      Form Filler
    </NavLink>

    <NavLink to="/about">
      About
    </NavLink>

  </div>
</nav>
 <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;