import { Tractor } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-jd-dark text-white py-12 border-t-4 border-jd-green">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Tractor className="w-6 h-6 text-jd-yellow" />
          <span className="font-bold text-xl tracking-tight">JOHN DEERE</span>
        </div>
        <div className="text-sm text-gray-400 text-center md:text-right">
          <ul className="flex space-x-4 mb-2 justify-center md:justify-end">
             <li><a href="#" className="hover:text-white transition-colors">Privacidade e Dados</a></li>
             <li><a href="#" className="hover:text-white transition-colors">Termos de Utilização</a></li>
             <li><a href="#" className="hover:text-white transition-colors">Aviso Legal</a></li>
          </ul>
          &copy; {new Date().getFullYear()} Deere & Company. Todos os direitos reservados. Modelo Clonado.
        </div>
      </div>
    </footer>
  );
}
