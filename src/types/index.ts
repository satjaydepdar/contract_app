export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'reviewer' | 'approver';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  lastLogin?: string;
}

export interface Contract {
  id: string;
  title: string;
  requestor: string;
  requestDate: string;
  completionDate?: string;
  value: number;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'review' | 'approved' | 'rejected';
  reviewer?: string;
  content: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Role {
  id: string;
  name: 'admin' | 'creator' | 'reviewer' | 'approver';
  description: string;
  permissions: string[];
}