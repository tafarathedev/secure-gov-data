import { useEffect, useState } from "react";
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
import { format } from "date-fns";
import { AuditDetailsModal } from "./AuditDetailsModal";
import { useAuditLogs } from "@/hooks/useAuditLogs";

interface AuditEntry {
  id: string;
  timestamp: string;
  user?: string;
  ministry?: string;
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download';
  resource?: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress?: string;
  details?: string;
  riskLevel: 'low' | 'medium' | 'high';
}



export const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all-actions");
  const [ministryFilter, setMinistryFilter] = useState("all-ministries");
  const [riskFilter, setRiskFilter] = useState("all-risk");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { logs, loading } = useAuditLogs();
  const [ministries, setMinistries] = useState([])  

  const handleViewDetails = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setIsDetailsModalOpen(true);
  };
const filteredAuditData = logs.filter((entry) => {
  const search = searchTerm.toLowerCase();

  const safe = (value: unknown) => String(value ?? "").toLowerCase();

  const matchesSearch =
    safe(entry.user_email).includes(search) ||
    safe(entry.ministry_id).includes(search) ||
    safe(entry.resource).includes(search) ||
    safe(entry.details).includes(search);

  const matchesAction =
    actionFilter === "all-actions" || entry.action === actionFilter;

  const matchesMinistry =
    ministryFilter === "all-ministries" ||
    safe(entry.ministry_id).includes(ministryFilter.toLowerCase());

  const matchesRisk =
    riskFilter === "all-risk" || entry.risk_level === riskFilter;

  return matchesSearch && matchesAction && matchesMinistry && matchesRisk;
});


useEffect(()=>{
    fetch("http://localhost:4000/ministries/api/ministry")
  .then(res => res.json()) // <-- run it
  .then(data => {
    console.log(data.ministries)
    setMinistries(data.ministries);
  })
  .catch(err => console.error("Error fetching ministries:", err));

return console.log('logs ministries' , ministries)
 

},[])
 //Utitlity Ministry
 // Utility: map ministry ID to name
  const getMinistryName = (id: number) => {
  const ministry = ministries.find((m: any) => m.id === id);
  return ministry ? ministry.name : "Unknown";
};
 

  console.log("filtered" , filteredAuditData)
  const exportAuditLogs = () => {
    const csvContent = [
      "ID,Timestamp,User,Ministry,Action,Resource,Status,IP Address,Risk Level,Details",
      ...logs.map(entry => 
        `"${entry.id}","${entry.timestamp}","${entry.user_emial}","${entry.ministry_id}","${entry.action}","${entry.resource}","${entry.status}","${entry.ipAddress}","${entry.riskLevel}","${entry.details}"`
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
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

            <Select value={ministryFilter} onValueChange={setMinistryFilter}>
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

            <Select value={riskFilter} onValueChange={setRiskFilter}>
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
            {filteredAuditData.map((entry) => (
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
                  {String(entry.status || "")
                    .charAt(0)
                    .toUpperCase() + String(entry.status || "").slice(1)}
                </Badge>

                <Badge variant={getRiskColor(entry.risk_level) as any}>
                  {String(entry.risk_level || "")
                    .charAt(0)
                    .toUpperCase() + String(entry.risk_level || "").slice(1)} Risk
                </Badge>
                   <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(new Date(entry.timestamp), "PPpp")}    
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {entry.action.replace('_', ' ').charAt(0).toUpperCase() + entry.action.replace('_', ' ').slice(1)} - {entry.resource}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>User:</strong> {entry.user_email} | <strong>Ministry:</strong> {getMinistryName(entry.ministry_id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>IP Address:</strong> {entry.ip_address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.details}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(entry)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredAuditData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No audit entries found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AuditDetailsModal
        entry={selectedEntry}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};
