import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const SidebarContext = createContext({ isOpen: false, toggleSidebar: () => {} });

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}




function SidebarInset({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
  }
  
  export { SidebarInset };
  

export function SidebarToggle() {
  const { toggleSidebar } = useContext(SidebarContext);
  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 bg-gray-700 text-white p-2 rounded-md"
    >
      Toggle Sidebar
    </button>
  );
}
