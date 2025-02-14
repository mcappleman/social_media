/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle credentials login
  const handleCredentialsLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // On successful login, redirect to a protected page (e.g., dashboard)
        router.push("/dashboard");
      } else {
        // Display error message from server response
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle SSO login for a given provider
  const handleSSOLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError(null);
    try {
      // You can optionally pass a callback URL if needed:
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("SSO sign in failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* Display error messages */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        {/* Credentials Login Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr className="my-6" />

        {/* SSO Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleSSOLogin("google")}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign in with Google"}
          </button>
          <button
            onClick={() => handleSSOLogin("facebook")}
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign in with Facebook"}
          </button>
        </div>
      </div>
    </div>
  );
}
