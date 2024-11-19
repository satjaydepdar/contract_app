import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  Icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  link?: string;
}

export default function SummaryCard({ 
  title, 
  value, 
  change, 
  Icon, 
  iconBgColor, 
  iconColor,
  link 
}: SummaryCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className={`bg-white p-2 rounded-lg shadow-sm border border-gray-100 ${
        link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={() => link && navigate(link)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600">{title}</p>
          <h3 className="text-base font-bold mt-0.5">{value}</h3>
          <div className="flex items-center mt-0.5 text-xs">
            {change > 0 ? (
              <>
                <span className="text-green-500">↑ {change}%</span>
              </>
            ) : (
              <>
                <span className="text-red-500">↓ {Math.abs(change)}%</span>
              </>
            )}
          </div>
        </div>
        <div className={`w-7 h-7 ${iconBgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}