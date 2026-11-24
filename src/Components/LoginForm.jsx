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
        <p className="rounded-xl border border-basil-100 bg-basil-50 p-3 text-sm text-basil-700">{notice}</p>
      )}

      <input
        className="w-full border border-line px-3.5 py-2.5 rounded-xl outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border border-line px-3.5 py-2.5 rounded-xl outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-paprika-200 bg-paprika-50 p-3 text-sm font-semibold text-paprika-800">
          {error}
        </p>
      )}

      <button disabled={loading} className="w-full bg-paprika-600 hover:bg-paprika-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60">
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
