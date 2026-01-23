"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProducts, type Product } from "../../lib/products";
import { ProductCard } from "../../components/product-card";

export default function PreviewShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PreviewShopInner />
    </Suspense>
  );
}

function PreviewShopInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = params.get("key");
    if (key !== "NEEMONPREVIEW") {
      router.replace("/launch");
      return;
    }
    (async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="font-serif text-2xl mb-6">Preview Shop</div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
