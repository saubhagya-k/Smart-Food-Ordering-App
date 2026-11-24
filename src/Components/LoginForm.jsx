import { useState } from "react";
import { API_URL } from './../../Utils/api';

export default function LoginForm({ onSuccess, initialEmail = "", notice = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        onSuccess();
      }
    } catch {
      setError("Can't reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {notice && (
        <p className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">{notice}</p>
      )}

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-2 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
          ⚠️ {error}
        </p>
      )}

      <button disabled={loading} className="w-full bg-amber-500 text-white py-2 rounded disabled:opacity-60">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
