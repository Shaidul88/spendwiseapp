import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeRoot from "@/components/ThemeRoot";

export const metadata = { title: "Spendwise" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body>
        <ThemeRoot />
        <div className="layout">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
