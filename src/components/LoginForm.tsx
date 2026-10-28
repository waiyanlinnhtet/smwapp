
"use client";

import { useSignIn } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/nextjs/types";
import Image from "next/image";
import { useState } from "react";

type Provider = "oauth_google" | "oauth_apple";

export default function LoginForm() {
  const { signIn } = useSignIn();
  const [loadingProvider, setLoadingProvider] =
    useState<Provider | null>(null);
  const [error, setError] = useState("");

  const handleSocialAuth = async (strategy: Provider) => {
    if (loadingProvider) return;

    setLoadingProvider(strategy);
    setError("");

    try {
      const { error: authError } = await signIn.sso({
        strategy: strategy as OAuthStrategy,
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/",
      });

      if (authError) {
        setError(authError.message || "Sign-in failed. Please try again.");
        setLoadingProvider(null);
      }
    } catch (err) {
      console.error("Social sign-in failed:", err);
      setError("Sign-in failed. Please try again.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex items-center justify-center bg-transparent px-5 py-4 rounded-2xl">
      <div className="mx-auto w-full max-w-sm">
        {/* Main image */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/images/auth2.png"
            alt="Welcome to WanhSta"
            width={280}
            height={280}
            priority
            className="h-auto max-h-64 w-full object-contain"
          />
        </div>

        {/* Social sign-in buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialAuth("oauth_google")}
            disabled={loadingProvider !== null}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingProvider === "oauth_google" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            ) : (
              <Image
                src="/images/google.png"
                alt="Google"
                width={37}
                height={37}
              />
            )}
            {loadingProvider === "oauth_google"
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth("oauth_apple")}
            disabled={loadingProvider !== null}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingProvider === "oauth_apple" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            ) : (
              <Image
                src="/images/apple.png"
                alt="Apple"
                width={20}
                height={20}
                className="mr-2"
              />
            )}
            {loadingProvider === "oauth_apple"
              ? "Connecting to Apple..."
              : "Continue with Apple"}
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Terms and privacy */}
        <p className="mt-5 px-2 text-center text-xs leading-5 text-gray-500">
          By signing up, you agree to our{" "}
          <a href="/terms" className="text-blue-500 hover:underline">
            Terms
          </a>
          {", "}
          <a href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          {", and "}
          <a href="/cookies" className="hover:underline">
            Cookie Use
          </a>
          .
        </p>
      </div>
    </div>
  );
}
