
import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import LoginForm from "@/components/LoginForm";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WanhSta",
  description: "Social Media App",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const user = await currentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {!user ? (
              <main className="flex min-h-screen items-center justify-center p-4">
                <LoginForm />
              </main>
            ) : (
              <div className="min-h-screen">
                <Navbar />

                <main className="py-8">
                  <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                      <aside className="hidden lg:col-span-3 lg:block">
                        <Sidebar />
                      </aside>

                      <div className="min-w-0 lg:col-span-9">
                        {children}
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            )}

            <Toaster position="top-center" />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
