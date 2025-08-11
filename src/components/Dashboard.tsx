import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { RequestDetailsModal } from "./RequestDetailsModal";

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

const mockRequests: DataRequest[] = [
  {
    id: "REQ-001",
    requestingMinistry: "Ministry of Health",
    targetMinistry: "Ministry of Home Affairs",
    dataType: "Citizen Health Records",
    purpose: "COVID-19 Contact Tracing",
    status: "pending",
    createdAt: "2024-01-10",
    urgency: "high"
  },
  {
    id: "REQ-002",
    requestingMinistry: "Ministry of Education",
    targetMinistry: "Ministry of Home Affairs",
    dataType: "Student Demographics",
    purpose: "Educational Planning",
    status: "approved",
    createdAt: "2024-01-09",
    urgency: "medium"
  },
  {
    id: "REQ-003",
    requestingMinistry: "Ministry of Foreign Affairs",
    targetMinistry: "Ministry of Home Affairs",
    dataType: "Passport Records",
    purpose: "Visa Processing",
    status: "rejected",
    createdAt: "2024-01-08",
    urgency: "low"
  }
];

export const Dashboard = ({ onNewRequest }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ministryFilter, setMinistryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [requests, setRequests] = useState(mockRequests);

  const handleViewDetails = (request: DataRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    setIsDetailsModalOpen(false);
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
    setIsDetailsModalOpen(false);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestingMinistry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.targetMinistry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesMinistry = ministryFilter === "all" || 
                           request.requestingMinistry.toLowerCase().includes(ministryFilter.toLowerCase()) ||
                           request.targetMinistry.toLowerCase().includes(ministryFilter.toLowerCase());
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;

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
            <div className="text-2xl font-bold text-primary">{mockStats.totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockStats.pendingRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{mockStats.approvedRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockStats.rejectedRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalUsers}</div>
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
            <Button 
              className="bg-gradient-to-r from-primary to-primary-hover"
              onClick={onNewRequest}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
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
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>From:</strong> {request.requestingMinistry} → <strong>To:</strong> {request.targetMinistry}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Purpose:</strong> {request.purpose}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted: {request.createdAt}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {request.status === 'pending' && (
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
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(request)}
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
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
