import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = { title: "Spendwise" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="layout">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
