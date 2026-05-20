import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Footer Component
 * Footer con informazioni di contatto e link utili
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Chi Siamo", path: "/chi-siamo" },
    { label: "Don Mario", path: "/don-mario" },
    { label: "Contatti", path: "/contatti" },
  ];



  return (
    <footer className="bg-[#111D33] border-t border-secondary/30 text-white/90 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-black text-secondary mb-4">
              Don Mario Gerlin
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Preserviamo l'eredità di Don Mario Gerlin, missionario trevigiano
              dedicato ai lebbrosi del Brasile.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Link Utili</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-secondary 
                             transition-colors duration-300 inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Contatti</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail size={20} className="text-secondary flex-shrink-0" />
                <a href="mailto:donmariogerlin@gmail.com" className="hover:text-secondary transition-colors">
                  donmariogerlin@gmail.com
                </a>
              </li>
            </ul>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>
            © {currentYear} Associazione Don Mario Gerlin. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
