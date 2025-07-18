import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AUTO_ADVANCE_INTERVAL = 3500;

const AttractImages: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const snap = await getDocs(collection(db, 'attractImages'));
      setImages(snap.docs.map(doc => doc.data().url));
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, AUTO_ADVANCE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images]);

  if (images.length === 0) return null;

  return (
    <section className="py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-gold-400 mb-2">Jewelry Inspiration</h2>
          <p className="text-lg text-gray-300 font-body">See what makes our clients shine. Discover elegance, style, and luxury.</p>
        </div>
        <div className="relative w-full h-80 md:h-96 flex items-center justify-center overflow-hidden rounded-2xl shadow-lg border-2 border-gold-500 bg-black">
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url + '?tr=w-800,q-90'}
              alt="Jewelry inspiration"
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ borderRadius: '1rem' }}
            />
          ))}
          {/* Overlay for gold gradient and text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-gold-500/10 pointer-events-none rounded-2xl" />
        </div>
        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 ${idx === current ? 'bg-gold-400 border-gold-400' : 'bg-black border-gold-500'} transition-all`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttractImages; 