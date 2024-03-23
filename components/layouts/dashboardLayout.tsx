"use client";

import Nav from "@/components/ui/nav";
import { OrgSwitcher } from "@/components/ui/org-switcher";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ReactNode, Suspense, useState } from "react";

export default function DashboardLayoutComponent({
  children,
}: {
  children: ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes,
        )}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={265}
        collapsedSize={4}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onCollapse={() => {
          setIsCollapsed(!isCollapsed);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            isCollapsed,
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(!isCollapsed);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            isCollapsed,
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
        )}
      >
        <div
          className={cn(
            "flex h-[52px] items-center justify-center",
            isCollapsed ? "h-[52px]" : "px-2",
          )}
        >
          <OrgSwitcher isCollapsed={isCollapsed} />
        </div>
        <Separator />
        <Nav isCollapsed={isCollapsed}>
          <Suspense fallback={<div>Loading...</div>}>
            {/* <Profile /> */}
          </Suspense>
        </Nav>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={735}
        className="flex flex-col overflow-hidden"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
