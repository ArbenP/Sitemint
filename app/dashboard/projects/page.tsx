import { SitesDataTable } from "@/components/sites-data-table";
import { prisma } from "@/lib/prisma";
import { EmptyStateProjects } from "@/components/empty-state-projects";

export default async function Page() {
  const sites = await prisma.site.findMany({
    include: {
      owner: true,
      contact: true,
      socialMedia: true,
    },
  });

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          {sites.length > 0 ? (
            <SitesDataTable sites={sites} />
          ) : (
            <EmptyStateProjects />
          )}
        </div>
      </div>
    </div>
  );
}
