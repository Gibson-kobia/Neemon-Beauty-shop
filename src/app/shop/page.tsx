export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="relative rounded-2xl p-12 md:p-16 border bg-white dark:bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] opacity-30" />
        <div className="relative text-center">
          <div className="font-serif text-2xl md:text-3xl">💄 Our full beauty collection is launching soon</div>
          <div className="mt-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300">
            We are carefully curating the best products for every skin tone and style.
          </div>
        </div>
      </div>
    </div>
  );
}
