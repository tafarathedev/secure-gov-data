import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Send, 
  AlertTriangle, 
  Info, 
  Clock,
  Shield,
  Users,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataRequestFormProps {
  currentMinistry: string;
  onSubmit: (requestData: any) => void;
}

const targetMinistries = [
  "Ministry of Home Affairs",
  "Ministry of Health", 
  "Ministry of Education",
  "Ministry of Foreign Affairs"
];

const dataTypes = [
  "Citizen Demographics",
  "Health Records",
  "Educational Records", 
  "Passport/Visa Records",
  "Employment Records",
  "Tax Records",
  "Criminal Records",
  "Property Records"
];

const urgencyLevels = [
  { value: "low", label: "Low Priority", description: "Standard processing (5-7 days)" },
  { value: "medium", label: "Medium Priority", description: "Expedited processing (2-3 days)" },
  { value: "high", label: "High Priority", description: "Urgent processing (24 hours)" }
];

export const DataRequestForm = ({ currentMinistry, onSubmit }: DataRequestFormProps) => {
  const [formData, setFormData] = useState({
    targetMinistry: "",
    dataType: "",
    recordIds: "",
    purpose: "",
    justification: "",
    urgency: "medium",
    retentionPeriod: "30",
    dataSharing: false,
    legalBasis: "",
    requestorName: "",
    requestorPosition: "",
    supervisorApproval: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.targetMinistry || !formData.dataType || !formData.purpose || !formData.justification) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.supervisorApproval) {
      toast({
        title: "Authorization Required",
        description: "Supervisor approval is required for data requests",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const requestId = `REQ-${Date.now().toString().slice(-6)}`;
      
      toast({
        title: "Request Submitted Successfully",
        description: `Your request has been submitted with ID: ${requestId}`,
      });

      onSubmit({
        ...formData,
        id: requestId,
        requestingMinistry: currentMinistry,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // Reset form
      setFormData({
        targetMinistry: "",
        dataType: "",
        recordIds: "",
        purpose: "",
        justification: "",
        urgency: "medium", 
        retentionPeriod: "30",
        dataSharing: false,
        legalBasis: "",
        requestorName: "",
        requestorPosition: "",
        supervisorApproval: false
      });

      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Inter-Ministry Data Request</h2>
        <p className="text-muted-foreground mt-2">
          Submit a secure request for data access from another ministry
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Request Details
            </CardTitle>
            <CardDescription>
              Specify what data you need and from which ministry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetMinistry">Target Ministry *</Label>
                <Select
                  value={formData.targetMinistry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetMinistry: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry to request from" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetMinistries
                      .filter(ministry => ministry !== currentMinistry)
                      .map((ministry) => (
                        <SelectItem key={ministry} value={ministry}>
                          {ministry}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type *</Label>
                <Select
                  value={formData.dataType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dataType: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of data needed" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordIds">Specific Record IDs (Optional)</Label>
              <Input
                id="recordIds"
                placeholder="Enter specific record IDs, citizen IDs, or search criteria"
                value={formData.recordIds}
                onChange={(e) => setFormData(prev => ({ ...prev, recordIds: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to request access to the entire dataset category
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Request *</Label>
              <Input
                id="purpose"
                placeholder="Brief description of why this data is needed"
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Detailed Justification *</Label>
              <Textarea
                id="justification"
                placeholder="Provide detailed justification including legal basis, specific use case, and how this supports government operations..."
                value={formData.justification}
                onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Request Priority & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Priority & Timeline
            </CardTitle>
            <CardDescription>
              Set the urgency level and data retention requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Request Urgency *</Label>
              <RadioGroup
                value={formData.urgency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                className="space-y-2"
              >
                {urgencyLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <div className="flex-1">
                      <Label htmlFor={level.value} className="font-medium cursor-pointer">
                        {level.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    <Badge variant={level.value === 'high' ? 'destructive' : 'secondary'}>
                      {level.label}
                    </Badge>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retentionPeriod">Data Retention Period (Days)</Label>
              <Select
                value={formData.retentionPeriod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, retentionPeriod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="permanent">Permanent (requires special approval)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Authorization & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Authorization & Compliance
            </CardTitle>
            <CardDescription>
              Confirm authorization and compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestorName">Requestor Name *</Label>
                <Input
                  id="requestorName"
                  placeholder="Full name of the person making this request"
                  value={formData.requestorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, requestorName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestorPosition">Position/Title *</Label>
                <Input
                  id="requestorPosition"
                  placeholder="Official position or job title"
                  value={formData.requestorPosition}
                  onChange={(e) => setFormData(prev => ({ ...prev, requestorPosition: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalBasis">Legal Basis for Request</Label>
              <Input
                id="legalBasis"
                placeholder="Cite relevant laws, regulations, or policies"
                value={formData.legalBasis}
                onChange={(e) => setFormData(prev => ({ ...prev, legalBasis: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dataSharing"
                  checked={formData.dataSharing}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, dataSharing: checked as boolean }))}
                />
                <Label htmlFor="dataSharing" className="text-sm">
                  I acknowledge that this data may be shared with authorized third parties for legitimate government purposes
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="supervisorApproval"
                  checked={formData.supervisorApproval}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, supervisorApproval: checked as boolean }))}
                />
                <Label htmlFor="supervisorApproval" className="text-sm font-medium">
                  I confirm that this request has been approved by my immediate supervisor *
                </Label>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All data requests are subject to review and approval by the target ministry. 
                Requests must comply with data protection laws and inter-ministry agreements.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-primary-hover min-w-48"
          >
            {isSubmitting ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-pulse" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Data Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};