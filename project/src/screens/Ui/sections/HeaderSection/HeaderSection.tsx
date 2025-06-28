import { LogOut, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";

interface HeaderSectionProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  title?: string; // NEW
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  onMenuToggle,
  isMobileMenuOpen,
  title = "Dashboard", // Default to Dashboard
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="w-full h-[75px] bg-bgsec flex items-center justify-between px-4 md:px-6 border-b border-stroke">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-white hover:text-sec-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Dynamic Title */}
        <h1 className="text-white text-lg md:text-xl font-semibold font-['Poppins',Helvetica]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Notification icon */}
        <div className="relative hidden sm:block">
          <div className="relative w-[19.98px] h-[19.98px] bg-[url(/notification.png)] bg-[100%_100%]">
            <div className="absolute w-[5px] h-[5px] top-0.5 left-3 bg-sec-100 rounded-[2.5px] border-[0.83px] border-solid border-[#1a1c22]" />
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-[33px] h-[33px]">
              <AvatarImage
                src="/photo-4.svg"
                alt="User profile"
                className="object-cover"
              />
            </Avatar>
            <span className="text-white text-sm font-medium hidden md:block">
              {user?.user_id}
            </span>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-bgsec border border-stroke rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-stroke">
                <p className="text-white font-medium">{user?.user_id}</p>
              </div>
              <div className="p-2">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};
