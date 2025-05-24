"use client";

import { SiteConfig } from "@/types/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

interface HeaderProps {
  site: SiteConfig;
}

export function Header({ site }: HeaderProps) {
  const [addBorder, setAddBorder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setAddBorder(true);
      } else {
        setAddBorder(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header className="relative sticky top-0 z-50 py-2 bg-background/60 backdrop-blur">
      <div className="flex justify-between items-center container">
        <Link href="/" className="relative mr-6 flex items-center space-x-2">
          <span
            className="font-bold text-xl"
            style={{ color: site.theme?.primaryColor || "" }}
          >
            {site.name}
          </span>
        </Link>

        <div className="hidden md:block">
          <div className="flex items-center gap-6">
            <nav className="flex gap-6">
              <Link
                href="#services"
                onClick={handleScroll}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hover:text-primary"
                )}
              >
                Services
              </Link>
              <Link
                href="#about"
                onClick={handleScroll}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hover:text-primary"
                )}
              >
                About Us
              </Link>
              <Link
                href="#portfolio"
                onClick={handleScroll}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hover:text-primary"
                )}
              >
                Projects
              </Link>
            </nav>

            <div className="flex gap-2">
              <Link
                href="#contact"
                onClick={handleScroll}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "text-background"
                )}
                style={{
                  backgroundColor: site.theme?.primaryColor || "",
                  borderColor: site.theme?.secondaryColor || "",
                }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="block md:hidden">
          <button
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            style={{
              color: site.theme?.primaryColor || "",
              borderColor: site.theme?.primaryColor || "",
            }}
          >
            Menu
          </button>
        </div>
      </div>
      <hr
        className={cn(
          "absolute w-full bottom-0 transition-opacity duration-300 ease-in-out",
          addBorder ? "opacity-100" : "opacity-0"
        )}
        style={{ borderColor: site.theme?.secondaryColor || "" }}
      />
    </header>
  );
}
