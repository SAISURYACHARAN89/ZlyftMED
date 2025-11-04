import React, { useEffect, useState } from "react";
import { Plane, Package, Clock, CheckCircle, Bell } from "lucide-react";
import StatCard from "../components/common/StatCard";
import LiveMap from "../components/tracking/LiveMap";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import { deliveries, drones, subscribeToUpdates } from "../services/api";

const Dashboard = ({ userRole }) => {
  const [deliveryList, setDeliveryList] = useState([]);
  const [droneList, setDroneList] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deliveryRes, droneRes] = await Promise.all([
          deliveries.getAll(),
          drones.getAll(),
        ]);
        setDeliveryList(deliveryRes.data);
        setDroneList(droneRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();

    // Listen for real-time updates
    const unsubscribe = subscribeToUpdates({
      onDeliveryUpdate: (data) => {
        if (data.type === "new") {
          setDeliveryList((prev) => [data.delivery, ...prev]);
        } else if (data.type === "update") {
          setDeliveryList((prev) =>
            prev.map((d) => (d._id === data.delivery._id ? data.delivery : d))
          );
        }
      },
      onDroneUpdate: (data) => {
        if (data.type === "new") {
          setDroneList((prev) => [data.drone, ...prev]);
        } else if (data.type === "update") {
          setDroneList((prev) =>
            prev.map((d) => (d._id === data.drone._id ? data.drone : d))
          );
        }
      },
      onDeliveryApproval: (data) => {
        setDeliveryList((prev) =>
          prev.map((d) =>
            d._id === data.id ? { ...d, status: data.status } : d
          )
        );
      },
    });

    return () => unsubscribe();
  }, []);

  // ✅ Compute stats
  const activeDrones = droneList.filter((d) => d.status === "active").length;
  const activeDeliveries = deliveryList.filter(
    (d) => d.status !== "delivered"
  ).length;
  const completedDeliveries = deliveryList.filter(
    (d) => d.status === "delivered"
  ).length;
  const pendingApprovals = deliveryList.filter(
    (d) => d.status === "pending_approval"
  ).length;

  if (userRole === "admin") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Plane}
            label="Active Drones"
            value={activeDrones} // ✅ dynamic now
            color="bg-blue-600"
          />
          <StatCard
            icon={Package}
            label="Total Deliveries"
            value={deliveryList.length}
            color="bg-green-600"
          />
          <StatCard
            icon={Clock}
            label="Pending Approvals"
            value={pendingApprovals}
            color="bg-yellow-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={completedDeliveries}
            color="bg-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveMap drones={droneList} />
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">
              Recent Notifications
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Bell
                    className={`w-5 h-5 mt-0.5 ${
                      notif.type === "success"
                        ? "text-green-600"
                        : notif.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">
            Active Deliveries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryList
              .filter((d) => d.status !== "delivered")
              .map((delivery) => (
                <DeliveryCard key={delivery._id} delivery={delivery} />
              ))}
          </div>
        </div>
      </div>
    );
  }
  // Hospital dashboard
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Active Deliveries"
          value={activeDeliveries}
          color="bg-blue-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Approvals"
          value={pendingApprovals}
          color="bg-yellow-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedDeliveries}
          color="bg-green-600"
        />
      </div>
      <LiveMap />
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Active Deliveries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryList
            .filter((d) => d.status === "in-flight")
            .map((delivery) => (
              <DeliveryCard key={delivery._id} delivery={delivery} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
