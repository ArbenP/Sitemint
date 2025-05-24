"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Ruler,
  Phone,
  Trophy,
  Clock,
  HandshakeIcon,
  Hammer,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SiteConfig } from "@/types/site";

const ease = [0.16, 1, 0.3, 1];

interface HeroProps {
  site: SiteConfig;
}

function HeroFeatures({ site }: HeroProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {[
        {
          icon: Trophy,
          title: "Quality",
          description: "Craftsmanship tradition",
        },
        {
          icon: Clock,
          title: "20+ years",
          description: "Experience",
        },
        {
          icon: HandshakeIcon,
          title: "Guarantee",
          description: "On all work",
        },
        {
          icon: Hammer,
          title: "Bespoke",
          description: "Tailored to your needs",
        },
      ].map((feature, index) => (
        <motion.div
          key={feature.title}
          className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5, ease }}
        >
          <feature.icon
            className="h-6 w-6 mb-2"
            style={{ color: site.theme.primaryColor }}
          />
          <h3 className="font-medium">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function HeroContent({ site }: HeroProps) {
  return (
    <div className="flex flex-col space-y-4 text-center lg:text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <Badge
          variant="outline"
          className="text-sm md:text-base font-medium"
          style={{
            borderColor: site.theme.primaryColor,
            color: site.theme.primaryColor,
          }}
        >
          Your local carpenter in {site.contact.city}
        </Badge>
      </motion.div>
      <motion.h1
        className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        Craftsmanship with{" "}
        <span className="relative" style={{ color: site.theme.primaryColor }}>
          precision
          <motion.svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 100 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease }}
          >
            <path
              d="M0 7 C30 4 70 4 100 7 L100 7 L0 7"
              stroke={site.theme.primaryColor}
              className="fill-none stroke-2"
            />
          </motion.svg>
        </span>
      </motion.h1>
      <motion.p
        className="max-w-[42rem] mx-auto lg:mx-0 text-xl text-muted-foreground pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease }}
      >
        From bespoke kitchen solutions to comprehensive renovations. We
        combine traditional craftsmanship with modern techniques to create
        lasting results.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease }}
      >
        <Link
          href="#contact"
          className={cn(
            buttonVariants({ size: "lg" }),
            "gap-2 w-full sm:w-auto justify-center text-base"
          )}
          style={{
            backgroundColor: site.theme.primaryColor,
            borderColor: site.theme.secondaryColor,
          }}
        >
          <Ruler className="h-4 w-4" />
          Get free consultation
        </Link>
        <Link
          href={`tel:${site.contact.phone}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "gap-2 w-full sm:w-auto justify-center text-base"
          )}
          style={{
            borderColor: site.theme.primaryColor,
            color: site.theme.primaryColor,
          }}
        >
          <Phone className="h-4 w-4" />
          Call us - {site.contact.phone}
        </Link>
      </motion.div>
      <HeroFeatures site={site} />
    </div>
  );
}

export function Hero({ site }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_85%)]" />
      <div className="container relative">
        <div className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row items-center py-8 px-4 md:px-8 lg:px-12 gap-12">
          <div className="flex flex-col gap-4 w-full lg:w-1/2">
            <HeroContent site={site} />
          </div>
          <div className="w-full lg:w-1/2">
            <motion.div
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease }}
            >
              <Image
                src="/about-image.jpg"
                alt="Professional carpentry work"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
