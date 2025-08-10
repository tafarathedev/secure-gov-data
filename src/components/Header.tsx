import { Shield, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  currentMinistry?: string;
  userRole?: string;
  userName?: string;
}

export const Header = ({ 
  currentMinistry = "Ministry of Home Affairs", 
  userRole = "Admin", 
  userName = "John Doe" 
}: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-gov-blue-dark to-gov-blue border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">
                Inter-Ministry Data Exchange System
              </h1>
              <p className="text-sm text-primary-foreground/80">
                {currentMinistry}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right text-primary-foreground">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-primary-foreground/80">{userRole}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary-hover">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Change Password</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};