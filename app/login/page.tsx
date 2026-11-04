"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("sonu");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/dashboard";
    } else {
      setError(data.error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>

        <div>
          <label className="mb-2 block text-gray-700">Username</label>
          <input
            className="w-full rounded border p-3 text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full rounded border p-3 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
