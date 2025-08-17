import WorkshopsClient from "@/components/WorkshopsClient";
import { getWorkshops } from "@/utils/common";

export const dynamic = "force-static";

export default async function Workshops() {
  const workshops = await getWorkshops();

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Workshops y training
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Talleres pensados no solo en habilidades técnicas sino también en
          habilidades blandas
        </p>
      </div>
      <WorkshopsClient workshops={workshops || []} />
    </main>
  );
}
