import React, { useState, useEffect } from "react";
import DeliveryApprovalCard from "../components/deliveries/DeliveryApprovalCard";
import { deliveries, subscribeToUpdates } from "../services/api";

const ApprovalManagement = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Fetch pending approvals from backend
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await deliveries.getAll();
        const pending = res.data.filter((d) => d.status === "pending_approval");
        setPendingApprovals(pending);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };
    fetchPending();

    // Real-time updates
    const unsubscribe = subscribeToUpdates({
      onDeliveryUpdate: (data) => {
        if (
          data.type === "new" &&
          data.delivery.status === "pending_approval"
        ) {
          setPendingApprovals((prev) => [...prev, data.delivery]);
        }
        if (data.type === "update") {
          // remove from list if approved/rejected
          setPendingApprovals((prev) =>
            prev.filter((d) => d._id !== data.delivery._id)
          );
        }
      },
      onDroneUpdate: () => {},
      onDeliveryApproval: (data) => {
        setPendingApprovals((prev) => prev.filter((d) => d._id !== data.id));
      },
    });

    return () => unsubscribe();
  }, []);

  // Approve a delivery
  const handleApprove = async (id) => {
    try {
      await deliveries.approve(id);
      setPendingApprovals((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error approving delivery:", error);
    }
  };

  // Decline a delivery
  const handleDecline = async (id) => {
    try {
      await deliveries.reject(id);
      setPendingApprovals((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error rejecting delivery:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
        <p className="text-gray-600 mt-1">
          Review and manage delivery requests from hospitals
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingApprovals.map((delivery) => (
          <DeliveryApprovalCard
            key={delivery._id}
            delivery={delivery}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
};

export default ApprovalManagement;
