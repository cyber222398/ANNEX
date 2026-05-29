import { AnnexPortal } from "@/components/annex-portal";
import { getAnnexes, getAnnexStats } from "@/lib/annexes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const annexes = getAnnexes();
  const stats = getAnnexStats(annexes);

  return <AnnexPortal annexes={annexes} stats={stats} />;
}
