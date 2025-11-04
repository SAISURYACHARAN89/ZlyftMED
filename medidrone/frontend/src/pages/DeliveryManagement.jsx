import React, { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import DeliveryCard from "../components/deliveries/DeliveryCard";
import DeliveryRequestForm from "../components/deliveries/DeliveryRequestForm";
import { deliveries, subscribeToUpdates } from "../services/api";

const DeliveryManagement = ({ userRole }) => {
  const [deliveryList, setDeliveryList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🧩 Fetch deliveries on mount
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await deliveries.getAll();
        setDeliveryList(res.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };
    fetchDeliveries();
  }, []);

  // 🔄 Listen for real-time updates
  useEffect(() => {
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
        console.log("Drone update:", data);
      },
      onDeliveryApproval: ({ id, status }) => {
        setDeliveryList((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status } : d))
        );
      },
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  // 📨 Handle new delivery creation
  const handleCreateDelivery = async (formData) => {
    try {
      const deliveryData = {
        from: formData.from.trim(),
        to: formData.to.trim(),
        type: formData.type,
        weight: formData.weight,
        priority: formData.priority,
      };

      const response = await deliveries.create(deliveryData);

      // Add new delivery only if it doesn't exist
      setDeliveryList((prev) => {
        const exists = prev.some((d) => d._id === response.data._id);
        if (!exists) {
          return [response.data, ...prev];
        }
        return prev;
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error creating delivery:", error);
      alert(error.response?.data?.message || "Failed to create delivery");
    }
  };

  // Deduplicate deliveries before filtering
  const uniqueDeliveries = React.useMemo(() => {
    const seen = new Set();
    return deliveryList.filter((delivery) => {
      const duplicate = seen.has(delivery._id);
      seen.add(delivery._id);
      return !duplicate;
    });
  }, [deliveryList]);

  // 🔍 Simple search filter
  const filteredDeliveries = uniqueDeliveries.filter(
    (d) =>
      d.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.to?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Delivery Management
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage all delivery requests
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          New Delivery Request
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Deliveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((delivery) => (
          <DeliveryCard
            key={`${delivery._id}-${delivery.status}`}
            delivery={delivery}
          />
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <DeliveryRequestForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateDelivery}
        />
      )}
    </div>
  );
};

export default DeliveryManagement;
