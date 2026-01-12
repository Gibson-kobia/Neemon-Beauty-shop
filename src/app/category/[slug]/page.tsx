import { notFound } from "next/navigation";
import { products } from "../../../lib/products";
import { ProductCard } from "../../../components/product-card";

const labels: Record<string, string> = {
  makeup: "Makeup",
  skincare: "Skincare",
  hair: "Hair Products",
  perfumes: "Perfumes",
  tools: "Beauty Tools",
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const title = labels[params.slug];
  if (!title) return notFound();
  const list = products.filter((p) => p.category === params.slug);
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-serif text-3xl mb-4">{title}</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
