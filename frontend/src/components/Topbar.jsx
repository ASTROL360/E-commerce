import { useAuth } from "../context/AuthContext";

const titles = {
  "/": ["Shop", "Browse products, manage cart, and checkout."],
  "/cart": ["Cart", "Review selected items before checkout."],
  "/orders": ["Orders", "Track your order history."],
  "/admin": ["Admin", "Manage categories, products, and order status."],
};

export default function Topbar({ path, onOpenAuth, onLogoutRequest }) {
  const { user, isLoggedIn } = useAuth();
  const [title, subtitle] = titles[path] || ["", ""];

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="auth-area">
        {isLoggedIn && (
          <>
            <span className="user-chip">
              {user.name} - {user.role}
            </span>
            <button className="secondary-button" type="button" onClick={onLogoutRequest}>
              Logout
            </button>
          </>
        )}
        {!isLoggedIn && (
          <button className="primary-button" type="button" onClick={onOpenAuth}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
