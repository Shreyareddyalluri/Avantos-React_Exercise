import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journey Builder - Prefill Configuration",
  description: "Configure form prefill mappings in a DAG of forms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
