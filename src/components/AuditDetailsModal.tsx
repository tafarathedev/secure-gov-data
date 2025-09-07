import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  User, 
  Building2, 
  Globe, 
  Shield,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  ministry: string;
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download' | 'create' | 'update' | 'delete' | 'signup' | 'logout';
  resource: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress: string;
  details: string;
  risk_level: 'low' | 'medium' | 'high';
}

interface AuditDetailsModalProps {
  entry: AuditEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDetailsModal = ({ entry, isOpen, onClose }: AuditDetailsModalProps) => {
const [ministries, setMinistries] = useState([])  
console.log(" entries" , entry)
    if (!entry) return null;



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
 
console.log(entry.ministry_id)


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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <User className="h-4 w-4" />;
      case 'data_request':
      case 'data_access':
        return <Shield className="h-4 w-4" />;
      case 'approval':
      case 'rejection':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getActionIcon(entry.action)}
            <span>Audit Log Details</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this system activity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Risk Level */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{entry.id}</Badge>
            <Badge variant={getStatusColor(entry.status) as any}>
              {String(entry.status || "").charAt(0).toUpperCase() + String(entry.status || "").slice(1)}
            </Badge>
            <Badge variant={getRiskColor(entry.risk_level) as any}>
              {String(entry.risk_level).charAt(0).toUpperCase() + String(entry.risk_level).slice(1)} Risk
            </Badge>
          </div>

          <Separator />

          {/* Activity Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>User</span>
              </div>
              <p className="font-medium">{entry.user_email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Ministry</span>
              </div>
              <p className="font-medium">{getMinistryName(entry.ministry_id) }</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Action</span>
              </div>
              <p className="font-medium">{entry.action.replace('_', ' ').charAt(0).toUpperCase() + entry.action.replace('_', ' ').slice(1)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Resource</span>
              </div>
              <p className="font-medium">{entry.resource}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>IP Address</span>
              </div>
              <p className="font-medium">{entry.ip_address}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Timestamp</span>
              </div>
              <p className="font-medium">{entry.timestamp}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Details</span>
            </div>
            <p className="font-medium bg-muted p-3 rounded-md">{entry.details}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );


};