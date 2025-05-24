"use server";

import OpenAI from "openai";
import { SiteConfig } from "@/types/site";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function scrapeWebsite(url: string): Promise<string> {
  try {
    console.log("🌐 Starting website scraping for:", url);
    const response = await fetch(url);
    const html = await response.text();
    console.log("✅ Successfully scraped website HTML");
    return html;
  } catch (error) {
    console.error("❌ Error scraping website:", error);
    throw new Error("Failed to scrape website");
  }
}

// Define Zod schema matching SiteConfig interface
const SiteConfigSchema = z.object({
  subdomain: z.string(),
  name: z.string(),
  description: z.string(),
  owner: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().optional(),
  }),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
  }),
  contact: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    workingHours: z.string().optional(),
    areas: z.array(z.string()).optional(),
  }),
  services: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      price: z.string(),
    })
  ),
  socialMedia: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  hero: z
    .object({
      mainTitle: z.string().optional(),
      subtitle: z.string().optional(),
      highlights: z.array(z.string()).optional(),
      ctaPrimary: z.string().optional(),
      ctaSecondary: z.string().optional(),
    })
    .optional(),
});

export async function scrapeAndAnalyzeWebsite(
  url: string,
  workspaceId: string
): Promise<SiteConfig> {
  console.log("🔄 Starting website analysis process...");

  // Add a check for workspaceId
  if (!workspaceId) {
    console.error(
      "❌ Error: workspaceId is required for scrapeAndAnalyzeWebsite."
    );
    throw new Error(
      "workspaceId is required to analyze website and update prompt count."
    );
  }

  try {
    // 1. Scrape the website
    const html = await scrapeWebsite(url);
    console.log("📝 HTML content length:", html.length);

    // Create a subdomain from the URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // Remove www. and common domain extensions, then replace dots and dashes with hyphens
    const subdomain = hostname
      .replace(/^www\./, "")
      .replace(/\.(com|ie|co\.uk|org|net)$/, "")
      .replace(/\./g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .toLowerCase();

    console.log("🤖 Sending to OpenAI for analysis...");
    // 2. Use OpenAI with structured outputs to analyze the content
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `You are a website analyzer that extracts information to create a SiteConfig object. 
          Extract relevant information from the HTML and make reasonable assumptions for missing data based on the business type and location.
          IMPORTANT: All text content must be in English for Irish businesses.
          Use this subdomain: "${subdomain}"
          
          Guidelines for English content:
          - Use professional English business language
          - Use Euro currency format (€)
          - Use Irish/European date formats (DD/MM/YYYY)
          - Use Irish phone number format (+353)
          - Use Irish address formats
          - Default working hours should be "Mon-Fri: 9:00-17:30" if not specified
          - Make assumptions that align with Irish business practices`,
        },
        {
          role: "user",
          content: `Analyze this HTML and extract relevant information: ${html}`,
        },
      ],
      response_format: zodResponseFormat(SiteConfigSchema, "site_config"),
    });

    console.log("✨ Received response from OpenAI");

    // Handle potential refusal
    if (completion.choices[0].message.refusal) {
      console.error(
        "⛔ OpenAI refused to process:",
        completion.choices[0].message.refusal
      );
      throw new Error(completion.choices[0].message.refusal);
    }

    // Type assertion since we know the schema matches SiteConfig
    const siteConfig = completion.choices[0].message.parsed as SiteConfig;

    // Ensure we use our generated subdomain
    siteConfig.subdomain = subdomain;

    // Increment promptUsageCount for the workspace
    try {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { promptUsageCount: { increment: 1 } },
      });
      console.log(
        `✅ Incremented promptUsageCount for workspace: ${workspaceId}`
      );
    } catch (dbError) {
      console.error(
        `❌ Error updating promptUsageCount for workspace ${workspaceId}:`,
        dbError
      );
      // Decide if this error should prevent returning siteConfig
      // For now, we'll log it and continue
    }

    console.log("✅ Successfully created site configuration:", {
      name: siteConfig.name,
      subdomain: siteConfig.subdomain,
      servicesCount: siteConfig.services?.length || 0,
    });

    return siteConfig;
  } catch (error) {
    console.error("❌ Error analyzing website:", error);
    throw new Error("Failed to analyze website");
  }
}
