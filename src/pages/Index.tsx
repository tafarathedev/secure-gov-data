import { useState } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { AuditLog } from "@/components/AuditLog";
import { DataRequestForm } from "@/components/DataRequestForm";
import { LoginForm } from "@/components/LoginForm";
import { NavigationTabs } from "@/components/NavigationTabs";

interface User {
  ministry: string;
  role: string;
  username: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogin = (ministry: string, role: string, username: string) => {
    setUser({ ministry, role, username });
    setIsAuthenticated(true);
  };

  const handleNewRequest = (requestData: any) => {
    console.log("New request submitted:", requestData);
    // In a real app, this would send to your Node.js backend
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentMinistry={user?.ministry}
        userRole={user?.role}
        userName={user?.username}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {{
            dashboard: <Dashboard onNewRequest={() => setActiveTab("requests")} />,
            requests: (
              <DataRequestForm 
                currentMinistry={user?.ministry || ""}
                onSubmit={handleNewRequest}
              />
            ),
            audit: <AuditLog />
          }}
        </NavigationTabs>
      </main>
    </div>
  );
};

export default Index;
