import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: any) => p.id === id);
        setProduct(found);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-jd-green border-t-jd-yellow rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-jd-dark">Produto não encontrado</h1>
        <Link to="/" className="text-jd-green hover:underline">Voltar à página inicial</Link>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0) ? product.images : [product.image];

  return (
    <div className="bg-white min-h-screen font-sans text-jd-dark flex flex-col">
      <Navbar />

      {/* Top bar */}
      <div className="bg-jd-light py-3 px-4 border-b border-gray-200">
         <div className="container mx-auto max-w-7xl">
             <Link to="/" className="flex items-center text-jd-green font-bold hover:underline">
               <ChevronLeft className="w-4 h-4 mr-1" />
               Voltar aos Equipamentos
             </Link>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 aspect-square rounded-lg flex items-center justify-center p-4 mb-4 border border-gray-200 relative overflow-hidden group">
              <img 
                src={images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 bg-gray-50 rounded border-2 transition-colors ${
                    activeImage === idx ? 'border-jd-green' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover mix-blend-multiply rounded" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col pt-4">
            <h4 className="text-sm font-bold tracking-widest text-jd-green uppercase mb-2">
              {product.category}
            </h4>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight text-jd-dark">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex text-jd-yellow">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className={`w-5 h-5 ${product.rating > 4.5 ? 'fill-current' : ''}`} />
              </div>
              <span className="font-bold text-sm">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.reviews} avaliações)</span>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {product.longDescription}
            </p>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-500 mb-1 uppercase font-bold tracking-wide">Preço Base (Sem opções)</p>
              <p className="text-4xl font-bold text-jd-dark">
                {product.price ? `${product.price.toLocaleString('pt-PT')} €` : "Preço sob consulta"}
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Para detalhes específicos de opções de financiamento e descontos, <span className="underline">contacte o seu concessionário local</span>.
              </p>
            </div>

            <button className="bg-jd-yellow text-jd-dark font-bold text-lg py-4 px-8 rounded uppercase tracking-wide hover:bg-yellow-400 transition-colors shadow shadow-yellow-500/20 w-fit">
              Encontrar Concessionário
            </button>
          </div>
        </div>

        {/* Features / Details */}
        {product.features && product.features.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 md:mb-12 border-l-4 border-jd-green pl-4">Detalhes e Inovações do Modelo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {product.features.map((feat: any, idx: number) => (
                <div key={idx} className="flex flex-col group">
                  {feat.image && (
                    <div className="aspect-video bg-gray-100 mb-6 overflow-hidden rounded relative">
                       <img src={feat.image} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-3 text-jd-dark border-b border-gray-200 pb-2">{feat.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
