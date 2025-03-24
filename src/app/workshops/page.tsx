import Workshop from "@/components/WorkshopCard";
import { getWorkshops } from "@/utils/common";

export default async function Workshops() {
  const workshops = await getWorkshops();

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="text-center mt-12 mb-24">
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Workshops y training
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Talleres pensados no solo en habilidades técnicas sino también en
          habilidades blandas
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workshops?.map((workshop, index) => (
          <Workshop key={index} {...workshop} />
        ))}
      </div>
    </main>
  );
}
