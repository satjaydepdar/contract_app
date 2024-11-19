import React from 'react';
import ContractTables from '../components/ContractTables';
import ContractEditor from '../components/ContractEditor';

export default function Contracts() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Create Contracts
      </h1>

      <ContractTables />
      <ContractEditor />
    </div>
  );
}