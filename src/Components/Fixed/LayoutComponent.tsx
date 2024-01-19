import React, { ReactNode } from "react";
import MiniDrawer from "./MiniDrawer";
import SideNav from "./SideNav";

interface LayoutComponentProps {
  children: ReactNode;
}

function LayoutComponent({ children }: LayoutComponentProps) {
  return (
    <>
     <div>
     <MiniDrawer />
      <SideNav />
      <div style={{marginLeft: "4%", marginTop: "1.5%"}}>
      {children}
      </div>
     </div>
    </>
  );
}

export default LayoutComponent;
