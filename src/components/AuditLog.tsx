import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  UserCheck, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  ministry: string;
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download';
  resource: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const mockAuditData: AuditEntry[] = [
  {
    id: "AUD-001",
    timestamp: "2024-01-10 14:23:45",
    user: "john.doe@moha.gov",
    ministry: "Ministry of Home Affairs",
    action: "data_access",
    resource: "Citizen Records DB",
    status: "success",
    ipAddress: "192.168.1.100",
    details: "Accessed citizen health records for contact tracing - Request ID: REQ-001",
    riskLevel: "medium"
  },
  {
    id: "AUD-002", 
    timestamp: "2024-01-10 14:15:32",
    user: "jane.smith@moh.gov",
    ministry: "Ministry of Health",
    action: "data_request",
    resource: "Home Affairs Data",
    status: "pending",
    ipAddress: "192.168.2.50",
    details: "Requested citizen health records for COVID-19 contact tracing",
    riskLevel: "high"
  },
  {
    id: "AUD-003",
    timestamp: "2024-01-10 13:45:12",
    user: "admin@mofa.gov",
    ministry: "Ministry of Foreign Affairs",
    action: "login",
    resource: "Portal Access",
    status: "success",
    ipAddress: "192.168.3.75",
    details: "Successful authentication to IMDES portal",
    riskLevel: "low"
  },
  {
    id: "AUD-004",
    timestamp: "2024-01-10 13:30:22",
    user: "bob.wilson@moe.gov",
    ministry: "Ministry of Education",
    action: "approval",
    resource: "Data Request REQ-002",
    status: "success",
    ipAddress: "192.168.4.120",
    details: "Approved data request for student demographics",
    riskLevel: "low"
  },
  {
    id: "AUD-005",
    timestamp: "2024-01-10 12:15:45",
    user: "unauthorized.user@external.com",
    ministry: "Unknown",
    action: "login",
    resource: "Portal Access",
    status: "failed",
    ipAddress: "203.45.67.89",
    details: "Failed login attempt - Invalid credentials",
    riskLevel: "high"
  }
];

export const AuditLog = () => {
  const exportAuditLogs = () => {
    const csvContent = [
      "ID,Timestamp,User,Ministry,Action,Resource,Status,IP Address,Risk Level,Details",
      ...mockAuditData.map(entry => 
        `"${entry.id}","${entry.timestamp}","${entry.user}","${entry.ministry}","${entry.action}","${entry.resource}","${entry.status}","${entry.ipAddress}","${entry.riskLevel}","${entry.details}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <UserCheck className="h-4 w-4" />;
      case 'data_request': return <FileText className="h-4 w-4" />;
      case 'data_access': return <Eye className="h-4 w-4" />;
      case 'approval': return <CheckCircle className="h-4 w-4" />;
      case 'rejection': return <XCircle className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Audit Log</h2>
          <p className="text-muted-foreground">
            Complete audit trail of all system activities and data access
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-primary-hover"
          onClick={exportAuditLogs}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
          <CardDescription>
            Filter audit logs by user, action, ministry, or time period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
              />
            </div>
            
            <Select defaultValue="all-actions">
              <SelectTrigger>
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-actions">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="data_request">Data Request</SelectItem>
                <SelectItem value="data_access">Data Access</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
                <SelectItem value="rejection">Rejection</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-ministries">
              <SelectTrigger>
                <SelectValue placeholder="Ministry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-ministries">All Ministries</SelectItem>
                <SelectItem value="moha">Ministry of Home Affairs</SelectItem>
                <SelectItem value="moh">Ministry of Health</SelectItem>
                <SelectItem value="moe">Ministry of Education</SelectItem>
                <SelectItem value="mofa">Ministry of Foreign Affairs</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-risk">
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-risk">All Risk Levels</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Chronological list of all system activities with full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAuditData.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`p-2 rounded-full ${
                    entry.status === 'success' ? 'bg-success/10 text-success' :
                    entry.status === 'failed' ? 'bg-destructive/10 text-destructive' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {getActionIcon(entry.action)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{entry.id}</Badge>
                    <Badge variant={getStatusColor(entry.status) as any}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </Badge>
                    <Badge variant={getRiskColor(entry.riskLevel) as any}>
                      {entry.riskLevel.charAt(0).toUpperCase() + entry.riskLevel.slice(1)} Risk
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {entry.timestamp}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {entry.action.replace('_', ' ').charAt(0).toUpperCase() + entry.action.replace('_', ' ').slice(1)} - {entry.resource}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>User:</strong> {entry.user} | <strong>Ministry:</strong> {entry.ministry}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>IP Address:</strong> {entry.ipAddress}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.details}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};