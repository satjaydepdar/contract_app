import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import { DollarSign, FileText, Clock } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';
import ChartCard from '../components/dashboard/ChartCard';

const contractTypes = [
  { name: 'T&M', value: 30 },
  { name: 'Fixed Price', value: 25 },
  { name: 'Partnership', value: 20 },
  { name: 'Cost-Plus', value: 15 },
  { name: 'Unilateral', value: 10 },
];

const departmentData = [
  { name: 'HR', value: 20, color: '#8b5cf6' },
  { name: 'Finance', value: 25, color: '#3b82f6' },
  { name: 'Operations', value: 30, color: '#06b6d4' },
  { name: 'Legal', value: 15, color: '#10b981' },
  { name: 'L&D', value: 5, color: '#f59e0b' },
  { name: 'Research', value: 5, color: '#ef4444' },
];

const supplierData = [
  { name: 'Supplier A', value: 400000 },
  { name: 'Supplier B', value: 300000 },
  { name: 'Supplier C', value: 250000 },
  { name: 'Supplier D', value: 200000 },
  { name: 'Supplier E', value: 150000 },
];

const mapData = {
  US: 1200000,
  DE: 800000,
  GB: 600000,
  IN: 500000,
  CN: 400000,
  JP: 300000,
};

export default function Dashboard() {
  const [expiryPeriod, setExpiryPeriod] = useState('30');
  
  const expiryData = {
    '30': [
      { name: 'Week 1', contracts: 5 },
      { name: 'Week 2', contracts: 8 },
      { name: 'Week 3', contracts: 3 },
      { name: 'Week 4', contracts: 7 },
    ],
    '60': [
      { name: 'Week 1', contracts: 10 },
      { name: 'Week 2', contracts: 15 },
      { name: 'Week 3', contracts: 8 },
      { name: 'Week 4', contracts: 12 },
    ],
    '90': [
      { name: 'Week 1', contracts: 20 },
      { name: 'Week 2', contracts: 25 },
      { name: 'Week 3', contracts: 15 },
      { name: 'Week 4', contracts: 18 },
    ],
  };

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Contract Insights
      </h1>

      <div className="grid grid-cols-3 gap-2">
        <SummaryCard
          title="Contracts in Progress"
          value="47"
          change={12}
          Icon={FileText}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          link="/contracts-list"
        />
        <SummaryCard
          title="Total Contract Value"
          value="$3.2M"
          change={8}
          Icon={DollarSign}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Expiring Soon"
          value="12"
          change={-5}
          Icon={Clock}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ChartCard title="Contracts Expiring Soon" height="h-[200px]">
          <LineChart data={expiryData[expiryPeriod]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="contracts" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Contract Value by Supplier" height="h-[200px]">
          <BarChart data={supplierData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ChartCard title="Department Distribution" height="h-[200px]">
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Contract Types" height="h-[200px]">
          <PieChart>
            <Pie
              data={contractTypes}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {contractTypes.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${(index * 360) / contractTypes.length}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ChartCard>
      </div>

      <ChartCard title="Contracts by Location" height="h-[200px]">
        <VectorMap
          map={worldMill}
          backgroundColor="transparent"
          zoomOnScroll={false}
          containerStyle={{
            width: '100%',
            height: '100%'
          }}
          containerClassName="map"
          regionStyle={{
            initial: {
              fill: '#e2e8f0',
              "fill-opacity": 0.9,
              stroke: 'none',
              "stroke-width": 0,
              "stroke-opacity": 0
            },
            hover: {
              "fill-opacity": 0.8,
              cursor: 'pointer'
            },
            selected: {
              fill: '#2938bc'
            },
            selectedHover: {}
          }}
          regionsSelectable={true}
          series={{
            regions: [{
              values: mapData,
              scale: ['#C8EEFF', '#0071A4'],
              normalizeFunction: 'polynomial'
            }]
          }}
        />
      </ChartCard>
    </div>
  );
}