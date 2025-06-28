import React, { useState } from 'react';
import { HeaderSection } from '../sections/HeaderSection/HeaderSection';
import { SidebarSection } from '../sections/SidebarSection';
import { TransactionsPageSection } from '../sections/TransactionPageSect.tsx/TransactionPageSection';

interface TransactionsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const TransactionsPage: React.FC<TransactionsProps> = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-bgsec">
      {/* Sidebar */}
      <SidebarSection 
       isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <HeaderSection
          isMobileMenuOpen={isMobileMenuOpen}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title="Transactions"
        />
        <main className="flex-1 p-4">
          <TransactionsPageSection />
        </main>
      </div>
    </div>
  );
};
