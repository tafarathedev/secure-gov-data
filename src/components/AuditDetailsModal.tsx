
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

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  ministry: string;
  action: 'login' | 'data_request' | 'data_access' | 'approval' | 'rejection' | 'download' | 'create' | 'update' | 'delete';
  resource: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress: string;
  details: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface AuditDetailsModalProps {
  entry: AuditEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditDetailsModal = ({ entry, isOpen, onClose }: AuditDetailsModalProps) => {
  if (!entry) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Audit Log Details</span>
          </DialogTitle>
          <DialogDescription>
            Complete information about this security audit entry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Risk Level */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{entry.id}</Badge>
            <Badge variant={getStatusColor(entry.status) as any}>
              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
            </Badge>
            <Badge variant={getRiskColor(entry.riskLevel) as any}>
              {entry.riskLevel.charAt(0).toUpperCase() + entry.riskLevel.slice(1)} Risk
            </Badge>
          </div>

          <Separator />

          {/* Audit Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Timestamp</span>
              </div>
              <p className="font-medium">{entry.timestamp}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>User</span>
              </div>
              <p className="font-medium">{entry.user}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Ministry</span>
              </div>
              <p className="font-medium">{entry.ministry}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>IP Address</span>
              </div>
              <p className="font-medium">{entry.ipAddress}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Action</span>
              </div>
              <p className="font-medium">
                {entry.action.replace('_', ' ').charAt(0).toUpperCase() + entry.action.replace('_', ' ').slice(1)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Resource</span>
              </div>
              <p className="font-medium">{entry.resource}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Details</span>
            </div>
            <p className="font-medium bg-muted/50 p-3 rounded-md">{entry.details}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
