
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Building2, 
  FileText, 
  Target, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

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

interface RequestDetailsModalProps {
  request: DataRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

export const RequestDetailsModal = ({ 
  request, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: RequestDetailsModalProps) => {
  if (!request) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Data Request Details</span>
          </DialogTitle>
          <DialogDescription>
            Complete information about this data exchange request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{request.id}</Badge>
            <Badge variant={getStatusColor(request.status) as any}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            <Badge variant={getUrgencyColor(request.urgency) as any}>
              {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
            </Badge>
          </div>

          <Separator />

          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Requesting Ministry</span>
              </div>
              <p className="font-medium">{request.requestingMinistry}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Target Ministry</span>
              </div>
              <p className="font-medium">{request.targetMinistry}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Data Type</span>
              </div>
              <p className="font-medium">{request.dataType}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Submitted Date</span>
              </div>
              <p className="font-medium">{request.createdAt}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Purpose</span>
            </div>
            <p className="font-medium">{request.purpose}</p>
          </div>

          <Separator />

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                className="text-success border-success hover:bg-success hover:text-success-foreground"
                variant="outline"
                onClick={() => onApprove?.(request.id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Request
              </Button>
              <Button 
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                variant="outline"
                onClick={() => onReject?.(request.id)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Request
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
