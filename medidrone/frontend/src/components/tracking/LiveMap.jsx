import React from "react";
import { MapPin, Plane } from "lucide-react";

const LiveMap = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 h-96">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-900">Live Tracking</h3>
      <div className="flex gap-2">
        <span className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          Active
        </span>
        <span className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          In Flight
        </span>
      </div>
    </div>
    <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Map integration with Mapbox/Leaflet
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Real-time drone positions displayed here
          </p>
        </div>
      </div>
      <div className="absolute top-1/4 left-1/3 animate-pulse">
        <div className="bg-green-500 rounded-full p-2 shadow-lg">
          <Plane className="w-4 h-4 text-white transform rotate-45" />
        </div>
      </div>
      <div className="absolute top-1/2 right-1/3 animate-pulse">
        <div className="bg-blue-500 rounded-full p-2 shadow-lg">
          <Plane className="w-4 h-4 text-white transform -rotate-45" />
        </div>
      </div>
    </div>
  </div>
);

export default LiveMap;
