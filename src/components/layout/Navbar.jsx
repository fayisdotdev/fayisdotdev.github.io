import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "../../constants/navigation";

const Navbar = ({ active, onScrollTo, isOpen, setIsOpen }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            onClick={() => onScrollTo("home")}
          >
            Fayisdotdev
          </button>

          <div className="hidden md:flex gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => onScrollTo(item.toLowerCase())}
                className={`transition-all duration-300 ${
                  active === item.toLowerCase()
                    ? "text-cyan-400 font-semibold"
                    : "text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pt-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => onScrollTo(item.toLowerCase())}
                className="text-left text-slate-300"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
