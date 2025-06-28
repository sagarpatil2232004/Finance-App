import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../../../lib/utils";

interface SidebarSectionProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  {
    icon: <i className="fas fa-th-large text-green-500 text-[19.98px]" />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <i className="fas fa-exchange-alt text-green-500 text-[19.98px]" />,
    label: "Transactions",
    path: "/transactions",
  },
  {
    icon: <i className="fas fa-chart-bar text-green-500 text-[19.98px]" />,
    label: "Analytics",
    path: "/analytics",
  },
];

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  isOpen = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-[213px] bg-bgsec border-r border-stroke flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo and Company Name */}
        <div className="flex items-center px-[35px] pt-[35px] pb-[50px] gap-2">
          <svg
            className="text-green-500"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12L9 6L15 12L21 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18L9 12L15 18L21 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-white text-[18px] font-semibold tracking-wide">
            Penta
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="px-[33px] flex-1">
          <ul className="flex flex-col gap-[26.64px]">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index} className="relative">
                  {isActive && (
                    <div className="absolute w-[7px] h-5 -right-[33px] bg-[#ffbf1d] rounded-[4.16px_0px_0px_4.16px]" />
                  )}
                  <button
                    onClick={() => {
                      navigate(item.path);
                      onClose?.();
                    }}
                    className={cn(
                      "flex items-center gap-[16.65px] pb-[6.66px] w-full text-left cursor-pointer hover:text-sec-100 transition-colors",
                      isActive ? "text-sec-100" : "text-text-10"
                    )}
                  >
                    {item.icon}
                    <span
                      className={cn(
                        "text-[11.7px] font-['Poppins',Helvetica]",
                        isActive ? "font-semibold" : "font-normal"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
