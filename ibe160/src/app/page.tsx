"use client";

import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/student/dashboard');
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>IBE160 Course Assistant</title>
        <meta name="description" content="Your assistant for the IBE160 course." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#6c5ce7] to-[#4834d4]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            IBE160 Course Assistant
          </h1>
          <p className="text-2xl text-white">
            Welcome! Please sign in to access your course materials and chatbot.
          </p>
          <button
            className="rounded-full bg-white/20 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/30"
            onClick={() => void signIn()}
          >
            Sign In
          </button>
        </div>
      </main>
    </>
  );
}
