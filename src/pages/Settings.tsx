import React from 'react';
import { UserPlus, Mail, Shield, Search, MoreVertical, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { User, Role } from '../types';

const ROLES: Role[] = [
  {
    id: '1',
    name: 'admin',
    description: 'Full system access and user management',
    permissions: [
      'Manage users and roles',
      'System configuration',
      'View audit logs',
      'All contract permissions',
    ],
  },
  {
    id: '2',
    name: 'creator',
    description: 'Create and manage contracts',
    permissions: [
      'Create contracts',
      'Edit own contracts',
      'Submit for review',
      'View contract history',
    ],
  },
  {
    id: '3',
    name: 'reviewer',
    description: 'Review and provide feedback',
    permissions: [
      'Review assigned contracts',
      'Add comments and feedback',
      'Request changes',
      'View contract history',
    ],
  },
  {
    id: '4',
    name: 'approver',
    description: 'Final contract approval',
    permissions: [
      'Approve/reject contracts',
      'View all contracts',
      'Add final comments',
      'Generate reports',
    ],
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState('users');
  const [showInviteForm, setShowInviteForm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = React.useState<string | null>(null);

  const users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastLogin: '2024-03-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'reviewer',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastLogin: '2024-03-14T15:45:00Z',
    },
  ];

  const handleInviteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    };

    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Sending invitation...',
        success: 'Invitation sent successfully!',
        error: 'Failed to send invitation.',
      }
    );

    setShowInviteForm(false);
  };

  const handleUserAction = (action: string, userId: string) => {
    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Processing...',
        success: `User ${action} successfully!`,
        error: `Failed to ${action} user.`,
      }
    );
    setShowUserMenu(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <button
          onClick={() => setShowInviteForm(true)}
          className="btn-primary flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['Users', 'Roles', 'Security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              {showInviteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Invite New User
                    </h3>
                    <form onSubmit={handleInviteUser} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="input-primary mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="input-primary mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select id="role" name="role" required className="input-primary mt-1">
                          {ROLES.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowInviteForm(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Send Invitation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-primary pl-10 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={user.avatar}
                              alt=""
                              className="h-8 w-8 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowUserMenu(user.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {showUserMenu === user.id && (
                              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleUserAction('edit', user.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit User
                                  </button>
                                  <button
                                    onClick={() => handleUserAction('deactivate', user.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Deactivate
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ROLES.map((role) => (
                  <div
                    key={role.id}
                    className="border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        </h3>
                      </div>
                      {role.name === 'admin' && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Restricted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Permissions:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {role.permissions.map((permission, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-1 h-1 bg-purple-600 rounded-full" />
                            <span>{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Two-factor authentication is required for all users with administrative access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Two-factor Authentication
                      </h4>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="btn-secondary">Enable</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Session Management
                      </h4>
                      <p className="text-sm text-gray-500">
                        Control and monitor active sessions
                      </p>
                    </div>
                    <button className="btn-secondary">Manage</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Password Requirements
                      </h4>
                      <p className="text-sm text-gray-500">
                        Configure password complexity rules
                      </p>
                    </div>
                    <button className="btn-secondary">Configure</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}