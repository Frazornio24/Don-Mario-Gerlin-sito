import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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
    { label: "Progetti", path: "/progetti" },
    { label: "Don Mario", path: "/don-mario" },
    { label: "Bambui", path: "/bambui" },
    { label: "Articoli", path: "/articoli" },
    { label: "Foto", path: "/foto" },
    { label: "Eventi", path: "/eventi" },
    { label: "Collaborazioni", path: "/collaborazioni" },
    { label: "Contatti", path: "/contatti" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "shadow-lg border-b border-secondary/30" : "border-b border-secondary/15"
      }`}
      style={{
        background: isScrolled
          ? "linear-gradient(90deg, rgba(10, 21, 36, 0.98) 0%, rgba(18, 40, 70, 0.98) 50%, rgba(10, 21, 36, 0.98) 100%)"
          : "linear-gradient(90deg, rgba(14, 30, 51, 0.95) 0%, rgba(26, 55, 92, 0.95) 50%, rgba(14, 30, 51, 0.95) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${isScrolled ? "h-20" : "h-24"} transition-all duration-500`}>
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-black text-secondary
                     hover:scale-105 hover:brightness-110 transition-all duration-300 z-50 font-display"
            style={{
              textShadow: "0 2px 8px rgba(201, 150, 50, 0.3)"
            }}
          >
            Don Mario Gerlin
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden xl:flex items-center space-x-6">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-1 py-2 text-sm xl:text-base font-semibold whitespace-nowrap transition-all duration-300 relative group
                    ${location.pathname === item.path
                      ? "text-secondary"
                      : "text-primary-foreground hover:text-secondary"
                    }`}
                  style={{
                    textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)"
                  }}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-300
                    ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-3 rounded-lg text-primary-foreground hover:bg-secondary/10 
                     transition-colors duration-300 z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Navigation - Polished Solid Blue Dropdown */}
        <div
          className={`xl:hidden absolute left-0 right-0 top-24 bg-primary transition-all duration-300 shadow-2xl overflow-hidden ${isMenuOpen
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
    </motion.header>
  );
};

export default Header;
