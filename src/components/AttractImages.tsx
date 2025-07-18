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
        {/* Remove the heading and subtitle */}
        <div className="relative w-full h-80 md:h-96 flex items-center justify-center overflow-hidden rounded-2xl shadow-lg border-2 border-gold-500 bg-black">
          {images.map((url, idx) => (
            <img
              key={idx}
              src={url + '?tr=w-1200,q-95'}
              alt="Jewelry inspiration"
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{ borderRadius: '1rem' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttractImages;