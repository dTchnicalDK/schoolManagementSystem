"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold">School Portal</h1>
        <p className="text-gray-500 text-sm">Sign in to continue</p>

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full border py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img
            src="https://authjs.dev/img/providers/github.svg"
            className="w-5 h-5"
          />
          Continue with github
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full border py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
