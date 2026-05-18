import { useEffect, useState } from 'react';
import { ProductCard } from './components/ProductCard';
import { Product } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { supabase } from './lib/supabase';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        const mapped = data.map((p: any) => ({
             id: p.id,
             title: p.title,
             category: p.category,
             price: p.price,
             image: p.image,
             href: p.href,
             sku: p.sku,
             rating: p.rating,
             reviews: p.reviews,
             availability: p.availability,
             longDescription: p.long_description,
             shortDescription: p.short_description,
             features: p.features,
             images: p.images
        }));
        setProducts(mapped);
        setFilteredProducts(mapped);
      }
      setLoading(false);
    };
    
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category))) as string[]];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-jd-dark flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-jd-green text-white py-20 px-4 mt-1 border-b-8 border-jd-yellow overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.deere.com/assets/images/region-4/products/mowers/riding-mowers/100-series/x107/x107_riding_mower_studio_642x462.png')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "luminosity" }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <p className="uppercase tracking-widest text-jd-yellow font-bold text-sm mb-2">Produtos e Soluções</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl leading-tight">Gama Completa de Equipamentos</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
            Descubra os nossos tratores, cortadores de relva e veículos multiúsos. Desempenho lendário, perfeitamente adaptado às suas necessidades.
          </p>
          <button className="bg-jd-yellow text-jd-dark font-bold px-8 py-3 rounded uppercase tracking-wide hover:bg-yellow-400 transition-colors shadow-lg">
            Encontrar um Concessionário
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8 md:py-16 flex-grow">
        <div className="mb-4 text-right">
            <p className="text-sm text-gray-600">Total de produtos no catálogo: <span className="font-bold text-jd-green text-xl ml-1">{products.length}</span></p>
        </div>

        {/* Filters */}
        <div className="mb-10 border-b border-gray-200 pb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-jd-green text-white shadow-md'
                    : 'bg-gray-200 text-jd-dark hover:bg-gray-300'
                }`}
              >
                {cat === 'All' ? 'Todos os Equipamentos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-jd-green border-t-jd-yellow rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
