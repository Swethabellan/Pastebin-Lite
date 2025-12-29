import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PastePin Lite",
  description: "A minimal Pastebin-like app built with Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="flex flex-col items-center px-4 py-8 md:py-12">
            <div className="w-full max-w-4xl">
              <header className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                  PastePin Lite
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                  Create a text paste, share the link instantly, and control its lifetime with TTL and view limits.
                </p>
              </header>
              <div className="bg-white border border-border rounded-lg shadow-sm">
                {children}
              </div>
              <footer className="mt-8 text-center text-sm text-muted-foreground">
                <p>Simple. Fast. Private.</p>
              </footer>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
