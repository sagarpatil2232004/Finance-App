import { AnalyticsSection } from "../sections/AnalytisSection/analyticsSection";
import { SidebarSection } from "../sections/SidebarSection";
import { HeaderSection } from "../sections/HeaderSection/HeaderSection";
import { useState } from "react";


export const Analytics = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-bgsec">
      <SidebarSection isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <div className="flex flex-col flex-1">
        <HeaderSection
          isMobileMenuOpen={isMobileMenuOpen}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title="Analytics"
        />
        <main className="flex-1 p-4">
          <AnalyticsSection />
        </main>
      </div>
    </div>
  );
};
