import React from "react";

const DroneDetails = ({ drone, onClose }) => {
  if (!drone) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Drone Details: {drone.name}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Model</p>
          <p className="font-medium">{drone.model}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-medium capitalize">{drone.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Battery</p>
          <p className="font-medium">{drone.battery}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Capacity</p>
          <p className="font-medium">{drone.capacity}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Assign to Delivery
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Schedule Maintenance
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DroneDetails;
