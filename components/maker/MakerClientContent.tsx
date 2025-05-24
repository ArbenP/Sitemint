"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Copy, Mail, Edit2, Check } from "lucide-react";
import { SiteConfig } from "@/types/site";
import { scrapeAndAnalyzeWebsite } from "@/app/actions/scraper/scraperActions";
import { saveSiteConfig } from "@/app/actions/database/siteConfigActions";
import { toast } from "sonner";
// We will pass workspaceId as a prop now, so getCurrentUserWorkspaceId is not directly needed here for the scrape action
// We will also pass initialPromptUsage as a prop

interface RecipientInfo {
  name: string;
  title?: string;
}

function generateEmailContent(
  site: SiteConfig,
  recipient: RecipientInfo
): string {
  return `Hello ${recipient.name}${recipient.title ? `, ${recipient.title}` : ""}!

I'm pleased to inform you that we have created a demo website for ${
    site.name
  }. We've drawn inspiration from your current website and added modern features and design.

Key features of the demo website:
• Responsive design that works perfectly on all devices
• Modern and professional appearance
• Search engine optimised (SEO)
• Fast loading times and good performance
• Integrated contact form
• Clear presentation of services
${site.socialMedia ? "• Integrated social media links" : ""}

You can view the demo website at the following link:
https://${site.subdomain}.sitemint.ie

I would love to hear your thoughts about the website. We can easily make adjustments based on your preferences and needs.

Please feel free to contact us if you have any questions or would like to discuss the possibilities further.

Kind regards,
Sitemint Team
Phone: +353 1 234 5678
Email: hello@sitemint.ie`;
}

interface MakerClientContentProps {
  initialPromptUsageCount: number;
  workspaceId: string;
}

export default function MakerClientContent({
  initialPromptUsageCount,
  workspaceId,
}: MakerClientContentProps) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // No longer need isCheckingUsage, as the parent server component handles this.
  const [promptUsageCount, setPromptUsageCount] = useState(
    initialPromptUsageCount
  );
  const [scrapedData, setScrapedData] = useState<SiteConfig | null>(null);
  const [editedData, setEditedData] = useState<SiteConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [recipient, setRecipient] = useState<RecipientInfo>({
    name: "",
    title: "",
  });

  // If the initial count passed from server changes (e.g. due to parent re-render), update it.
  // Though this specific scenario might be rare if page.tsx only fetches once.
  useEffect(() => {
    setPromptUsageCount(initialPromptUsageCount);
  }, [initialPromptUsageCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    // We check promptUsageCount before making the call
    if (promptUsageCount >= 3) {
      // Use >= 3 because we are about to make the 4th (or more) call
      toast.error("Usage limit reached. Please upgrade your plan.");
      // Optionally, we could call a function passed as prop to re-evaluate on server
      // or show the upgrade message directly. For now, simple toast.
      return;
    }

    setIsLoading(true);
    try {
      // workspaceId is now a prop
      if (!workspaceId) {
        toast.error(
          "Could not determine your workspace. Please ensure you are logged in and have a workspace."
        );
        setIsLoading(false);
        return;
      }

      const siteConfig = await scrapeAndAnalyzeWebsite(url, workspaceId);
      setScrapedData(siteConfig);
      setEditedData(siteConfig);
      setRecipient({
        name: siteConfig.owner?.name?.split(" ")[0] || "",
        title: "",
      });
      setEmailContent(generateEmailContent(siteConfig, recipient));
      // Increment usage count locally for immediate UI update, backend will be the source of truth
      setPromptUsageCount((prev) => prev + 1);
      toast.success("Website scraped successfully!");
    } catch (error) {
      toast.error("Failed to scrape website");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const siteId = await saveSiteConfig(editedData); // saveSiteConfig will use its own workspaceId logic
      setScrapedData(editedData);
      setEmailContent(generateEmailContent(editedData, recipient));
      toast.success("Site configuration saved successfully!");
      router.push(`/dashboard/projects/${siteId}`);
    } catch (error) {
      toast.error("Failed to save site configuration");
      console.error(error);
    }
  };

  const handleEdit = (field: string, value: string) => {
    if (!editedData) return;

    setEditedData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      const fields = field.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: Record<string, any> = updated;

      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;

      return updated;
    });
  };

  const handleRecipientChange = (field: keyof RecipientInfo, value: string) => {
    setRecipient((prev) => {
      const updated = { ...prev, [field]: value };
      if (editedData) {
        setEmailContent(generateEmailContent(editedData, updated));
      }
      return updated;
    });
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    toast.success("Email copied to clipboard!");
  };

  // The loading state for initial data fetch is handled by the parent server component
  // The upgrade message is also handled by the parent server component

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline">Website Scraper</Badge>
          <h1 className="text-3xl font-bold">
            Website to SiteConfig Converter
          </h1>
          <p className="text-muted-foreground">
            Enter a website URL to extract information and generate a
            SiteConfig. Usage: {promptUsageCount} / 3
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Website URL</CardTitle>
            <CardDescription>
              We&apos;ll analyze the website and extract relevant information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-1"
                  disabled={promptUsageCount >= 3} // Disable input if limit reached
                />
                <Button
                  type="submit"
                  disabled={isLoading || promptUsageCount >= 3}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    "Start Scraping"
                  )}
                </Button>
              </div>
              {promptUsageCount >= 3 && (
                <p className="text-sm text-destructive">
                  You have reached your usage limit. Please upgrade to continue.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {scrapedData && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Site Configuration</CardTitle>
                  <CardDescription>
                    Review and edit the site configuration
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Done Editing
                      </>
                    ) : (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Data
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Website
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isEditing && editedData ? (
                    <div className="grid gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">
                          Basic Information
                        </h3>
                        <div className="grid gap-4">
                          <div>
                            <label className="text-sm font-medium">Name</label>
                            <Input
                              value={editedData.name}
                              onChange={(e) =>
                                handleEdit("name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <Textarea
                              value={editedData.description}
                              onChange={(e) =>
                                handleEdit("description", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">
                          Contact Information
                        </h3>
                        <div className="grid gap-4">
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              value={editedData.contact?.email || ""}
                              onChange={(e) =>
                                handleEdit("contact.email", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                              value={editedData.contact?.phone || ""}
                              onChange={(e) =>
                                handleEdit("contact.phone", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Address
                            </label>
                            <Input
                              value={editedData.contact?.address || ""}
                              onChange={(e) =>
                                handleEdit("contact.address", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Theme Colors</h3>
                        <div className="grid gap-4">
                          <div>
                            <label className="text-sm font-medium">
                              Primary Color
                            </label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={editedData.theme?.primaryColor || ""}
                                onChange={(e) =>
                                  handleEdit(
                                    "theme.primaryColor",
                                    e.target.value
                                  )
                                }
                                className="w-20"
                              />
                              <Input
                                value={editedData.theme?.primaryColor || ""}
                                onChange={(e) =>
                                  handleEdit(
                                    "theme.primaryColor",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Secondary Color
                            </label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={editedData.theme?.secondaryColor || ""}
                                onChange={(e) =>
                                  handleEdit(
                                    "theme.secondaryColor",
                                    e.target.value
                                  )
                                }
                                className="w-20"
                              />
                              <Input
                                value={editedData.theme?.secondaryColor || ""}
                                onChange={(e) =>
                                  handleEdit(
                                    "theme.secondaryColor",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[500px]">
                        {JSON.stringify(editedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recipient Information</CardTitle>
                  <CardDescription>
                    Who will receive this email?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={recipient.name}
                        onChange={(e) =>
                          handleRecipientChange("name", e.target.value)
                        }
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Title (Optional)
                      </label>
                      <Input
                        value={recipient.title || ""}
                        onChange={(e) =>
                          handleRecipientChange("title", e.target.value)
                        }
                        placeholder="Managing Director"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Template
                    </CardTitle>
                    <CardDescription>
                      Generated email template for the provider
                    </CardDescription>
                  </div>
                  <Button onClick={copyEmailToClipboard} variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Email
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {emailContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
