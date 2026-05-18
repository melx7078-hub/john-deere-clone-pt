import { useEffect, useState } from 'react';
import { ProductCard } from './components/ProductCard';
import { exportToShopifyCSV, exportToGoogleMerchantCSV } from './lib/exportUtils';
import { Download, Tractor } from 'lucide-react';
import { Product } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      });
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
        {/* Admin/Export Bar */}
        <div className="bg-gray-100 p-4 border border-gray-200 rounded-lg mb-12 flex flex-col sm:flex-row justify-between items-center shadow-inner">
          <div>
            <h2 className="font-bold text-lg mb-1">Painel Gestão de Produtos</h2>
            <p className="text-sm text-gray-600">Total de produtos no catálogo: <span className="font-bold text-jd-green text-xl ml-1">{products.length}</span></p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button 
              onClick={() => exportToShopifyCSV(products)}
              className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Shopify CSV</span>
            </button>
            <button 
              onClick={() => exportToGoogleMerchantCSV(products)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Merchant Center CSV</span>
            </button>
          </div>
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
