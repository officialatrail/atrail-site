import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Library: [
      { name: 'Articles', href: '/articles' },
      { name: 'Videos', href: '/videos' },
      { name: 'Tools', href: '/tools' },
      { name: 'Prompts', href: '/prompts' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: 'mailto:hello@officialatrail.online' },
    ],
  };

  const socialLinks = [
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@OfficialAtrail', hoverClass: 'hover:bg-[#FF0000]' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/atrail/', hoverClass: 'hover:bg-[#0A66C2]' },
    { name: 'Buy Me a Coffee', img: 'https://cdn.simpleicons.org/buymeacoffee/ffffff', href: 'https://buymeacoffee.com/officialatrail/extras', hoverClass: 'hover:bg-[#FFDD00]' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@officialatrail.online', hoverClass: 'hover:bg-brand-600' },
  ];

  return (
    <footer className="bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <img src={`${import.meta.env.BASE_URL}images/logo-white.png`} alt="Atrail" className="w-8 h-8 object-contain" />
                <h2 className="font-rubik text-3xl font-bold text-white">Atrail</h2>
              </div>
              <p className="font-rubik text-zinc-400 mb-6 leading-relaxed max-w-sm">
                A community hub for finance and accounting workflow automation, built around n8n, Claude, and Excel.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center transition-all duration-200 ${social.hoverClass}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    {social.icon ? (
                      <social.icon className="w-5 h-5" />
                    ) : (
                      <img src={social.img} alt={social.name} className="w-5 h-5" />
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-white mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith('/') ? (
                        <Link to={link.href} className="text-zinc-400 hover:text-white transition-colors duration-200">
                          {link.name}
                        </Link>
                      ) : (
                        <a href={link.href} className="text-zinc-400 hover:text-white transition-colors duration-200">
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="py-8 border-t border-zinc-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} Atrail. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
