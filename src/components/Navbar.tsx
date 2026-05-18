import { Tractor, Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-jd-dark text-white p-3 flex justify-between items-center text-sm shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-6 container mx-auto px-4">
        <Menu className="w-6 h-6 cursor-pointer hover:text-jd-yellow transition-colors" />
        <Link to="/" className="flex items-center space-x-2 text-jd-yellow font-bold text-xl cursor-pointer">
          <Tractor className="w-8 h-8" />
          <span>JOHN DEERE</span>
        </Link>
        <div className="hidden md:flex space-x-4 uppercase font-semibold tracking-wide">
          <a href="#" className="hover:text-jd-yellow border-b-2 border-transparent hover:border-jd-yellow pb-1 transition-all">Equipamento</a>
          <a href="#" className="hover:text-jd-yellow border-b-2 border-transparent hover:border-jd-yellow pb-1 transition-all">Peças e Serviço</a>
          <a href="#" className="hover:text-jd-yellow border-b-2 border-transparent hover:border-jd-yellow pb-1 transition-all">Financeiro</a>
        </div>
      </div>
      <div className="container mx-auto px-4 flex justify-end">
        <Search className="w-5 h-5 cursor-pointer hover:text-jd-yellow" />
      </div>
    </nav>
  );
}
