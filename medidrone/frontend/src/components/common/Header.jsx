import React from "react";
import { Menu, Bell } from "lucide-react";

const Header = ({ activeTab, userRole, setShowMobileMenu }) => {
  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "drones":
        return "Drone Fleet";
      case "deliveries":
        return "Deliveries";
      case "tracking":
        return "Live Tracking";
      case "analytics":
        return "Analytics";
      case "approvals":
        return "Pending Approvals";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getTitle()}</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {userRole === "admin" ? "Admin" : "Hospital Staff"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
