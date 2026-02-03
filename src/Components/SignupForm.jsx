import { useState } from "react";

export default function SignupForm({ onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/signup", {
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
      setError(data.message || "Signup failed");
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="username" placeholder="Username" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="password" name="confirmpassword" placeholder="Confirm Password" onChange={handleChange} className="w-full border p-2 rounded" />

      {error && <p className="text-red-500">{error}</p>}

      <button className="w-full bg-green-600 text-white py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}
