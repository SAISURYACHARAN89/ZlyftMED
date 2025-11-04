import React from "react";
import {
  Activity,
  Plane,
  Package,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, userRole, setUserRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 rounded-lg p-2">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MediDrone</h1>
            <p className="text-xs text-gray-600">Emergency Delivery</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "dashboard"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>
        {userRole === "admin" ? (
          <>
            <button
              onClick={() => setActiveTab("drones")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "drones"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Plane className="w-5 h-5" />
              <span className="font-medium">Drone Fleet</span>
            </button>
            <button
              onClick={() => setActiveTab("deliveries")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "deliveries"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">All Deliveries</span>
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "approvals"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Pending Approvals</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab("deliveries")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "deliveries"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">My Deliveries</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab("tracking")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "tracking"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Live Tracking</span>
        </button>
        {userRole === "admin" && (
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "analytics"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-900">
              {userRole === "admin" ? "Admin User" : "Hospital Staff"}
            </p>
            <p className="text-xs text-gray-600">
              {userRole === "admin"
                ? "admin@medidrone.com"
                : "hospital@medidrone.com"}
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setUserRole(userRole === "admin" ? "hospital" : "admin")
          }
          className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mb-2"
        >
          Switch to {userRole === "admin" ? "Hospital" : "Admin"}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
