import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getApiBase, setApiBase } from "../utils/helpers";

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [apiUrl, setApiUrl] = useState(getApiBase);

  function handleSave() {
    setApiBase(apiUrl);
    window.location.reload();
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">FS</span>
        <div>
          <strong>Fashion Store</strong>
          <small>Commerce dashboard</small>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
          Shop
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
          Cart <span id="cart-count">{totalCount}</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
          Orders
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            Admin
          </NavLink>
        )}
      </nav>

      <div className="api-panel">
        <label htmlFor="api-base">API base</label>
        <input id="api-base" type="url" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
        <button className="secondary-button" type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </aside>
  );
}
