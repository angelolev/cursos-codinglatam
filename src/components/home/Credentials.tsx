// Cifras de respaldo. Viven junto a los logos de empresas —y no dentro del
// hero— para que la prueba social se lea como un solo bloque.
const stats = [
  { value: "+20", label: "Empresas" },
  { value: "+1,000", label: "Profesionales formados" },
  { value: "2016", label: "Construyendo software" },
];

export default function Credentials() {
  return (
    <dl className="mb-16 grid grid-cols-1 gap-y-8 border-y border-white/10 py-8 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-white/10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="sm:px-10 sm:first:pl-0 sm:last:pr-0"
        >
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            {stat.label}
          </dt>
          <dd className="mt-2 text-3xl font-bold tabular-nums text-accent sm:text-4xl">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
