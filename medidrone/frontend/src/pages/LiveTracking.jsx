import React from "react";
import LiveMap from "../components/tracking/LiveMap";

const LiveTracking = ({ deliveries }) => {
  const activeFlights = deliveries.filter(
    (d) => d.status === "in-flight" || d.status === "dispatched"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Live Tracking</h2>
        <p className="text-gray-600 mt-1">
          Real-time drone positions and delivery routes
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveMap />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Active Flights</h3>
          <div className="space-y-3">
            {activeFlights.map((delivery) => (
              <div key={delivery.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{delivery.drone}</span>
                  <span className="text-xs text-gray-600">
                    ETA: {delivery.eta}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {delivery.from} → {delivery.to}
                </p>
                <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${delivery.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
