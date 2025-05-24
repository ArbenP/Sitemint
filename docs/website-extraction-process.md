# Website Extraction Process - Sitemint

## Overview

This document explains how the Sitemint app extracts siteconfig information from inputted websites and transforms them into structured website configurations optimized for Irish businesses.

## Process Architecture

The website extraction process uses a sophisticated **two-step approach** combining web scraping with AI-powered analysis to create comprehensive site configurations.

### Key Components

- **Web Scraper**: Fetches raw HTML content from target websites
- **AI Analyzer**: Uses OpenAI GPT-4o to extract and structure business information
- **Data Validator**: Ensures output matches required schema using Zod validation
- **Localizer**: Adapts content for Irish business context

## Detailed Process Flow

### Step 1: Website Scraping

**Location**: `app/actions/scraper/scraperActions.ts` (Lines 12-23)

```typescript
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
```

**What it does**:
- Fetches raw HTML content using standard `fetch()` API
- Handles network errors gracefully
- Returns complete HTML source for analysis

### Step 2: Subdomain Generation

**Location**: `app/actions/scraper/scraperActions.ts` (Lines 85-90)

```typescript
const subdomain = hostname
  .replace(/^www\./, "")
  .replace(/\.(com|ie|co\.uk|org|net)$/, "")
  .replace(/\./g, "-")
  .replace(/[^a-zA-Z0-9-]/g, "-")
  .toLowerCase();
```

**Supported Domains**:
- `.ie` (Ireland)
- `.co.uk` (United Kingdom)
- `.com` (Commercial)
- `.org` (Organization)
- `.net` (Network)

**Example Transformations**:
- `www.example.ie` → `example`
- `business.co.uk` → `business`
- `my-company.com` → `my-company`

### Step 3: AI-Powered Analysis

**Location**: `app/actions/scraper/scraperActions.ts` (Lines 96-120)

The core intelligence uses OpenAI's GPT-4o model with structured outputs:

```typescript
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
```

#### Irish Business Localization Rules

| Aspect | Format | Example |
|--------|--------|---------|
| **Currency** | Euro (€) | €150, €50/hour |
| **Phone Numbers** | +353 format | +353 1 234 5678 |
| **Working Hours** | Mon-Fri format | Mon-Fri: 9:00-17:30 |
| **Date Format** | DD/MM/YYYY | 15/03/2024 |
| **Language** | Professional English | "Contact us for a quote" |

### Step 4: Data Structure Validation

**Location**: `app/actions/scraper/scraperActions.ts` (Lines 25-65)

The system uses Zod schemas to ensure structured, validated output:

```typescript
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
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  hero: z.object({
    mainTitle: z.string().optional(),
    subtitle: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    ctaPrimary: z.string().optional(),
    ctaSecondary: z.string().optional(),
  }).optional(),
});
```

#### Extracted Data Categories

1. **Business Information**
   - Company name and description
   - Owner details
   - Contact information

2. **Services & Pricing**
   - Service listings with descriptions
   - Pricing information in Euro format
   - Service areas

3. **Design Elements**
   - Primary and secondary color themes
   - Hero section content
   - Call-to-action buttons

4. **Social Media**
   - Facebook, Instagram, LinkedIn profiles
   - Automatically detected from website content

### Step 5: Demo Site Generation

**Location**: `components/maker/MakerClientContent.tsx` (Lines 29-56)

After extraction, the system generates:

#### Professional Demo URLs
- Format: `https://{subdomain}.sitemint.ie`
- Example: `https://johnsplumbing.sitemint.ie`

#### Outreach Email Templates

```typescript
function generateEmailContent(site: SiteConfig, recipient: RecipientInfo): string {
  return `Hello ${recipient.name}!

I'm pleased to inform you that we have created a demo website for ${site.name}. 
We've drawn inspiration from your current website and added modern features and design.

Key features of the demo website:
• Responsive design that works perfectly on all devices
• Modern and professional appearance
• Search engine optimised (SEO)
• Fast loading times and good performance
• Integrated contact form
• Clear presentation of services

You can view the demo website at: https://${site.subdomain}.sitemint.ie

Kind regards,
Sitemint Team
Phone: +353 1 234 5678
Email: hello@sitemint.ie`;
}
```

## Usage Tracking & Limits

### Workspace-Based Limits
- **Free Tier**: 3 website extractions per workspace
- **Usage Tracking**: Automatic increment in database
- **Upgrade Path**: Built-in prompts for plan upgrades

### Database Integration
**Location**: `app/actions/database/siteConfigActions.ts`

The extracted configurations are automatically saved to the database with:
- Full relational structure (themes, contacts, services, etc.)
- Workspace association
- Audit trails (created/updated timestamps)

## Error Handling

### Comprehensive Error Management

1. **Network Errors**: Graceful handling of failed website requests
2. **AI Refusals**: Detection and handling of OpenAI content policy violations
3. **Validation Errors**: Zod schema validation with detailed error messages
4. **Database Errors**: Proper error logging and user feedback

### Example Error Handling

```typescript
// Handle AI refusal
if (completion.choices[0].message.refusal) {
  console.error("⛔ OpenAI refused to process:", completion.choices[0].message.refusal);
  throw new Error(completion.choices[0].message.refusal);
}

// Handle scraping errors
try {
  const html = await scrapeWebsite(url);
} catch (error) {
  console.error("❌ Error scraping website:", error);
  throw new Error("Failed to scrape website");
}
```

## Technical Features

### Modern Architecture
- **Server Actions**: Secure server-side processing
- **TypeScript**: Full type safety throughout the pipeline
- **Structured Outputs**: OpenAI's latest structured response format
- **Real-time Updates**: Live UI updates during processing

### Performance Optimizations
- **Efficient Scraping**: Minimal resource usage
- **Caching Strategy**: Workspace-based usage tracking
- **Error Recovery**: Graceful degradation on failures

## Integration Points

### Frontend Integration
**Location**: `components/maker/MakerClientContent.tsx`

- Real-time progress indicators
- Editable results interface
- One-click email generation
- Direct save to dashboard

### Backend Integration
**Location**: `app/actions/database/siteConfigActions.ts`

- Automatic database persistence
- Workspace association
- Full CRUD operations
- Audit trail maintenance

## Conclusion

The Sitemint website extraction process represents a sophisticated pipeline that transforms any website into a structured, localized business configuration optimized for the Irish market. By combining modern web scraping, AI analysis, and robust data validation, it provides a comprehensive solution for creating professional business websites from existing online presence.

### Key Benefits

- **Automated Intelligence**: AI-powered content extraction and localization
- **Irish Market Focus**: Proper formatting for currency, phone numbers, and business practices
- **Professional Output**: Ready-to-use demo sites and outreach materials
- **Scalable Architecture**: Built for growth with usage tracking and upgrade paths
- **Error Resilience**: Comprehensive error handling and user feedback 