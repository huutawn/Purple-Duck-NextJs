"use client";

import React from 'react';
import RevenueAnalytics from '../../component/RevenueAnalytics';

const RevenuePage: React.FC = () => {
  // For now, using a sample seller ID - in real app this would come from auth context
  const sellerId = 1;

  return (
    <div className="p-6">
      <RevenueAnalytics sellerId={sellerId} />
    </div>
  );
};

export default RevenuePage;
