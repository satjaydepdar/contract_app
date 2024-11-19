import React, { useState, useCallback } from 'react';
import { FileText, Search, Filter, Upload, Download, Eye, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface Contract {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  lastModified: string;
  size: number;
  status: 'draft' | 'active' | 'expired';
  tags: string[];
  version: string;
}

export default function MyContracts() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newContracts = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: file.name,
      type: file.type,
      uploadDate: new Date().toISOString(),
      lastModified: new Date(file.lastModified).toISOString(),
      size: file.size,
      status: 'draft' as const,
      tags: [],
      version: '1.0.0',
    }));

    setContracts((prev) => [...newContracts, ...prev]);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleDownload = (contract: Contract) => {
    // Simulate download
    toast.success(`Downloading ${contract.title}`);
  };

  const handleDelete = (id: string) => {
    setContracts((prev) => prev.filter((contract) => contract.id !== id));
    toast.success('Contract deleted successfully');
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || contract.status === statusFilter;
    const matchesType = !typeFilter || contract.type.includes(typeFilter);
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Contracts
        </h1>
        <div className="flex space-x-2">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <button className="btn-primary flex items-center text-sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Contract
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="pl-10 w-full input-primary text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input-primary text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <select
            className="input-primary text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="msword">DOC</option>
            <option value="openxmlformats">DOCX</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doc Version
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
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
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      {contract.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {contract.type.split('/')[1].toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                      v{contract.version}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(contract.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(contract.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {(contract.size / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      contract.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : contract.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleView(contract)}
                      className="text-purple-600 hover:text-purple-900"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(contract)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contract.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
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
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContract.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Version</label>
                  <p className="mt-1 text-sm text-gray-900">v{selectedContract.version}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedContract.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedContract.uploadDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Modified</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedContract.lastModified).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {(selectedContract.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedContract.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : selectedContract.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedContract.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setSelectedContract(null)}
                  className="btn-secondary text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(selectedContract)}
                  className="btn-primary text-sm flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data with version information
const initialContracts: Contract[] = [
  {
    id: '1',
    title: 'Service Level Agreement 2024.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadDate: '2024-03-15T10:30:00Z',
    lastModified: '2024-03-15T14:45:00Z',
    size: 2457600,
    status: 'active',
    tags: ['SLA', 'IT'],
    version: '2.1.0',
  },
  {
    id: '2',
    title: 'Employee Agreement Template.pdf',
    type: 'application/pdf',
    uploadDate: '2024-03-14T09:15:00Z',
    lastModified: '2024-03-14T16:20:00Z',
    size: 1048576,
    status: 'draft',
    tags: ['HR', 'Template'],
    version: '1.0.3',
  },
  {
    id: '3',
    title: 'Vendor Contract 2023-2024.doc',
    type: 'application/msword',
    uploadDate: '2024-03-10T11:00:00Z',
    lastModified: '2024-03-12T13:30:00Z',
    size: 3145728,
    status: 'expired',
    tags: ['Vendor', 'Procurement'],
    version: '3.2.1',
  },
  {
    id: '4',
    title: 'Software License Agreement.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadDate: '2024-03-08T15:20:00Z',
    lastModified: '2024-03-09T10:15:00Z',
    size: 1572864,
    status: 'active',
    tags: ['License', 'Software'],
    version: '1.5.0',
  },
  {
    id: '5',
    title: 'Non-Disclosure Agreement.pdf',
    type: 'application/pdf',
    uploadDate: '2024-03-05T14:30:00Z',
    lastModified: '2024-03-07T09:45:00Z',
    size: 524288,
    status: 'active',
    tags: ['Legal', 'NDA'],
    version: '2.0.1',
  },
  {
    id: '6',
    title: 'Marketing Services Contract.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadDate: '2024-03-01T16:45:00Z',
    lastModified: '2024-03-03T11:20:00Z',
    size: 2097152,
    status: 'draft',
    tags: ['Marketing', 'Services'],
    version: '1.1.0',
  },
];