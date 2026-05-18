import { Star, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Product } from '../types';

export function ProductCard({ product, key }: { product: Product, key?: string | number }) {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIdx((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [images.length]);

  return (
    <div className="bg-white border rounded shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col h-full border-gray-200">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] bg-jd-light flex items-center justify-center p-4">
        <img 
          src={images[currentImageIdx] || product.image} 
          alt={product.title} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-jd-green/90 text-white text-xs font-bold px-2 py-1 rounded">
          {product.category}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center space-x-1 mb-2 text-jd-dark">
          <Star className="w-4 h-4 fill-jd-yellow text-jd-yellow" />
          <span className="text-sm font-semibold">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-jd-dark mb-2 leading-tight uppercase tracking-tight hover:text-jd-green transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {product.shortDescription}
        </p>

        <div className="mt-auto">
          <p className="font-bold text-xl text-jd-dark mb-4">
            A partir de {product.price ? product.price.toLocaleString('pt-PT') : "POA"} €
          </p>
          <div className="flex space-x-2">
            <Link to={`/product/${product.id}`} className="flex-1 bg-jd-green text-center text-white py-2 px-4 rounded font-bold hover:bg-green-800 transition-colors">
              Ver mais info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
