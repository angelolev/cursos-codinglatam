import Link from "next/link";
import Image from "next/image";
import { Crown, Gift, ArrowUpRight } from "lucide-react";
import { ProductProps } from "@/types/product";

export function ClientProductCard({
  image,
  title,
  slug,
  isFree,
}: ProductProps) {
  return (
    <Link
      href={`guias/${slug}`}
      className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden ring-1 ring-black/5 shadow-md transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(238,192,72,0.35)] hover:ring-primary-300/40 w-full md:max-w-[290px]"
    >
      <div className="absolute top-3 right-3 z-20">
        <span className="flex items-center gap-1.5 bg-zinc-900/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ring-1 ring-white/20 shadow-lg">
          {isFree ? (
            <>
              <Gift className="h-3 w-3 text-emerald-300" />
              Gratis
            </>
          ) : (
            <>
              <Crown className="h-3 w-3 text-primary-300" />
              Premium
            </>
          )}
        </span>
      </div>

      <div className="absolute top-3 left-3 z-10 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-300 text-zinc-950 shadow-lg">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="h-48 w-full overflow-hidden relative">
        <Image
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          src={image}
          alt={title}
          width={420}
          height={193}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
