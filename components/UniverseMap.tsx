"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Globe, Brain, Code, Terminal, FlaskConical, Atom } from 'lucide-react';

// Ikatan ikon default atau acak
const getIcon = (name: string) => {
  if (name.includes('Book')) return <BookOpen className="w-5 h-5" />;
  if (name.includes('Globe')) return <Globe className="w-5 h-5" />;
  if (name.includes('Brain')) return <Brain className="w-5 h-5" />;
  if (name.includes('Code')) return <Code className="w-5 h-5" />;
  if (name.includes('Terminal')) return <Terminal className="w-5 h-5" />;
  if (name.includes('Flask')) return <FlaskConical className="w-5 h-5" />;
  if (name.includes('Atom')) return <Atom className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />; // Fallback
};

// Fungsi helper untuk menghasilkan posisi spiral Fermat (mengerucut)
const generateSolarSystems = (categories: string[]) => {
  const systems: Record<string, { x: number; y: number; color: string; size: number; scale: number; zIndex: number }> = {};
  
  const colors = [
    'rgba(56,189,248,1)', // cyan
    'rgba(167,139,250,1)', // purple
    'rgba(251,113,133,1)', // rose
    'rgba(52,211,153,1)', // emerald
    'rgba(251,191,36,1)', // amber
  ];

  categories.forEach((cat, i) => {
    systems[cat] = {
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      size: 5000, 
      scale: Math.pow(0.70, i), // Skala yang aman agar seluruh level dirender CSS tanpa error hilang
      zIndex: 100 - i, 
    };
  });
  return systems;
};

// Helper untuk format nama human-readable
const formatName = (slugPart: string) => {
  return slugPart
    .replace(/^\d+-/, '') // Hilangkan angka urutan prefix
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

interface Tutorial {
  title: string;
  slug: string;
  permalink: string;
  icon?: string;
  description?: string;
}

export function UniverseMap({ tutorials }: { tutorials: Tutorial[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Nilai posisi murni. Kita hapus smooth spring pada x dan y agar drag dari framer-motion 
  // sangat responsif dan tidak saling berebut (lagging) dengan spring saat panning ringan.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Scale tetap pakai spring agar transisi zoom via trackpad mulus dan elegan
  // Scale disetel lebih kencang agar scroll tidak lelet, merespon sentuhan mouse lebih cepat
  const scale = useMotionValue(0.04); 
  const smoothScale = useSpring(scale, { damping: 25, stiffness: 400, restDelta: 0.001 });

  const [currentScale, setCurrentScale] = useState(0.04);
  useEffect(() => {
    return scale.on("change", (latest) => setCurrentScale(latest));
  }, [scale]);

  // Handler interaksi wheel lokal: Panning bebas 360 derajat & Trackpad Pinch Zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Deteksi pinch-to-zoom di trackpad (sering ctrlKey terpicu) atau CTRL+scroll biasa
      if (e.ctrlKey || e.metaKey || e.deltaY % 1 !== 0) {
        // Logika ZOOM menembus kedalaman kencang (Multiplier ditingkatkan jauh lebih besar agar tidak lelet)
        const zoomFactor = -e.deltaY * 0.04;
        // Limit zoom luar batas ekstrim telah dicabut (maksimal 100 juta) agar bisa menembus lubang cacing sedalam-dalamnya
        const newScale = Math.min(Math.max(scale.get() * Math.exp(zoomFactor), 0.005), 100000000); 
        scale.set(newScale);
      } else {
        // Panning bebas (atas, bawah, kiri, kanan) menggunakan scroll/swipe trackpad dua jari
        // dibagi currentScale agar kecepatan gulir konsisten dengan tingkat zoom saat ini.
        x.set(x.get() - (e.deltaX / scale.get()));
        y.set(y.get() - (e.deltaY / scale.get()));
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [x, y, scale]);

  const universeData = useMemo(() => {
    const categories: Record<string, Tutorial[]> = {};
    
    tutorials.forEach(t => {
      const parts = t.slug.split('/');
      const cat = parts[0];
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(t);
    });

    const catKeys = Object.keys(categories);
    const solarSystems = generateSolarSystems(catKeys);

    return { categories, solarSystems };
  }, [tutorials]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100dvh] bg-black overflow-hidden select-none font-sans cursor-grab active:cursor-grabbing"
    >
      {/* Background Parallax Mata Tuhan (Helix Nebula) - Harus DI BAWAH Deep Space agar Deep Space menabrak/ming-blend dengan nebula dan memberi tekstur bintang/debu */}
      <motion.div 
         className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
         style={{
           scale: useTransform(smoothScale, [0.001, 1, 100000], [0.2, 1, 4]),
           opacity: useTransform(smoothScale, [0.001, 0.04, 1], [0.1, 0.7, 1]),
           zIndex: 0
         }}
      >
         {/* Lapisan 1: Pendaran Luar Merah Gelap */}
         <div 
           className="absolute rounded-full animate-pulse"
           style={{
             width: '130vmax', height: '130vmax',
             animationDuration: '8s',
             background: 'radial-gradient(circle, transparent 35%, rgba(100, 10, 30, 0.7) 50%, rgba(20, 5, 15, 0.5) 75%, transparent 85%)'
           }}
         ></div>

         {/* Lapisan 2: Iris Emas - Rotating */}
         <div 
           className="absolute rounded-full flex items-center justify-center opacity-90"
           style={{
             width: '90vmax', height: '90vmax',
             background: 'radial-gradient(circle, transparent 20%, rgba(255, 130, 50, 0.8) 40%, rgba(150, 30, 70, 0.6) 65%, transparent 80%)',
             animation: 'spin 180s linear infinite' 
           }}
         >
            {/* Tekstur Gas dan Debu Nebula menggunakan Conic Gradient - DIHIDUPKAN KEMBALI agar kaya visual */}
            <div 
               className="w-full h-full rounded-full mix-blend-screen opacity-60" 
               style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.4) 45deg, transparent 90deg, rgba(255,200,100,0.5) 160deg, transparent 220deg, rgba(255,100,100,0.4) 300deg, transparent 360deg)' }}
            ></div>
         </div>

         {/* Lapisan 3: Inti Vacuum Biru & Cyan Hampa */}
         <div 
           className="absolute rounded-full animate-pulse"
           style={{
             width: '55vmax', height: '55vmax',
             animationDuration: '5s',
             background: 'radial-gradient(circle, rgba(15, 20, 50, 1) 0%, rgba(30, 70, 160, 0.8) 35%, rgba(40, 150, 255, 0.4) 65%, transparent 90%)'
           }}
         ></div>

         {/* Lapisan 4: Bintang Kerdil Putih */}
         <div className="absolute flex items-center justify-center">
           <div 
             className="absolute rounded-full"
             style={{
               width: '8vmax', height: '8vmax',
               background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(200,100,200,0.5) 20%, transparent 60%)',
             }}
           ></div>
           <div className="w-[1dvw] h-[1dvw] min-w-[15px] min-h-[15px] rounded-full bg-white opacity-100"></div>
         </div>
      </motion.div>

      {/* Background Deep Space (Ditaruh DI ATAS Nebula agar bintik-bintik bintangnya menutupi Warna Nebula secara natural) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
           backgroundImage: 'radial-gradient(1.5px 1.5px at 10% 20%, white, transparent), radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.8), transparent), radial-gradient(2px 2px at 80% 30%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 60% 10%, white, transparent)',
           backgroundSize: '250px 250px, 350px 350px, 450px 450px, 150px 150px',
           x: useSpring(useMotionValue(0), { damping: 50 }),
        }}
      />
      {/* Panel Info & Kontrol */}
      <div className="absolute top-6 left-6 z-50 text-white pointer-events-none drop-shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Infinity Universe</h1>
        <p className="text-sm shadow-black opacity-80">Gunakan <kbd className="bg-white/20 px-1.5 py-0.5 rounded border border-white/30 text-white font-mono text-xs">Scroll / Pinch / Drag</kbd> untuk jelajah 360°.</p>
        <p className="text-xs mt-1 text-blue-300 font-mono">Skala Kamera: {(currentScale * 100).toFixed(1)}%</p>
        <Link href="/" className="pointer-events-auto mt-5 inline-flex items-center text-sm font-semibold text-white/90 hover:text-blue-400 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all">
          ← Menuju Beranda Bumi
        </Link>
      </div>

      {/* Kanvas Utama Tata Surya - Diserahkan sepenuhnya handling DRAG ke Framer Motion */}
      <motion.div
        drag
        dragMomentum={true} // Meluncur halus setelah dilepas
        className="absolute top-1/2 left-1/2 origin-center"
        style={{
          x: x, 
          y: y,
          scale: smoothScale,
          // willChange: 'transform' DICABUT karena memaksa Chrome menggunakan bitmap caching. Mencabut ini mengembalikan render vektor ketajaman sempurna 100% pada zoom sejuta kali!
        }}
      >

        {Object.entries(universeData.categories).map(([catSlug, tuts], catIndex) => {
          const sys = universeData.solarSystems[catSlug];
          if (!sys) return null;

          // Rentang luas area disetel sangat lebar untuk menampung sebaran planet-planet yang luas
          const maxOrbitRadius = (sys.size / 2) + 4000 + (tuts.length * 400);

          return (
            <div 
              key={catSlug} 
              className="absolute pointer-events-none"
              style={{ top: 0, left: 0, transform: `scale(${sys.scale})`, zIndex: sys.zIndex }}
            >
              {/* Garis Batas Terluar Sistem Tata Surya */}
              <div 
                className="absolute origin-center -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white/5 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none"
                style={{
                  width: Math.round(maxOrbitRadius * 2),
                  height: Math.round(maxOrbitRadius * 2),
                }}
              />

              {/* Event Horizon (Cincin Lubang Cacing yang di tengahnya berlubang transparant untuk level bawahnya) */}
               <div className="absolute origin-center -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                  <div 
                    style={{ 
                      width: Math.round(sys.size), 
                      height: Math.round(sys.size), 
                      // Mengganti boxShadow blur ekstrem dengan radial-gradient sederhana yang ramah GPU
                      background: `radial-gradient(circle, transparent 65%, ${sys.color.replace(/1\)$/, '0.2)')} 100%)`
                    }}
                    className={`rounded-full border-[2px] border-white/20 flex items-center justify-center pointer-events-none relative ring-[10px] ring-[${sys.color}]/10`} 
                  >
                     <div 
                       className="absolute inset-[6%] rounded-full border border-white/10 opacity-40 pointer-events-none" 
                     ></div>
                  </div>
               </div>
               
               {/* Kategori Teks ditaruh mutlak di pinggir atas cincin */}
               <div 
                 className="absolute origin-center -translate-x-1/2 pointer-events-none flex flex-col items-center"
                 style={{ top: Math.round(-(sys.size / 2) - 300) }} 
               >
                   <span 
                      className="text-white font-black text-center leading-none tracking-widest uppercase"
                      style={{ fontSize: '150px', textShadow: `0 0 50px ${sys.color}`, width: '2500px' }}
                   >
                     {formatName(catSlug)}
                   </span>
                   <span 
                     className="text-white/80 text-center mt-6 font-mono font-bold tracking-widest uppercase" 
                     style={{ fontSize: '45px', textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}
                   >
                     Lvl {catIndex + 1} // {tuts.length} Materi
                   </span>
               </div>

              {/* Materi (Planet-Planet) berserakan secara organik membentuk Galaksi Spiral (Bima Sakti) */}
              {tuts.map((tut, j) => {
                // Logika Lengan Galaksi Spiral (5 Lengan Utama berputar keluar)
                const armCount = 5; 
                const armIndex = j % armCount;
                const spiralProgress = Math.floor(j / armCount) * 0.6; // Kelengkungan spiral
                
                // Sudut melengkung ke luar
                const thetaBase = spiralProgress + (armIndex * (Math.PI * 2 / armCount));
                const theta = thetaBase + (Math.sin(j * 4321) * 0.3); // Noise lentur
                
                // Radius makin membesar menjauhi inti sesuai golden ratio spiral
                const baseRadius = (sys.size / 2) + 2000;
                const spreadRadius = (spiralProgress * 1500) + Math.abs(Math.cos(j * 123) * 800);
                const planetRadius = baseRadius + spreadRadius; 

                // Kalkulasi Kartesian X Y
                const angle = theta + (catIndex * 1.5); 
                const px = Math.cos(angle) * planetRadius;
                const py = Math.sin(angle) * planetRadius;
                
                // Merombak gradient agar memberikan fiksasi efek shadow 3D otomatis tanpa butuh properti boxShadow CSS (super ringan!)
                const planetGradients = [
                  'radial-gradient(circle at 30% 30%, #a8c0ff 0%, #3f2b96 70%, #050510 100%)', // Ice/Water Planet
                  'radial-gradient(circle at 30% 30%, #ff9966 0%, #ff5e62 70%, #150505 100%)', // Desert/Mars Planet
                  'radial-gradient(circle at 30% 30%, #56ab2f 0%, #1f4037 70%, #051005 100%)', // Forest/Terra Planet
                  'radial-gradient(circle at 30% 30%, #8E2DE2 0%, #4A00E0 70%, #050015 100%)', // Mystic Void Planet
                  'radial-gradient(circle at 30% 30%, #f7ff00 0%, #db36a4 70%, #100010 100%)', // Exotic Pink/Yellow 
                  'radial-gradient(circle at 30% 30%, #00c6ff 0%, #0072ff 70%, #000510 100%)', // Gas Giant Neptune
                  'radial-gradient(circle at 30% 30%, #FDC830 0%, #F37335 70%, #150500 100%)', // Volcanic Star
                ];
                const pGradient = planetGradients[j % planetGradients.length];
                const pSize = 120 + (tut.title.length % 60); // Ukuran planet diperbesar sedikit agar memanjakan mata

                return (
                  <div
                    key={tut.slug}
                    className="absolute pointer-events-auto group cursor-pointer"
                    style={{
                      left: Math.round(px),
                      top: Math.round(py),
                      transform: 'translate(-50%, -50%)' // memposisikan titik tengah presisi
                    }}
                  >
                    <Link href={tut.permalink} className="relative flex flex-col items-center justify-center">
                      
                      {/* Aura Kosmik / Debu Bintang Galaksi di sekitar Planet (Memperkaya visual space) */}
                      <div 
                        className="absolute rounded-full pointer-events-none opacity-50"
                        style={{
                          width: Math.round(pSize * 4), height: Math.round(pSize * 4),
                          background: `radial-gradient(circle, ${j % 2 === 0 ? 'rgba(50, 150, 255, 0.4)' : 'rgba(255, 100, 150, 0.4)'} 0%, transparent 60%)`,
                        }}
                      />

                      {/* Orbit luar tipis dari planet (hanya saat disentuh) */}
                      <div 
                        className="absolute rounded-full border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:animate-spin"
                        style={{ width: Math.round(pSize * 1.8), height: Math.round(pSize * 1.8), animationDuration: '4s' }}
                      />

                      {/* Objek Planet 3D Fotorealistik murni tanpa efek CSS Berat (No box-shadow, no filter) */}
                      <div 
                        style={{ 
                          width: Math.round(pSize), 
                          height: Math.round(pSize), 
                          background: pGradient,
                        }}
                        className={`rounded-full relative border border-white/10 group-hover:scale-[1.15] transition-transform duration-300 flex items-center justify-center`}
                      >
                         {/* Tambahan kosmik elegan: Cincin ala Saturnus secara acak untuk sebagian planet */}
                         {j % 4 === 0 && (
                           <div 
                             className="absolute rounded-full border-[8px] border-white/20 border-t-white/30 border-b-white/5 pointer-events-none"
                             style={{ 
                               width: '180%', height: '180%', 
                               transform: `rotate(${j * 25}deg) scaleY(0.3) scaleX(1.1)` 
                             }}
                           />
                         )}
                         {j % 5 === 0 && (
                           <div 
                             className="absolute w-[180%] h-[20%] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                             style={{ transform: `rotate(${-j * 15}deg)` }}
                           />
                         )}

                         <div className="text-white z-10 opacity-90 group-hover:scale-125 transition-transform" style={{ transform: 'scale(1.5)' }}>
                           {getIcon(tut.icon || 'Book')}
                         </div>
                      </div>

                      {/* Kotak Hover Penjelasan Artikel (lebih dinamis dan ukurannya logis) */}
                      <div 
                        className="absolute bottom-full mb-6 bg-black/90 backdrop-blur-md border border-white/20 p-6 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-3xl"
                        style={{ 
                          width: '350px', 
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <h3 className="text-white font-extrabold mb-3 text-2xl leading-tight">{tut.title}</h3>
                        {tut.description && (
                          <p className="text-white/80 text-sm leading-relaxed mb-4">{tut.description}</p>
                        )}
                        <span className="inline-flex text-blue-400 font-mono font-bold uppercase tracking-wider items-center gap-2 text-xs">
                          Menuju Permukaan Planet →
                        </span>
                      </div>
                      
                      {/* Teks Judul Planet: Kecil, Rapi, dan Proporsional (Sangat ringan di GPU) */}
                      <div 
                        className="mt-4 text-white/90 font-semibold text-center pointer-events-none"
                        style={{ 
                          maxWidth: `${Math.round(pSize * 1.5)}px`,
                          fontSize: '24px', 
                          lineHeight: '1.2',
                          textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                        }}
                      >
                        {tut.title}
                      </div>

                    </Link>
                  </div>
                );
              })}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
