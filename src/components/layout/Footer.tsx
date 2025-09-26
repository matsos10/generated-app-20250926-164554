import { Link } from 'react-router-dom';
import { Zap, Twitter, Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export function Footer() {
  const { t } = useTranslation();
  const navLinks = {
    product: [
      { label: t('header.features'), href: '#features' },
      { label: t('header.pricing'), href: '#pricing' },
      { label: t('header.testimonials'), href: '#testimonials' },
      { label: t('header.faq'), href: '#faq' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-display text-foreground">NexusFlow</span>
            </Link>
            <p className="mt-4 text-sm">{t('hero.subtitle').substring(0, 100)}...</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.product')}</h3>
            <ul className="mt-4 space-y-4">
              {navLinks.product.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-base hover:text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-4">
              {navLinks.company.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-base hover:text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.legal')}</h3>
            <ul className="mt-4 space-y-4">
              {navLinks.legal.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-base hover:text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors"><Twitter /></a>
            <a href="#" className="hover:text-primary transition-colors"><Github /></a>
            <a href="#" className="hover:text-primary transition-colors"><Linkedin /></a>
          </div>
          <p className="mt-4 sm:mt-0 text-sm">&copy; {new Date().getFullYear()} NexusFlow. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 text-sm">{t('footer.built_with_love')}</p>
        </div>
      </div>
    </footer>
  );
}