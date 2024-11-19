import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Search, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Contract {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  department: string;
  amount: number;
  owner: string;
  status: 'active' | 'pending' | 'review';
  priority: 'high' | 'medium' | 'low';
}

const sampleData: Contract[] = [
  {
    id: 1,
    title: "Software License Agreement",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    department: "IT",
    amount: 50000,
    owner: "John Smith",
    status: 'active',
    priority: 'high'
  },
  {
    id: 2,
    title: "Office Lease Agreement",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    department: "Operations",
    amount: 120000,
    owner: "Sarah Johnson",
    status: 'active',
    priority: 'medium'
  },
  {
    id: 3,
    title: "Marketing Services Contract",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    department: "Marketing",
    amount: 75000,
    owner: "Michael Brown",
    status: 'review',
    priority: 'medium'
  },
  {
    id: 4,
    title: "Employee Benefits Agreement",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    department: "HR",
    amount: 250000,
    owner: "Emily Davis",
    status: 'active',
    priority: 'high'
  },
  {
    id: 5,
    title: "Vendor Supply Agreement",
    startDate: "2024-03-15",
    endDate: "2025-03-14",
    department: "Procurement",
    amount: 180000,
    owner: "David Wilson",
    status: 'pending',
    priority: 'low'
  }
];

export default function ContractsList() {
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    priority: '',
    dateRange: '',
  });

  const departments = [...new Set(sampleData.map(contract => contract.department))];
  const statuses = ['active', 'pending', 'review'];
  const priorities = ['high', 'medium', 'low'];
  const dateRanges = ['30days', '60days', '90days', 'all'];

  const filteredContracts = useMemo(() => {
    return sampleData.filter(contract => {
      const matchesSearch = contract.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          contract.owner.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDepartment = !filters.department || contract.department === filters.department;
      const matchesStatus = !filters.status || contract.status === filters.status;
      const matchesPriority = !filters.priority || contract.priority === filters.priority;
      
      let matchesDateRange = true;
      if (filters.dateRange && filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange);
        const endDate = new Date(contract.endDate);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchesDateRange = diffDays <= days;
      }

      return matchesSearch && matchesDepartment && matchesStatus && matchesPriority && matchesDateRange;
    });
  }, [filters, sampleData]);

  const handleExport = () => {
    const csvContent = [
      ['Serial Number', 'Contract Title', 'Start Date', 'End Date', 'Department', 'Amount', 'Owner'],
      ...filteredContracts.map(contract => [
        contract.id,
        contract.title,
        contract.startDate,
        contract.endDate,
        contract.department,
        contract.amount,
        contract.owner
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contracts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Contracts in Progress Details
        </h1>
        <button
          onClick={handleExport}
          className="btn-secondary flex items-center text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="pl-10 w-full input-primary text-sm"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <select
            className="input-primary text-sm"
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="input-primary text-sm"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <select
            className="input-primary text-sm"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            ))}
          </select>
          <select
            className="input-primary text-sm"
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
          >
            <option value="">All Dates</option>
            <option value="30days">Next 30 Days</option>
            <option value="60days">Next 60 Days</option>
            <option value="90days">Next 90 Days</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    #{contract.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {contract.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {contract.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ${contract.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {contract.owner}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      contract.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : contract.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedContract(contract)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex items-center text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Contract Details
                </h2>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contract Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedContract.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedContract.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">
                      ${selectedContract.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contract Owner</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.owner}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setSelectedContract(null)}
                    className="btn-secondary text-sm"
                  >
                    Close
                  </button>
                  <button className="btn-primary text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}