import Link from "next/link";
import Image from "next/image";
import { ProductProps } from "@/types/product";
import { getProductBySlug } from "@/utils/common";
import { AverageRating } from "../AverageRating";

export default async function Product({
  image,
  title,
  slug,
  description,
}: ProductProps) {
  const product = await getProductBySlug(slug);
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      <div className="h-48 w-full overflow-hidden relative">
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          fill
        />
      </div>
      <div className="p-6">
        <Link href={`guias/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        </Link>
        {product && <AverageRating reviewId={product.id} />}
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
    </div>
  );
}
