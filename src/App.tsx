import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import ContractsList from './pages/ContractsList';
import MyContracts from './pages/MyContracts';
import DocChat from './pages/DocChat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="my-contracts" element={<MyContracts />} />
          <Route path="contracts-list" element={<ContractsList />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
          <Route path="doc-chat" element={<DocChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}