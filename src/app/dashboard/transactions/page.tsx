"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockTransactions = [
  {
    id: "txn_001",
    type: "tokenization",
    asset: "Manhattan Apartment",
    amount: 750000,
    currency: "USD",
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    hash: "0x1234...abcd",
    network: "Ethereum",
    fee: 45.50,
  },
  {
    id: "txn_002",
    type: "loan",
    asset: "Gold Reserves",
    amount: 125000,
    currency: "USDC",
    status: "completed",
    date: "2024-01-14T14:20:00Z",
    hash: "0x5678...efgh",
    network: "Polygon",
    fee: 12.25,
  },
  {
    id: "txn_003",
    type: "repayment",
    asset: "Equipment Financing",
    amount: 5000,
    currency: "USDC",
    status: "pending",
    date: "2024-01-13T09:15:00Z",
    hash: "0x9abc...ijkl",
    network: "BSC",
    fee: 8.75,
  },
  {
    id: "txn_004",
    type: "transfer",
    asset: "Portfolio Rebalance",
    amount: 25000,
    currency: "ETH",
    status: "completed",
    date: "2024-01-12T16:45:00Z",
    hash: "0xdef0...mnop",
    network: "Ethereum",
    fee: 67.30,
  },
  {
    id: "txn_005",
    type: "withdrawal",
    asset: "Profit Distribution",
    amount: 15000,
    currency: "USDC",
    status: "failed",
    date: "2024-01-11T11:00:00Z",
    hash: "0x1111...2222",
    network: "Arbitrum",
    fee: 5.00,
  },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tokenization":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "loan":
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      case "repayment":
        return <ArrowDown className="w-4 h-4 text-green-600" />;
      case "transfer":
        return <ArrowUpDown className="w-4 h-4 text-orange-600" />;
      case "withdrawal":
        return <ArrowUp className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch = 
      txn.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || txn.type === filterType;
    const matchesStatus = filterStatus === "all" || txn.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-2">
            Track all your asset transactions and blockchain activities
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">$915,000</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+8 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">98.2%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">Above average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Fee</p>
                <p className="text-2xl font-bold text-gray-900">$27.76</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">-5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions, assets, or hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tokenization">Tokenization</SelectItem>
                <SelectItem value="loan">Loan</SelectItem>
                <SelectItem value="repayment">Repayment</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(txn.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{txn.asset}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="capitalize">{txn.type}</span>
                      <span>•</span>
                      <span>{new Date(txn.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{txn.network}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {txn.amount.toLocaleString()} {txn.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      Fee: ${txn.fee}
                    </p>
                  </div>
                  
                  <Badge className={getStatusColor(txn.status)}>
                    {txn.status}
                  </Badge>

                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 