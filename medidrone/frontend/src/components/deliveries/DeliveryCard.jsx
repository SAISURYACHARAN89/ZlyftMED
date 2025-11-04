import React from "react";
import { Package, MapPin } from "lucide-react";

const DeliveryCard = ({ delivery }) => {
  const statusColors = {
    requested: "bg-gray-100 text-gray-800",
    dispatched: "bg-blue-100 text-blue-800",
    "in-flight": "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
  };

  const priorityColors = {
    critical: "text-red-600",
    high: "text-orange-600",
    medium: "text-yellow-600",
    low: "text-green-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-900">{delivery.type}</span>
            <span
              className={`text-xs font-semibold ${
                priorityColors[delivery.priority]
              }`}
            >
              {delivery.priority.toUpperCase()}
            </span>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>From: {delivery.from}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>To: {delivery.to}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[delivery.status]
          }`}
        >
          {delivery.status}
        </span>
      </div>
      {delivery.status === "in-flight" || delivery.status === "dispatched" ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{delivery.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${delivery.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Drone: {delivery.drone}</span>
            <span>ETA: {delivery.eta}</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>Weight: {delivery.weight}</span>
          {delivery.drone && <span>Drone: {delivery.drone}</span>}
        </div>
      )}
    </div>
  );
};

export default DeliveryCard;
