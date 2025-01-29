import { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbContextType {
  breadcrumbs: any[]; 
  setBreadcrumbs: React.Dispatch<React.SetStateAction<any[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};
