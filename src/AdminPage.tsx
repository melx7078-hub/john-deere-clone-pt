import { useEffect, useState } from 'react';
import { exportToShopifyCSV, exportToGoogleMerchantCSV } from './lib/exportUtils';
import { Download, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Product } from './types';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error(error);
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
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-jd-dark p-4 md:p-8">
      <Link to="/" className="flex items-center text-jd-green font-bold hover:underline mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Voltar à página inicial
      </Link>

      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Painel de Administração / Exportação</h1>
        <p className="text-gray-600 mb-8">Total de produtos disponíveis para exportação: <span className="font-bold text-jd-green">{products.length}</span></p>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-jd-green border-t-jd-yellow rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => exportToShopifyCSV(products)}
              className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-4 rounded hover:bg-gray-800 transition-colors font-bold text-lg flex-1 shadow"
            >
              <Download className="w-5 h-5" />
              <span>Exportar Shopify CSV</span>
            </button>
            <button 
              onClick={() => exportToGoogleMerchantCSV(products)}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded hover:bg-blue-700 transition-colors font-bold text-lg flex-1 shadow"
            >
              <Download className="w-5 h-5" />
              <span>Exportar Merchant Center CSV</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
