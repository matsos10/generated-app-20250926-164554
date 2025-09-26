import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart, Cpu, ShieldCheck, Workflow } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PricingTable } from '@/components/PricingTable';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: t('features.1.title'),
      description: t('features.1.description'),
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: t('features.2.title'),
      description: t('features.2.description'),
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: t('features.3.title'),
      description: t('features.3.description'),
    },
    {
      icon: <Workflow className="h-8 w-8 text-primary" />,
      title: t('features.4.title'),
      description: t('features.4.description'),
    },
  ];
  const testimonials = [
    {
      quote: "NexusFlow has been a game-changer for our production line. The predictive maintenance feature alone has saved us thousands in unplanned downtime.",
      name: "John Doe",
      title: "Operations Manager, Acme Inc.",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "The intelligent scheduling is incredibly powerful. We've increased our output by 15% without adding any new machinery.",
      name: "Jane Smith",
      title: "Production Lead, Stark Industries",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      quote: "Finally, a tool that gives us a complete, real-time overview of our operations. The bottleneck detection is pure genius.",
      name: "Sam Wilson",
      title: "CEO, Wayne Enterprises",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
  ];
  const faqs = [
    {
      question: t('faq.1.question'),
      answer: t('faq.1.answer'),
    },
    {
      question: t('faq.2.question'),
      answer: t('faq.2.answer'),
    },
    {
      question: t('faq.3.question'),
      answer: t('faq.3.answer'),
    },
    {
      question: t('faq.4.question'),
      answer: t('faq.4.answer'),
    },
  ];
  return (
    <div className="bg-background text-foreground">
      <Header />
      <ThemeToggle className="fixed top-4 right-4" />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-400/[0.05]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold font-display tracking-tight"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10"
            >
              <Button size="lg" asChild className="transition-transform duration-200 hover:scale-105 active:scale-95">
                <Link to="/signup">{t('hero.cta')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display">{t('features.title')}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('features.subtitle')}</p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-primary/10 mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display">{t('testimonials.title')}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('testimonials.subtitle')}</p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="flex flex-col justify-between h-full">
                    <CardContent className="pt-6">
                      <p className="text-lg">"{testimonial.quote}"</p>
                    </CardContent>
                    <CardHeader>
                      <div className="flex items-center">
                        <img className="h-12 w-12 rounded-full" src={testimonial.avatar} alt={testimonial.name} />
                        <div className="ml-4">
                          <CardTitle className="text-base">{testimonial.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display">{t('pricing.title')}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('pricing.subtitle')}</p>
            </div>
            <div className="mt-16">
              <PricingTable />
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display">{t('faq.title')}</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t('faq.subtitle')}</p>
            </div>
            <div className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}