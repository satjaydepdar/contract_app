import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  height: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function ChartCard({ title, height, children, action }: ChartCardProps) {
  return (
    <div className={`bg-white p-2 rounded-lg shadow-sm ${height}`}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold">{title}</h3>
        {action}
      </div>
      <ResponsiveContainer width="100%" height="90%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}