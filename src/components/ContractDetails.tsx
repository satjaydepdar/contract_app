import React from 'react';
import { Clock, DollarSign, User, FileText, AlertTriangle } from 'lucide-react';
import type { Contract } from '../types';

interface ContractDetailsProps {
  contract: Contract;
  onClose: () => void;
}

export default function ContractDetails({ contract, onClose }: ContractDetailsProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Contract Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>Created on {new Date(contract.requestDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="w-5 h-5" />
                <span>Value: ${contract.value.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>Requestor: {contract.requestor}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-sm rounded-full ${
                  contract.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : contract.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {contract.priority.charAt(0).toUpperCase() + contract.priority.slice(1)} Priority
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-sm rounded-full ${
                  contract.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : contract.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-900">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-medium">Contract Content</h3>
            </div>
            <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
              {contract.content}
            </div>
          </div>

          {contract.status === 'review' && (
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This contract is currently under review by {contract.reviewer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button className="btn-primary">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}