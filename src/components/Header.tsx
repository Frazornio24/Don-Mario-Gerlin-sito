import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/**
 * Header Component
 * Navigazione principale con menu responsive e scroll detection
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Gestione scroll per effetto backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu items
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Chi Siamo", path: "/chi-siamo" },
    { label: "Don Mario", path: "/don-mario" },
    { label: "Bambui", path: "/bambui" },
    { label: "Articoli", path: "/articoli" },
    { label: "Foto", path: "/foto" },
    { label: "Contatti", path: "/contatti" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? "bg-primary/95 backdrop-blur-xl shadow-lg border-b border-secondary/20"
        : "bg-primary/85 backdrop-blur-md border-b border-secondary/10"
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl md:text-4xl font-black text-secondary
                     hover:scale-105 hover:brightness-110 transition-all duration-300 z-50"
            style={{
              textShadow: "0 2px 8px rgba(201, 150, 50, 0.3)"
            }}
          >
            Don Mario Gerlin
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-6 py-3 rounded-xl text-lg font-bold transition-all duration-300
                    ${location.pathname === item.path
                      ? "bg-secondary/15 text-secondary"
                      : "text-primary-foreground hover:bg-secondary/10 hover:text-secondary"
                    }
                    hover:-translate-y-0.5`}
                  style={{
                    textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)"
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-lg text-primary-foreground hover:bg-secondary/10 
                     transition-colors duration-300 z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Navigation - Polished Solid Blue Dropdown */}
        <div
          className={`lg:hidden absolute left-0 right-0 top-24 bg-primary transition-all duration-300 shadow-2xl overflow-hidden ${isMenuOpen
            ? "max-h-[80vh] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
            }`}
        >
          <ul className="flex flex-col py-6 px-6 space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={item.path}
                className="w-full"
                style={{
                  transitionDelay: isMenuOpen ? `${index * 40}ms` : "0ms",
                  transform: isMenuOpen ? "translateX(0)" : "translateX(-10px)",
                  opacity: isMenuOpen ? 1 : 0,
                  transition: "all 0.3s ease-out"
                }}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-6 py-4 rounded-xl text-xl font-bold transition-all duration-300
                    ${location.pathname === item.path
                      ? "bg-secondary text-primary shadow-md"
                      : "text-primary-foreground hover:bg-secondary/10 hover:text-secondary"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
