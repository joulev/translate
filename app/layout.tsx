import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-daw-main-50 text-daw-main-700">{children}</body>
    </html>
  );
}
