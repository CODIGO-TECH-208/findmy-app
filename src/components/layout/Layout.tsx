import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
  showMobileNav?: boolean;
}

export function Layout({ children, showMobileNav = true }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={isAuthenticated && showMobileNav ? "pb-20 md:pb-0" : ""}>
        {children}
      </main>
      {isAuthenticated && showMobileNav && <MobileNav />}
    </div>
  );
}
