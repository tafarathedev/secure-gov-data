import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authService } from '@/services/authService';
import { User, Mail, Phone, Building, Users, Save } from 'lucide-react';
import { Header } from './Header';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  position: string;
  ministry: string;
  role: string;
}

const ministries = [
  "Ministry of Health",
  "Ministry of Education", 
  "Ministry of Finance",
  "Ministry of Agriculture",
  "Ministry of Transport",
  "Ministry of Energy",
  "Ministry of Defense",
  "Ministry of Interior"
];

const roles = [
  "Data Analyst",
  "Data Manager", 
  "System Administrator",
  "Ministry Representative",
  "Security Officer"
];

export const ProfileSettings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    username: '',
    email: '',
    full_name: '',
    phone: '',
    position: '',
    ministry: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setProfile({
        id: user.id || '',
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        phone: user.phone || '',
        position: user.position || '',
        ministry: user.ministry || '',
        role: user.role || ''
      });
    }
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would typically call an API to update the profile
      // For now, we'll just update localStorage
      const currentUser = authService.getUser();
      const updatedUser = { ...currentUser, ...profile };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <Header/>
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Settings</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Username</span>
              </Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={profile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Enter position"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ministry" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Ministry</span>
              </Label>
              <Select value={profile.ministry} onValueChange={(value) => handleInputChange('ministry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ministry" />
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
              <Label htmlFor="role" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Role</span>
              </Label>
              <Select value={profile.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
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
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div></>
  );
};