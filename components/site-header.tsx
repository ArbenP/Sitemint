"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();

  let heading = "Documents";

  if (pathname === "/dashboard") {
    heading = "Dashboard";
  } else if (pathname === "/dashboard/sites") {
    heading = "Sites";
  } else if (pathname.startsWith("/dashboard/documents")) {
    heading = "Documents";
  } else if (pathname.startsWith("/dashboard/lifecycle")) {
    heading = "Lifecycle";
  } else if (pathname.startsWith("/dashboard/analytics")) {
    heading = "Analytics";
  } else if (pathname.startsWith("/dashboard/projects")) {
    heading = "Projects";
  } else if (pathname.startsWith("/dashboard/team")) {
    heading = "Team";
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{heading}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
