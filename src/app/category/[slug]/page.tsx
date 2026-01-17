import { notFound } from "next/navigation";
 

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
  
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-serif text-3xl mb-4">{title}</h1>
      <div className="relative rounded-2xl p-10 md:p-16 border bg-white dark:bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] opacity-30" />
        <div className="relative text-center">
          <div className="font-serif text-2xl">💄 Our full beauty collection is launching soon</div>
          <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            We are carefully curating the best products for every skin tone and style.
          </div>
        </div>
      </div>
    </div>
  );
}
