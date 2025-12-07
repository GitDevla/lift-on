import type { Metadata } from "next";
import "./globals.css";
import CustomNavbar from "@/client/components/layout/Navbar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Lift-On",
  description: "A simple workout tracker to help you lift more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased`}>
        <Providers>
          <CustomNavbar />
          <main className="min-h-screen px-4 py-8 md:py-12 lg:py-16 max-w-5xl mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
