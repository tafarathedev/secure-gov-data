import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { AuditLog } from "@/components/AuditLog";
import { DataRequestForm } from "@/components/DataRequestForm";
import { LoginForm } from "@/components/LoginForm";
import { NavigationTabs } from "@/components/NavigationTabs";
import { authService } from "@/services/authService";
import {auditLogService} from "@/services/auditLogService"

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  role_id: number;
  ministry_id: number;
  
}
const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ministries, setMinistries] = useState([]);
 const [roles, setRoles] = useState([])
  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      const savedUser = authService.getUser();
      
      if (savedUser) {
        setUser(savedUser.user);
        setIsAuthenticated(true);
      }
    }

       ///fetch ministries
   fetch("http://localhost:4000/ministries/api/ministry")
  .then(res => res.json()) // <-- run it
  .then(data => {
    console.log(data.ministries)
    setMinistries(data.ministries);
  })
  .catch(err => console.error("Error fetching ministries:", err));


  //fetchroles
     fetch("http://localhost:4000/user-roles/api")
  .then(res => res.json()) // <-- run it
  .then(data => {
    console.log("data roles " , data.roles)
    setRoles(data.roles);
  })
  .catch(err => console.error("Error fetching ministries:", err));

  

  }, []);

   // Utility: map ministry ID to name
  const getMinistryName = (id: number) => {
  const ministry = ministries.find((m: any) => m.id === id);
  return ministry ? ministry.name : "Unknown";
};


/* const loggedInRoleId = localStorage.getItem('loggedInRoleId') */
const getUserRolesName = (id: number) =>{
  const role = roles.find((r: any)=> r.id === id);
  return role ? role.role_name : "unknown"
}


//console.log("user role",getUserRolesName(parseInt()))

console.log('user', user)
  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };
  const handleNewRequest = (requestData: any) => {
    console.log("New request submitted:", requestData);
    // In a real app, this would send to your Node.js backend
    auditLogService.createAuditLog({ action: '', resource: 'Data Request', details: '' })

  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

 
  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentMinistry={getMinistryName(user?.ministry_id)}
        userRole={getUserRolesName(parseInt(user?.role_id))}
        userName={user?.full_name}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {{
            dashboard: <Dashboard onNewRequest={() => setActiveTab("requests")} />,
            requests: (
              <DataRequestForm
                currentMinistry={getMinistryName(user?.ministry_id) || ""}
                targetMinistry=""
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