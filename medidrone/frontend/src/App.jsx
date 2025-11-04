import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/common/SideBar";
import Header from "./components/common/Header";
import DeliveryRequestForm from "./components/deliveries/DeliveryRequestForm";
import Dashboard from "./pages/Dashboard";
import DroneFleet from "./pages/DroneFleet";
import DeliveryManagement from "./pages/DeliveryManagement";
import ApprovalManagement from "./pages/ApprovalManagement";
import LiveTracking from "./pages/LiveTracking";
import Analytics from "./pages/Analytics";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import {
  getDeliveries,
  getDrones,
  subscribeToUpdates,
  createDelivery,
  updateDeliveryStatus,
} from "./services/api";

// PrivateRoute ensures only authenticated users can access routes
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

function MainApp() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [drones, setDrones] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set userRole based on email
  useEffect(() => {
    if (!user) return;
    if (user.email === "admin@gmail.com") {
      setUserRole("admin");
    } else {
      setUserRole("hospital");
    }
  }, [user]);

  // Fetch deliveries and drones once userRole is known
  useEffect(() => {
    if (!userRole) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const deliveriesRes = await getDeliveries(
          userRole === "hospital" ? user._id : null
        );
        setDeliveries(deliveriesRes.data);

        if (userRole === "admin") {
          const dronesRes = await getDrones();
          setDrones(dronesRes.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const unsubscribe = subscribeToUpdates({
      onDeliveryUpdate: (updatedDelivery) => {
        setDeliveries((prev) =>
          prev.map((d) => (d._id === updatedDelivery._id ? updatedDelivery : d))
        );
      },
      onDroneUpdate: (updatedDrone) => {
        setDrones((prev) =>
          prev.map((d) => (d._id === updatedDrone._id ? updatedDrone : d))
        );
      },
    });

    return () => unsubscribe();
  }, [userRole, user]);

  // Handle new delivery creation
  const handleNewDelivery = async (formData) => {
    try {
      const response = await createDelivery({
        ...formData,
        status: userRole === "admin" ? "requested" : "pending_approval",
        hospitalId: userRole === "hospital" ? user._id : null,
      });

      if (userRole === "admin") {
        setDeliveries((prev) => [response.data, ...prev]);
      } else {
        setPendingApprovals((prev) => [response.data, ...prev]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Approve delivery
  const handleApproveDelivery = async (id) => {
    try {
      const response = await updateDeliveryStatus(id, "approved");
      const updatedDelivery = response.data;
      setDeliveries((prev) => [updatedDelivery, ...prev]);
      setPendingApprovals((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Decline delivery
  const handleDeclineDelivery = async (id) => {
    try {
      await updateDeliveryStatus(id, "declined");
      setPendingApprovals((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard userRole={userRole} deliveries={deliveries} />;
      case "drones":
        return userRole === "admin" ? <DroneFleet drones={drones} /> : null;
      case "deliveries":
        return (
          <DeliveryManagement
            userRole={userRole}
            deliveries={deliveries}
            onNewDelivery={() => setShowDeliveryForm(true)}
          />
        );
      case "approvals":
        return userRole === "admin" ? (
          <ApprovalManagement
            pendingApprovals={pendingApprovals}
            onApprove={handleApproveDelivery}
            onDecline={handleDeclineDelivery}
          />
        ) : null;
      case "tracking":
        return <LiveTracking deliveries={deliveries} />;
      case "analytics":
        return userRole === "admin" ? <Analytics drones={drones} /> : null;
      default:
        return <Dashboard userRole={userRole} deliveries={deliveries} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
          setUserRole={setUserRole}
        />
      </div>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userRole={userRole}
              setUserRole={setUserRole}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          userRole={userRole}
          setShowMobileMenu={setShowMobileMenu}
        />
        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </div>

      {showDeliveryForm && (
        <DeliveryRequestForm
          onClose={() => setShowDeliveryForm(false)}
          onSubmit={handleNewDelivery}
        />
      )}
    </div>
  );
}

// Wrap MainApp with AuthProvider and BrowserRouter
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainApp />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
