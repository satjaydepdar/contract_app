import React from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import type { Contract } from '../types';

export default function Reviews() {
  const [selectedContract, setSelectedContract] = React.useState<Contract | null>(null);
  const [comment, setComment] = React.useState('');

  const handleApprove = () => {
    console.log('Approved contract:', selectedContract?.id);
    setSelectedContract(null);
  };

  const handleReject = () => {
    console.log('Rejected contract:', selectedContract?.id);
    setSelectedContract(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Contract Reviews
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rest of the component remains the same */}
      </div>
    </div>
  );
}