import React from "react";
import { Clock } from "lucide-react";

const DroneCard = ({ drone, onSelect }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    charging: "bg-yellow-100 text-yellow-800",
    "in-flight": "bg-blue-100 text-blue-800",
    maintenance: "bg-red-100 text-red-800",
  };

  return (
    <div
      onClick={() => onSelect(drone)}
      className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{drone.name}</h3>
          <p className="text-sm text-gray-600">{drone.model}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[drone.status]
          }`}
        >
          {drone.status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Battery</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  drone.battery > 50
                    ? "bg-green-500"
                    : drone.battery > 20
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${drone.battery}%` }}
              />
            </div>
            <span className="text-sm font-medium">{drone.battery}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Capacity</span>
          <span className="font-medium">{drone.capacity}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <Clock className="w-3 h-3" />
          <span>Last service: {drone.lastMaintenance}</span>
        </div>
      </div>
    </div>
  );
};

export default DroneCard;
