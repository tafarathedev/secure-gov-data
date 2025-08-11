import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  FileText, 
  Shield, 
  Activity,
  Users,
  Settings
} from "lucide-react";

interface NavigationTabsProps {
  children: {
    dashboard: React.ReactNode;
    requests: React.ReactNode;
    audit: React.ReactNode;
  };
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const NavigationTabs = ({ children, activeTab = "dashboard", onTabChange }: NavigationTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="dashboard" className="flex items-center space-x-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="requests" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Data Requests</span>
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Audit Log</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="space-y-6">
        {children.dashboard}
      </TabsContent>
      
      <TabsContent value="requests" className="space-y-6">
        {children.requests}
      </TabsContent>
      
      <TabsContent value="audit" className="space-y-6">
        {children.audit}
      </TabsContent>
    </Tabs>
  );
};