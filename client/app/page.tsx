// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Welcome to Basic Social Media</h1>
      <h3>Are you ready to get Social?</h3>
      <div className="flex space-x-4 mt-6">
        <Link href="/login">
          <button className="text-white bg-blue-700 font-bold py-3 px-6 rounded transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="text-white bg-gray-700 font-bold py-3 px-6 rounded transition">
            Register
          </button>
        </Link>
      </div>
    </main>
  );
}
