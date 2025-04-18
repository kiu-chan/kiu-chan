// src/admin/pages/Dashboard.jsx
import React from 'react';

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Widget */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Total Users</h2>
              <p className="text-3xl font-bold text-blue-600">254</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2">+5% from last month</p>
        </div>

        {/* Total Revenue Widget */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h2>
              <p className="text-3xl font-bold text-blue-600">$45,231</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2">+12% from last month</p>
        </div>

        {/* Total Orders Widget */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h2>
              <p className="text-3xl font-bold text-blue-600">126</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2">+3% from last month</p>
        </div>

        {/* Pending Tasks Widget */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Pending Tasks</h2>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-red-500 mt-2">2 overdue</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
              Create New Product
            </button>
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
              Add New User
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Recent Activity</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <span className="text-green-600 text-sm">+$128.00</span>
            </li>
            <li className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm font-medium">Product added to catalog</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <span className="text-blue-600 text-sm">Smartphone X</span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">User registration</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
              <span className="text-purple-600 text-sm">John Doe</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;