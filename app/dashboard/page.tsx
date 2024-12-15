"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

// Interfaces remain the same as in the original file
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}

interface SalesDataPoint {
  name: string;
  sales: number;
  revenue: number;
  profit: number;
}

interface Transaction {
  id: number;
  customer: string;
  amount: string;
  status: "Completed" | "Pending" | "Processing";
}

// Stats Card Component remains the same
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div
        className={`p-3 rounded-full ${
          trend === "up" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {icon}
      </div>
    </div>
    {trendValue && (
      <div className="mt-4 flex items-center">
        <ArrowUpRight
          className={trend === "up" ? "text-green-500" : "text-red-500"}
          size={16}
        />
        <span
          className={`ml-1 text-sm ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {trendValue}
        </span>
        <span className="text-gray-500 text-sm ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const SalesDashboard: React.FC = () => {

  // State for dashboard metrics
  const [totalReservations, setTotalReservations] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Sample data (can be replaced with real data later)
  const salesData: SalesDataPoint[] = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398, profit: 2210 },
    { name: "Mar", sales: 2000, revenue: 9800, profit: 2290 },
    { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
    { name: "May", sales: 1890, revenue: 4800, profit: 2181 },
    { name: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
    { name: "Jul", sales: 3490, revenue: 4300, profit: 2100 },
  ];

  const recentTransactions: Transaction[] = [
    { id: 1, customer: "John Doe", amount: "$524.99", status: "Completed" },
    { id: 2, customer: "Jane Smith", amount: "$299.99", status: "Pending" },
    { id: 3, customer: "Mike Johnson", amount: "$149.99", status: "Completed" },
    { id: 4, customer: "Sarah Williams", amount: "$749.99", status: "Processing" },
  ];

  // Fetch data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total reservations
        const totalReservationsResponse = await fetch('/api/tongdondatcoccxn');
        const totalReservationsData = await totalReservationsResponse.json();
        setTotalReservations(totalReservationsData);

        // Fetch pending reservations
        const pendingReservationsResponse = await fetch('/api/tongdondatcoc');
        const pendingReservationsData = await pendingReservationsResponse.json();
        setPendingReservations(pendingReservationsData);

        // Fetch total orders
        const totalOrdersResponse = await fetch('/api/tongdonhang');
        const totalOrdersData = await totalOrdersResponse.json();
        setTotalOrders(totalOrdersData);

        // Fetch pending orders
        const pendingOrdersResponse = await fetch('/api/tongdonhangcxn');
        const pendingOrdersData = await pendingOrdersResponse.json();
        setPendingOrders(pendingOrdersData);

        // Fetch total users
        const totalUsersResponse = await fetch('/api/tongkhachhang');
        const totalUsersData = await totalUsersResponse.json();
        setTotalUsers(totalUsersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Tổng Đơn Đặt Cọc"
        value={totalReservations.toString()}
        icon={<DollarSign size={24} className="text-green-500" />}
        trend="up"
      />
      <StatsCard
        title="Tổng Đơn Đặt Cọc Pending"
        value={pendingReservations.toString()}
        icon={<DollarSign size={24} className="text-yellow-500" />}
      />
      <StatsCard
        title="Tổng Đơn Hàng"
        value={totalOrders.toString()}
        icon={<ShoppingCart size={24} className="text-blue-500" />}
        trend="up"
      />
      <StatsCard
        title="Tổng Đơn Hàng Pending"
        value={pendingOrders.toString()}
        icon={<ShoppingCart size={24} className="text-orange-500" />}
      />
      <StatsCard
        title="Tổng Users"
        value={totalUsers.toString()}
        icon={<ShoppingCart size={24} className="text-orange-500" />}
      />
    </div>
  );

  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="p-4">#{transaction.id}</td>
                  <td className="p-4">{transaction.customer}</td>
                  <td className="p-4">{transaction.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-full ml-20 bg-gray-100">
      <div className="w-full">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">Welcome back to your dashboard</p>
          </div>
          {renderStatsCards()}
          {renderCharts()}
          {renderTransactions()}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;