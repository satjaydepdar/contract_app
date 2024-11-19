import React from 'react';
import { Calendar, AlertCircle, FileText } from 'lucide-react';

interface PendingRequest {
  id: string;
  requestor: string;
  requestDate: string;
  createdDate: string;
  amount: number;
  priority: 'Urgent' | 'Normal';
}

interface AIContract {
  id: string;
  createdDate: string;
  path: string;
}

const pendingRequests: PendingRequest[] = [
  {
    id: '1',
    requestor: 'John Smith',
    requestDate: '2024-03-15',
    createdDate: '2024-03-16',
    amount: 25000,
    priority: 'Urgent',
  },
  {
    id: '2',
    requestor: 'Sarah Johnson',
    requestDate: '2024-03-14',
    createdDate: '2024-03-15',
    amount: 15000,
    priority: 'Normal',
  },
  {
    id: '3',
    requestor: 'Michael Brown',
    requestDate: '2024-03-13',
    createdDate: '2024-03-14',
    amount: 50000,
    priority: 'Urgent',
  },
  {
    id: '4',
    requestor: 'Emily Davis',
    requestDate: '2024-03-12',
    createdDate: '2024-03-13',
    amount: 30000,
    priority: 'Normal',
  },
  {
    id: '5',
    requestor: 'David Wilson',
    requestDate: '2024-03-11',
    createdDate: '2024-03-12',
    amount: 40000,
    priority: 'Urgent',
  },
];

const aiContracts: AIContract[] = [
  {
    id: '1',
    createdDate: '2024-03-16',
    path: 'C:\\Contracts\\2024\\March\\Contract_001.docx',
  },
  {
    id: '2',
    createdDate: '2024-03-15',
    path: 'C:\\Contracts\\2024\\March\\Contract_002.docx',
  },
  {
    id: '3',
    createdDate: '2024-03-14',
    path: 'C:\\Contracts\\2024\\March\\Contract_003.docx',
  },
];

export default function ContractTables() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Pending Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
            Pending Requests
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requestor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.requestor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${request.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {request.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Generated Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            AI Generated Contracts
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Path
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aiContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contract.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {contract.path}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}