import { UniverseMap } from '@/components/UniverseMap';
import { tutorials } from '#velite';

export const metadata = {
  title: 'Infinity Universe | victory.docs',
  description: 'Eksplorasi seluruh kurikulum keilmuan layaknya mengarungi alam semesta.',
};

export default function UniversePage() {
  // Hanya ambil data ringan (slug, title, permalink) agar client-side UniverseMap tidak berat
  const mapData = tutorials.map(t => ({
    title: t.title,
    slug: t.slug,
    permalink: t.permalink,
    description: t.description,
    icon: t.icon,
  }));

  return (
    <main className="w-full h-screen overflow-hidden dark bg-black">
      {/* Container ini "dipaksa" menggunakan tema gelap untuk feel luar angkasa */}
      <UniverseMap tutorials={mapData} />
    </main>
  );
}
