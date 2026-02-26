import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
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

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "#" },
    { icon: Instagram, label: "Instagram", url: "#" },
    { icon: Mail, label: "Email", url: "#" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <MapPin size={20} className="text-secondary flex-shrink-0" />
                <span>Treviso, Italia</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone size={20} className="text-secondary flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  
                </span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail size={20} className="text-secondary flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  
                </span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-secondary/10 hover:bg-secondary 
                           flex items-center justify-center transition-all duration-300 
                           hover:scale-110 hover:shadow-gold group"
                  aria-label={social.label}
                >
                  <social.icon
                    size={20}
                    className="text-secondary group-hover:text-primary transition-colors"
                  />
                </a>
              ))}
            </div>
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
