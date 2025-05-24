import { SiteConfig } from "@/types/site";
import { Facebook, Instagram, Linkedin } from "lucide-react";

interface FooterProps {
  site: SiteConfig;
}

export function Footer({ site }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear} {site.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {site.socialMedia?.facebook && (
            <a
              href={site.socialMedia.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              style={
                {
                  "--hover-color": site.theme.primaryColor,
                } as React.CSSProperties
              }
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Follow us on Facebook</span>
            </a>
          )}
          {site.socialMedia?.instagram && (
            <a
              href={site.socialMedia.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              style={
                {
                  "--hover-color": site.theme.primaryColor,
                } as React.CSSProperties
              }
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Follow us on Instagram</span>
            </a>
          )}
          {site.socialMedia?.linkedin && (
            <a
              href={site.socialMedia.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              style={
                {
                  "--hover-color": site.theme.primaryColor,
                } as React.CSSProperties
              }
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">Follow us on LinkedIn</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
