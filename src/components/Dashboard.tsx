import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios'
import { format } from "date-fns";//date lib
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RequestDetailsModal } from "./RequestDetailsModal";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";
import { toast } from "sonner";


interface DashboardProps {
  onNewRequest?: () => void;
}

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalUsers: number;
}

interface DataRequest {
  id: string;
  requestingMinistry: string;
  targetMinistry: string;
  dataType: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  urgency: 'low' | 'medium' | 'high';
}

const mockStats: DashboardStats = {
  totalRequests: 147,
  pendingRequests: 23,
  approvedRequests: 98,
  rejectedRequests: 26,
  totalUsers: 156
};




export const Dashboard = ({ onNewRequest }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ministryFilter, setMinistryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [ministries, setMinistries] = useState([]);
 const [dataTypes,setDataTypes] = useState<string[]>([]);

//fetch data requests from backend
const baseURI = "http://localhost:4000/data-requests/api";

useEffect(()=>{
  //fetched requests
async function fetchrequests() {
  try {
    const response = await fetch(`${baseURI}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
   const data =   await response.json();
    setRequests(data.data);
    return data
  } catch (error) {
    console.error("Error fetching data requests:", error);
    throw error;
  }
}
 fetchrequests().then((data) => console.log(data));



//fetch users to get total users
const fetchUsers = async () => {
  try{
    const response = await axios.get('http://localhost:4000/auth/api/users');
      
   //console.log("users:",response);
  if(response.status === 200){
    const users = response.data.users 
    setTotalUsers(users.length)
    console.log("users:",users);
  }
  }catch(error){console.log(error)}
}


fetchUsers()

  
//fetch ministries

   fetch("http://localhost:4000/ministries/api/ministry")
  .then(res => res.json()) // <-- run it
  .then(data => {
    console.log(data.ministries)
    setMinistries(data.ministries);
  })
  .catch(err => console.error("Error fetching ministries:", err));


  //fetch data dataTypes
  fetch('http://localhost:4000/data-types/api/')
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // parse JSON
  })
  .then((dataTypes) => {
    setDataTypes(dataTypes.data); // set state
    console.log("data types from API", dataTypes.data);
    return dataTypes.data; // return data if needed
  })
  .catch((error) => {
    console.error("Error fetching data types:", error);
  });


},[])
 // Utility: map ministry ID to name
  const getMinistryName = (id: number) => {
  const ministry = ministries.find((m: any) => m.id === id);
  return ministry ? ministry.name : "Unknown";
};


//Utility : map data types data to the name 
const getDataTypesName = (id: number) =>{
  const data_types = dataTypes.find((d:any) => d.id === id)
  return data_types ? data_types.name : "unknown"
}

//count requests by status
const approvedCount = requests.filter((req) => req.status === "approved").length;
const pendingCount = requests.filter((req) => req.status === "pending").length;
const rejectedCount = requests.filter((req) => req.status === "rejected").length;

//counts request from ministries
const homeAffRequests = requests.filter((req) => req.requesting_ministry_id === 1).length;
const healthRequests = requests.filter((req) => req.requesting_ministry_id === 2).length;
const eduRequests = requests.filter((req) => req.requesting_ministry_id === 3).length;
const foreignAffRequests = requests.filter((req) => req.requesting_ministry_id === 4).length;
const financeRequests = requests.filter((req) => req.requesting_ministry_id === 5).length;

//requests by month
//from current month till 5 months later 
const currentMonth = new Date().getMonth(); // 0-11
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyCounts = Array(5).fill(0); // For 5 months

requests.forEach((req) => {
  const reqDate = new Date(req.createdAt);
  const reqMonth = reqDate.getMonth();
  const monthDiff = (reqMonth - currentMonth + 12) % 12; // Handle year wrap-around
  if (monthDiff < 5) {
    monthlyCounts[monthDiff]++;
  }
});

// Prepare data for monthly trend chart
const monthlyData = monthlyCounts.map((count, index) => ({
  month: monthNames[(currentMonth + index) % 12],
  requests: count,
}));


// Chart data
const statusData = [
  { name: "Approved", value: approvedCount, fill: "hsl(var(--success))" },
  { name: "Pending", value: pendingCount, fill: "hsl(var(--warning))" },
  { name: "Rejected", value: rejectedCount, fill: "hsl(var(--destructive))" }
];

const ministryData = [
  { name: "Home Affairs", requests: homeAffRequests },
  { name: "Education", requests: eduRequests },
  { name: "Health", requests: healthRequests },
  { name: "Foreign Affairs", requests: foreignAffRequests },
  { name: "Finance", requests: financeRequests }
];



const chartConfig = {
  approved: { label: "Approved", color: "hsl(var(--success))" },
  pending: { label: "Pending", color: "hsl(var(--warning))" },
  rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
  requests: { label: "Requests", color: "hsl(var(--primary))" }
};



  console.log("data requests",requests);
  const handleViewDetails = (request: DataRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };


const handleApprove = async (requestId: string) => {
  const payload = { status: "approved" }; // match enum from DB
 setIsDetailsModalOpen(false);
  try {
    const token = localStorage.getItem("auth_token"); // if you store JWT here

    const response = await axios.put(
      `http://localhost:4000/data-requests/api/${requestId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // only if required
        },
      }
    );
    
    console.log("Request approved:", response.data);
    //toast

  } catch (error: any) {
    console.error("Error approving request:", error.response?.data || error.message);
  }
};

  const handleReject = async (requestId: string) => {
     const payload = { status: "rejected" }; // match enum from DB
     setIsDetailsModalOpen(false);
  try {
    const token = localStorage.getItem("auth_token"); // if you store JWT here

    const response = await axios.put(
      `http://localhost:4000/data-requests/api/${requestId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // only if required
        },
      }
    );
   
    console.log("Request approved:", response.data);
    //toast
    
  } catch (error: any) {
    console.error("Error approving request:", error.response?.data || error.message);
  }
  };

  const exportRequests = () => {
    const csvContent = [
      ['Request ID', 'Requesting Ministry', 'Target Ministry', 'Data Type', 'Purpose', 'Status', 'Urgency', 'Created At'],
      ...filteredRequests.map(req => [
        req.id,
        getMinistryName(req.requesting_ministry_id),
        getMinistryName(req.target_ministry_id),
        getDataTypesName(req.data_type_id),
        req.purpose,
        req.status,
        req.urgency,
        req.created_at
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportLogs = () => {
    const mockLogs = [
      { timestamp: '2024-01-10 14:30:00', user: 'admin@health.gov', action: 'Request Created', details: 'REQ-001 created by Ministry of Health', ip: '192.168.1.100' },
      { timestamp: '2024-01-10 15:45:00', user: 'reviewer@home.gov', action: 'Request Reviewed', details: 'REQ-001 under review by Ministry of Home Affairs', ip: '192.168.1.105' },
      { timestamp: '2024-01-09 09:15:00', user: 'admin@education.gov', action: 'Request Approved', details: 'REQ-002 approved for data sharing', ip: '192.168.1.102' },
      { timestamp: '2024-01-08 16:20:00', user: 'admin@foreign.gov', action: 'Request Rejected', details: 'REQ-003 rejected due to security concerns', ip: '192.168.1.108' },
    ];

    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Details', 'IP Address'],
      ...mockLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.details,
        log.ip
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

   const filteredRequests = requests.filter(request => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    request.dataType?.toLowerCase().includes(search) ||
    request.requestingMinistry?.toLowerCase().includes(search) ||
    request.targetMinistry?.toLowerCase().includes(search) ||
    request.purpose?.toLowerCase().includes(search);

  const matchesStatus = statusFilter === "all" || request.status?.toLowerCase() === statusFilter.toLowerCase();
  const matchesMinistry =
    ministryFilter === "all" ||
    request.requestingMinistry?.toLowerCase().includes(ministryFilter.toLowerCase()) ||
    request.targetMinistry?.toLowerCase().includes(ministryFilter.toLowerCase());

  const matchesUrgency = urgencyFilter === "all" || request.urgency?.toLowerCase() === urgencyFilter.toLowerCase();

  return matchesSearch && matchesStatus && matchesMinistry && matchesUrgency;
});

 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{requests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>Breakdown of request statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="60%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent hideLabel />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Requests by Ministry */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Ministry</CardTitle>
            <CardDescription>Request volume per ministry</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={ministryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="requests" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Request Trend</CardTitle>
            <CardDescription>Monthly request volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Requests Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Exchange Requests</CardTitle>
              <CardDescription>
                Manage incoming and outgoing data requests between ministries
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={exportRequests}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Requests
              </Button>
              <Button 
                variant="outline"
                onClick={exportLogs}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-primary-hover"
                onClick={onNewRequest}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ministryFilter} onValueChange={setMinistryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Ministry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ministries</SelectItem>
                <SelectItem value="health">Ministry of Health</SelectItem>
                <SelectItem value="home">Ministry of Home Affairs</SelectItem>
                <SelectItem value="education">Ministry of Education</SelectItem>
                <SelectItem value="foreign">Ministry of Foreign Affairs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{request.id}</Badge>
                    <Badge variant={getStatusColor(request.status) as any}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    <Badge variant={getUrgencyColor(request.urgency) as any}>
                      {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-foreground">{request.dataType}</h4>
                  <p key={request.id} className="text-sm text-muted-foreground mb-1">
          <strong>From:</strong> {getMinistryName(request.requesting_ministry_id)} →
          <strong>To:</strong> {getMinistryName(request.target_ministry_id)}
        </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> {request.purpose}
                  </p>
                <p className="text-sm text-muted-foreground mb-1">
              <strong>Submitted at:</strong>{" "}
              {request.created_at
                ? format(new Date(request.created_at), "dd MMM yyyy, HH:mm")
                : "N/A"}
            </p>

                </div>
                
                <div  className="flex space-x-2">
                  {request.status === 'pending'? (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-success border-success hover:bg-success hover:text-success-foreground"
                       
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleReject(request.id)}
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Reject
                      </Button>
                    </>
                  ): <></>}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(request as any)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
             {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No requests found matching your filters.
              </div>
            )} 
          </div>
        </CardContent>
      </Card>

      <RequestDetailsModal
        request={selectedRequest}
        getMinProp={getMinistryName}
        getDtProp = {getDataTypesName}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
