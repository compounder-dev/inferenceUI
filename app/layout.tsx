import type { Metadata } from "next";
import { Geist, Geist_Mono, Big_Shoulders } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeBootstrapScript } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InferenceUI — components for inference platforms",
  description:
    "An open-source component library for compute markets, runtime control planes, and inference operating systems.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
