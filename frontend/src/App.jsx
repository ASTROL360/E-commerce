import { useState, useCallback } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AuthModal from "./components/AuthModal";
import ConfirmDialog from "./components/ConfirmDialog";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";

function AdminGuard({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const { logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const handleEditProduct = useCallback((product) => {
    setEditProduct(product);
  }, []);

  const handleClearEdit = useCallback(() => {
    setEditProduct(null);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar path={location.pathname} onOpenAuth={() => setAuthOpen(true)} onLogoutRequest={() => setLogoutConfirmOpen(true)} />
        <Routes>
          <Route
            path="/"
            element={
              <ShopPage onEditProduct={handleEditProduct} onOpenAuth={() => setAuthOpen(true)} />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminPage editProduct={editProduct} onClearEdit={handleClearEdit} />
              </AdminGuard>
            }
          />
        </Routes>
      </main>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Logout"
        message="Are you sure you want to log out?"
        onConfirm={() => { logout(); setLogoutConfirmOpen(false); }}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
