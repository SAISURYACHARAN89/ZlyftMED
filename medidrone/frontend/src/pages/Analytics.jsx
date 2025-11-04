import React from "react";
import { Package, CheckCircle, Clock, TrendingUp } from "lucide-react";
import StatCard from "../components/common/StatCard";

const Analytics = ({ drones }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 mt-1">Performance metrics and insights</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Today's Deliveries"
          value={42}
          change={15}
          color="bg-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Success Rate"
          value="98.5%"
          change={2}
          color="bg-green-600"
        />
        <StatCard
          icon={Clock}
          label="Avg Time"
          value="18m"
          change={-8}
          color="bg-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Pending"
          value={8}
          change={-12}
          color="bg-orange-600"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">
            Delivery Volume (Last 7 Days)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[42, 38, 45, 52, 48, 55, 42].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${(val / 55) * 100}%` }}
                />
                <span className="text-xs text-gray-600">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">
            Drone Utilization
          </h3>
          <div className="space-y-4">
            {drones.map((drone) => (
              <div key={drone.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{drone.name}</span>
                  <span className="text-sm text-gray-600">
                    {Math.floor(Math.random() * 40 + 60)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${Math.floor(Math.random() * 40 + 60)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">
          Delivery Types Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: "Medicine", count: 487, color: "bg-blue-500" },
            { type: "Blood Sample", count: 342, color: "bg-red-500" },
            { type: "Blood Units", count: 256, color: "bg-purple-500" },
            { type: "Emergency Kit", count: 162, color: "bg-green-500" },
          ].map((item) => (
            <div
              key={item.type}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-16 h-16 ${item.color} rounded-full mx-auto mb-3 flex items-center justify-center`}
              >
                <span className="text-white font-bold text-xl">
                  {item.count}
                </span>
              </div>
              <p className="font-medium text-gray-900">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
