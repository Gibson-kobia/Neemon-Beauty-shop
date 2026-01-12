import { products } from "../../lib/products";
import { ProductCard } from "../../components/product-card";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q?.toString() || "";
  const query = q.trim().toLowerCase();
  const list = products.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-serif text-3xl mb-2">Search</h1>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        {q ? `Results for “${q}”` : "Browse all products"}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

