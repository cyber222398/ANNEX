import { AnnexPortal } from "@/components/annex-portal";
import { getAnnexes, getAnnexStats, getReportFile } from "@/lib/annexes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const annexes = getAnnexes();
  const stats = getAnnexStats(annexes);
  const report = getReportFile();

  return <AnnexPortal annexes={annexes} stats={stats} report={report} />;
}
