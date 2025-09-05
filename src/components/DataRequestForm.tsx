import { useEffect, useState } from "react";
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
  targetMinistry: string;
  onSubmit: (requestData: any) => void;
}

/* const targetMinistries = [
  "Ministry of Home Affairs",
  "Ministry of Health", 
  "Ministry of Education",
  "Ministry of Foreign Affairs"
];
 */
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
  const [targetMinistryOptions, setTargetMinistryOptions] = useState<string[]>([]);
  const [dataTypes,setDataTypes] = useState<string[]>([]);
  //authed user info from session storage
  const currentUserId = localStorage.getItem("auth_token") || "user-123"+1;
  const { toast } = useToast();

useEffect(() => {
  //pull target ministries from localhost:4000/ministries/api/ministry use fetch 
const fetchMinistries = async () => {
  try {
      const response = await fetch('http://localhost:4000/ministries/api/ministry');
    const data = await response.json();
    if (response.ok) {
      setTargetMinistryOptions(data.ministries)
      return data.ministries; // Assuming the API returns an array of ministries   
    } 
    console.log('no data returned')
  return data
  } catch (error) {
    console.error('Error fetching ministries:', error);
  }
}


//fetch ministries on component mount
fetchMinistries().then(data => console.log(data));
  

//fetch data types from localhost:4000/data-types/api/
const fetchDataTypes = async ()=>{
  try {
    const response = await fetch('http://localhost:4000/data-types/api/');
    const dataTypes = await response.json();
    if (response.ok) {
      setDataTypes(dataTypes.data)
      console.log("data types from api", dataTypes.data);
      return dataTypes.data; // Assuming the API returns an array of data types   
    }
    
  } catch (error) {
     console.error('Error fetching data types:', error);
  }
}
fetchDataTypes().then(data => console.log("data types", data));
//setDataTypes(dataTypesFromApi)
  
},[])

console.log("target ministries", targetMinistryOptions);


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Validation
  if (!formData.targetMinistry || !formData.dataType || !formData.purpose || !formData.justification) {
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    });
    setIsSubmitting(false);
    return;
  }

  if (!formData.supervisorApproval) {
    toast({
      title: "Authorization Required",
      description: "Supervisor approval is required for data requests",
      variant: "destructive",
    });
    setIsSubmitting(false);
    return;
  }

  try {
    const requestId = `REQ-${Date.now()}`;

    // Map frontend formData to DB fields
    const payload = {
      id: requestId,
      requesting_ministry_id:2, // replace with actual ID from session
      target_ministry_id: parseInt(formData.targetMinistry), // ID of target ministry
      requested_by: 2, // replace with actual user ID from session
      data_type_id: parseInt(formData.dataType), // ID of selected data type
      specific_record_ids: formData.recordIds || null,
      purpose: formData.purpose,
      justification: formData.justification,
      legal_basis: formData.legalBasis || null,
      urgency: formData.urgency,
      retention_period_days: parseInt(formData.retentionPeriod),
      data_sharing_acknowledged: formData.dataSharing,
      supervisor_approved: formData.supervisorApproval,
      requestor_name: formData.requestorName,
      requestor_position: formData.requestorPosition,
    };

    // Call your API
   const response = await fetch("http://localhost:4000/data-requests/api/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${currentUserId}`, // replace with real token
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  // Try to read text in case it's not JSON
  const text = await response.text();
  throw new Error(text || "Failed to submit request");
}

const data = await response.json();

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
      supervisorApproval: false,
    });

    toast({
      title: "Request Submitted",
      description:data.message || "Request submitted successfully",
      variant: "success",
    });
    //navigator('/')

    setIsSubmitting(false);
  } catch (error) {
    toast({
      title: "Network Error",
      description: error instanceof Error ? error.message : "An error occurred",
      variant: "destructive",
    });
    setIsSubmitting(false);
  }
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
  onValueChange={(value) =>
    setFormData((prev) => ({ ...prev, targetMinistry: value }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select a ministry" />
  </SelectTrigger>
  <SelectContent>
    {targetMinistryOptions
      .filter((ministry) => ministry.name !== currentMinistry) // 👈 filter first
      .map((ministry) => (                             // 👈 then map
        <SelectItem key={ministry.id} value={ministry.id}>
          {ministry.name}
        </SelectItem>
      ))}
  </SelectContent>
</Select>

               {/*<Select
                  value={formData.targetMinistry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetMinistry: value }))}
                  required
                >
                  
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry to request from" />
                  </SelectTrigger>
                  <SelectContent>
                   {targetMinistryOptions
                  .filter(ministry => ministry !== currentMinistry)
                  .map((ministry) => (
                    <SelectItem key={ministry.id} value={ministry}>
                      {ministry}
                    </SelectItem>
                  ))} 
                  </SelectContent>
                </Select> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type *</Label>
                <Select
                  value={formData.dataType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, dataType: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type of data needed" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value as 'low' | 'medium' | 'high' }))}
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