import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { authService, type SignUpData } from "@/services/authService";

interface SignUpFormProps {
  onSignUp?: (user: any) => void;
}

const ministries = [
  "Ministry of Home Affairs",
  "Ministry of Health",
  "Ministry of Education",
  "Ministry of Foreign Affairs"
];

const roles = [
  "Super Admin",
  "Ministry Admin", 
  "Data Controller",
  "Data Analyst",
  "Auditor"
];

const SignUpForm = ({ onSignUp }: SignUpFormProps) => {
  
  const [formData, setFormData] = useState<Partial<SignUpData>>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    position: "",
    ministry_id: 1,
    role_id: 3,
    phone: "",
    ministry: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Form Data Changed:', formData);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log('Form Data on Submit:', formData);

    if (!formData.email || !formData.password || !formData.ministry || !formData.role || !formData.username || !formData.full_name || !formData.position || !formData.phone) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const submissionData: SignUpData = {
        username: formData.username!,
        email: formData.email!,
        password: formData.password!,
        full_name: formData.full_name!,
        position: formData.position!,
        ministry_id: formData.ministry_id!,
        role_id: formData.role_id!,
        phone: formData.phone!
      };

      const response = await authService.signUp(submissionData);
      
      if (response.success) {
        toast({
          title: "Registration Successful",
          description: "Please login with your new account",
        });
        navigate('/');
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-blue-dark via-gov-blue to-gov-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-foreground p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            Secure Government Portal
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Inter-Ministry Data Exchange System
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Create your account to access ministry data
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="ministry">Ministry</Label>
                <Select
                  value={formData.ministry}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    ministry: value,
                    ministry_id: ministries.indexOf(value) + 1
                  }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map((ministry) => (
                       <SelectItem key={ministry} value={ministry}>
                         {ministry}
                       </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
  <Label htmlFor="role">Role</Label>
  <Select
    value={formData.role}
    onValueChange={(value) =>
      setFormData((prev) => ({
        ...prev,
        role: value,
        role_id: roles.indexOf(value) + 1,
        position: value
      }))
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select your role" />
    </SelectTrigger>
    <SelectContent>
      {roles.map((role) => (
        <SelectItem key={role} value={role}>
          {role}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

               <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

               <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter your Full Name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>

              
               <div className="space-y-2">
                 <Label htmlFor="phone">Phone</Label>
                 <Input
                   id="phone"
                   type="tel"
                   placeholder="Enter your phone number"
                   value={formData.phone}
                   onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                   required
                 />
               </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-hover"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Lock className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button variant="link" type="button" className="text-sm text-muted-foreground">
                 <Link to="#"> Forgot your password?</Link>
                </Button>
                <Button variant="link" type="button" className="text-sm text-muted-foreground">
                 <Link to="/" className="text-sm text-primary hover:underline">
                  Already have an account? Sign In
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-primary-foreground/60 text-xs">
            This is a secure government system. All activities are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
};


export default SignUpForm;