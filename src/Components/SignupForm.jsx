import { useState } from "react";
import { API_URL } from './../../Utils/api'

export default function SignupForm({ onSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  // { message, field } — field is "email" or "username" when it's already taken
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        // Stop here and tell the user what to change
        setError({ message: data.message || "Signup failed. Please try again.", field: data.field });
        return;
      }

      onSuccess(form.email);
    } catch {
      setError({ message: "Can't reach the server. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = (name) =>
    `w-full border border-line px-3.5 py-2.5 rounded-xl outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100 ${error?.field === name ? "border-paprika-600 bg-paprika-50" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className={fieldClass("username")} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className={fieldClass("email")} />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border border-line px-3.5 py-2.5 rounded-xl outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100" />
      <input type="password" name="confirmpassword" placeholder="Confirm Password" value={form.confirmpassword} onChange={handleChange} className="w-full border border-line px-3.5 py-2.5 rounded-xl outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100" />

      {error && (
        <div role="alert" className="rounded-xl border border-paprika-200 bg-paprika-50 p-3 text-sm text-paprika-800">
          <p className="font-semibold">{error.message}</p>
          {error.field === "email" && onSwitchToLogin && (
            <button type="button" onClick={onSwitchToLogin} className="mt-1 font-semibold text-paprika-700 underline">
              Log in instead
            </button>
          )}
        </div>
      )}

      <button disabled={loading} className="w-full bg-paprika-600 hover:bg-paprika-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60">
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
