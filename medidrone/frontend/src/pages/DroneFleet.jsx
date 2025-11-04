import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DroneCard from "../components/drones/DroneCard";
import DroneDetails from "../components/drones/DroneDetails";
import { drones } from "../services/api"; // imported from your axios API file

const DroneFleet = () => {
  const [droneList, setDroneList] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDrone, setNewDrone] = useState({
    name: "",
    model: "",
    status: "active",
    battery: 100,
    capacity: "",
    lastMaintenance: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadDrones();
  }, []);

  const loadDrones = async () => {
    try {
      const res = await drones.getAll();
      setDroneList(res.data);
    } catch (err) {
      console.error("Failed to load drones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDrone = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newDrone,
        lastMaintenance: new Date(newDrone.lastMaintenance),
      };
      const res = await drones.create(payload);
      setDroneList((prev) => [...prev, res.data]);
      setNewDrone({
        name: "",
        model: "",
        status: "active",
        battery: 100,
        capacity: "",
        lastMaintenance: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add drone:", err.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading drones...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Drone Fleet Management
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage your drone fleet
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          {showForm ? "Cancel" : "Add Drone"}
        </button>
      </div>

      {/* Add Drone Form */}
      {showForm && (
        <form
          onSubmit={handleAddDrone}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Add New Drone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Drone Name"
              value={newDrone.name}
              onChange={(e) =>
                setNewDrone({ ...newDrone, name: e.target.value })
              }
              className="border border-gray-300 rounded-lg p-2"
              required
            />
            <input
              type="text"
              placeholder="Model"
              value={newDrone.model}
              onChange={(e) =>
                setNewDrone({ ...newDrone, model: e.target.value })
              }
              className="border border-gray-300 rounded-lg p-2"
              required
            />
            <input
              type="text"
              placeholder="Capacity"
              value={newDrone.capacity}
              onChange={(e) =>
                setNewDrone({ ...newDrone, capacity: e.target.value })
              }
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Drone
          </button>
        </form>
      )}

      {/* Drone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {droneList.map((drone) => (
          <DroneCard key={drone.id} drone={drone} onSelect={setSelectedDrone} />
        ))}
      </div>

      {selectedDrone && (
        <DroneDetails
          drone={selectedDrone}
          onClose={() => setSelectedDrone(null)}
        />
      )}
    </div>
  );
};

export default DroneFleet;
