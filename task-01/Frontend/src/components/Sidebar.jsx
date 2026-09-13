import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4 flex flex-col gap-4 border-r border-slate-700">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <Link to="/" className="hover:text-blue-300">Dashboard</Link>
      <Link to="/" className="hover:text-blue-300">Inventory</Link>
    </div>
  );
}
