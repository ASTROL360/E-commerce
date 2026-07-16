import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ open, onClose, onSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }

  function toggleMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      reset();
      onClose();
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <dialog className="modal" open onClick={(e) => e.stopPropagation()}>
        <form className="form-grid" onSubmit={handleSubmit}>
          <h2>{mode === "login" ? "Login" : "Create Account"}</h2>
          {error && <div className="alert">{error}</div>}
          {mode === "register" && (
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={toggleMode}>
              {mode === "login" ? "Create account" : "Use login"}
            </button>
            <button className="primary-button" type="submit">
              Continue
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
