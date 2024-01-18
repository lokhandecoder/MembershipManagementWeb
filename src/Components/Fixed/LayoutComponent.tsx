import React, { ReactNode } from "react";
import MiniDrawer from "./MiniDrawer";

interface LayoutComponentProps {
  children: ReactNode;
}

function LayoutComponent({ children }: LayoutComponentProps) {
  return (
    <>
      <MiniDrawer />
      <div style={{marginLeft: "5%"}}>
      {children}
      </div>
    </>
  );
}

export default LayoutComponent;
