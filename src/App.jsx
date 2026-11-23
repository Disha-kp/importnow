import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPortScene } from './portScene.js';

/* ============================================================================
 * DATA STORES (src/data/*)
 * ==========================================================================*/

const SERVICES_DATA = [
  {
    num: '01',
    title: 'Product sourcing',
    description:
      'We find verified manufacturers across Yiwu, Guangzhou, Shenzhen and Foshan, and negotiate prices on your behalf.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 15.5L20 20M10.5 8v5M8 10.5h5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Factory inspection',
    description:
      'Our team visits the factory in person. We check licences, samples and production capacity before you pay.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18M4 20V10l5 3V10l5 3V8l6 3v9M8 16h2m4 0h2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Quality control',
    description:
      'Pre-shipment checks with photo and video reports, done before the container is sealed.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.8-3 8.8-7 10-4-1.2-7-5.2-7-10V6l7-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8 3.4-3.6" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Shipping & logistics',
    description:
      'Full-container and shared-container sea freight from Chinese ports, plus air cargo for urgent orders.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4v3h-4V4zM7 7h10v4H7V7zM4 11l8-2 8 2-2 6H6l-2-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 19.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Customs clearance',
    description:
      'Documentation, duties, GST and clearance at Indian ports. No surprises when the ship lands.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4h4M9.5 12h5M9.5 16h5" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Doorstep delivery',
    description:
      'From the port straight to your shop, warehouse, villa or site, with the container unloaded on location.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3V7zM14 10h3.5l2.5 3v3h-6v-6z" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </svg>
    ),
  },
];

const INDUSTRIES_DATA = [
  {
    hub: 'FOSHAN HUB',
    title: 'Furniture & interiors',
    bullets: [
      'Complete home and villa furniture',
      'Office desks and executive chairs',
      'Banquet hall and hotel fit-outs',
    ],
    callout: 'Height-adjustable desk from ₹45,000 · MOQ 1',
    posClass: '-top-[62px] -right-[68px]',
    watermark: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 26V16a4 4 0 014-4h24a4 4 0 014 4v10M10 30a4 4 0 014-4h4v12h28V26h4a4 4 0 014 4v14H10V30zm6 14v8m32-8v8"
      />
    ),
  },
  {
    hub: 'SHENZHEN HUB',
    title: 'Electronics & tech',
    bullets: [
      'LED screens and digital signage',
      'Mobile accessories in bulk',
      'Power bank rental kiosks',
    ],
    callout: "Business ideas India doesn't have yet",
    posClass: '-top-[62px] -right-[68px]',
    watermark: (
      <>
        <rect x="18" y="4" width="32" height="52" rx="6" />
        <line x1="31" y1="48" x2="37" y2="48" strokeLinecap="round" />
      </>
    ),
  },
  {
    hub: 'GUANGZHOU HUB',
    title: 'EV & automotive',
    bullets: [
      'Electric scooters as kits for assembly in India',
      'Battery cells sourced separately',
      'Car LED lights with your own brand',
    ],
    callout: 'Car LED private label · MOQ 500',
    posClass: '-top-[62px] -right-[68px]',
    watermark: (
      <>
        <circle cx="16" cy="42" r="9" />
        <circle cx="50" cy="42" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 42l12-16h12l10 16M28 26l-4-8h-5M40 26l4-10h6" />
      </>
    ),
  },
  {
    hub: 'GUZHEN HUB',
    title: 'Lighting',
    bullets: [
      'Decorative and architectural lighting',
      'Commercial LED fixtures',
      'Custom designs for projects',
    ],
    callout: 'Direct from the lighting capital of China',
    posClass: '-top-[62px] -right-[68px]',
    watermark: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M32 8v10M20 34a12 12 0 0124 0c0 5-3 8-5 11H25c-2-3-5-6-5-11zm6 15h12m-9 5h6"
      />
    ),
  },
  {
    hub: 'YIWU HUB',
    title: 'Supermarket & general goods',
    bullets: [
      'Complete store stock in one container',
      'Home, kitchen, toys and gifts',
      'Choose products over video call',
    ],
    callout: "World's largest small-goods market",
    posClass: '-top-[62px] -right-[68px]',
    watermark: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 24v-6a10 10 0 0120 0v6M14 24h36l3 28H11l3-28z" />
    ),
  },
  {
    hub: 'PAN-CHINA',
    title: 'Machinery & automation',
    bullets: [
      'Production and packaging machines',
      'Smart vending and robotic kiosks',
      'Spares and after-sales support',
    ],
    callout: 'Tell us the machine, we find the factory',
    posClass: '-top-[62px] -right-[68px]',
    watermark: (
      <>
        <circle cx="34" cy="30" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M34 12v4m0 28v4M16 30h4m28 0h4M21 17l3 3m20 20l3 3m0-26l-3 3M24 40l-3 3"
        />
      </>
    ),
  },
];

const JOURNEY_STAGES = [
  {
    title: 'Source the right factory',
    blurb: 'Tell us the product. We shortlist verified manufacturers and get you real prices, not middleman quotes.',
    day: 'Day 0',
    progress: 0,
  },
  {
    title: 'Inspect & approve samples',
    blurb: 'Our team visits the factory in person. We check licences, samples and production capacity before you pay.',
    day: 'Day 8',
    progress: 0.2,
  },
  {
    title: 'Quality check & loading',
    blurb: 'Pre-shipment checks with photo and video reports, done before the container is sealed.',
    day: 'Day 13',
    progress: 0.38,
  },
  {
    title: 'Ocean freight',
    blurb: 'Full or shared container sea freight from Chinese ports, tracked all the way to India.',
    day: 'Day 22',
    progress: 0.62,
  },
  {
    title: 'Customs clearance',
    blurb: 'Documentation, duties, GST and clearance at the Indian port. No surprises when the ship lands.',
    day: 'Day 30',
    progress: 0.86,
  },
  {
    title: 'Delivered to your door',
    blurb: 'From the port straight to your shop, warehouse or site, with the container unloaded on location.',
    day: 'Day 35',
    progress: 1,
  },
];

const PROJECTS_DATA = [
  {
    tag: 'FULL CONTAINER · DOOR DELIVERY',
    title: 'Complete villa furniture',
    route: 'Foshan → Villa',
    saved: 'Full container',
    items: 'Sofas, dining sets, office furniture and pergolas.',
  },
  {
    tag: 'RETAIL · VIDEO SOURCING',
    title: 'Sagar Supermarket',
    route: 'Yiwu → Adilabad',
    saved: 'Retail · Video sourcing',
    items: 'Complete supermarket stock delivered to the client\u2019s warehouse.',
  },
  {
    tag: 'HOSPITALITY · BULK ORDER',
    title: 'Sreeman Convention Centre',
    route: 'China → Convention centre',
    saved: 'Hospitality · Bulk order',
    items: 'Cots, beds, dining sets and office furniture.',
  },
  {
    tag: 'MOQ 1 · ~30 DAYS',
    title: 'Smart office desks',
    route: 'China → Hyderabad',
    saved: 'MOQ 1 · ~30 days',
    items: 'Motorised height-adjustable L-shaped desks.',
  },
];

const TESTIMONIALS_DATA = [
  {
    name: 'Sai',
    role: 'Ad-tech startup · Siddipet',
    quote:
      'Sourced LED screens and electronics directly from the Guangzhou and Shenzhen markets, with the ImportNow team handling factory checks and shipping.',
    route: 'Guangzhou / Shenzhen → Siddipet',
  },
  {
    name: 'Mahender Reddy',
    role: 'Canton Fair trip client',
    quote:
      'A 12-day trip covering the Canton Fair and the factories I chose. It felt like a personal trip, not a business tour.',
    route: 'Canton Fair · 12 days',
  },
  {
    name: 'Sagar Supermarket',
    role: 'Retail · Adilabad',
    quote:
      'We chose every product over video calls, and it all shipped from Yiwu straight to our warehouse.',
    route: 'Yiwu → Adilabad',
  },
];

const ARTICLES_DATA = [
  {
    slug: 'landed-cost-china-to-india',
    category: 'COSTING & DUTIES',
    readTime: '5 min read',
    title: 'How Landed Cost Is Calculated from China to India',
    summary:
      'Understand EXW vs FOB pricing, ocean freight, Basic Customs Duty (BCD), Social Welfare Surcharge, IGST, and Indian port CHA charges before you place an order.',
    paragraphs: [
      'Many first-time importers only look at the Chinese factory price (EXW or FOB) and get surprised when the shipment lands in India. At ImportNow, we calculate the complete Doorstep Landed Cost upfront before you pay a single rupee.',
      '1. Factory Price & Local China Freight: The negotiated factory unit price plus inland trucking to Shanghai, Ningbo, or Shenzhen port.',
      '2. International Ocean or Air Freight: Shared container (LCL per CBM) or Full Container Load (20ft / 40ft HQ) freight to Chennai, Nhava Sheva, or Vizag.',
      '3. Indian Customs Duty & IGST: Calculated strictly on your product’s 8-digit HSN code (Assessable Value + Basic Customs Duty + Social Welfare Surcharge + IGST, which is claimable as GST input credit for businesses).',
    ],
  },
  {
    slug: '1-piece-moq-vs-full-container',
    category: 'LOGISTICS STRATEGY',
    readTime: '4 min read',
    title: '1-Piece MOQ vs Full Container (FCL): What Should You Choose?',
    summary:
      'When shared LCL consolidation makes sense for single luxury items or samples—and the exact CBM threshold where booking a 20ft or 40ft HQ container saves lakhs.',
    paragraphs: [
      'You do not always need to book an entire 20ft container to import directly from China. Our regular consolidated containers allow you to ship single high-value items—such as height-adjustable desks, luxury chandeliers, or sample machinery—at a fraction of air cargo rates.',
      'Choose LCL (1-Piece / Shared Container) when your total volume is under 12 CBM or you are testing a new product line in the Indian market.',
      'Switch to FCL (20ft = ~28 CBM, 40ft HQ = ~68 CBM) when furnishing an entire villa, convention centre, or stocking a retail store—bringing your per-unit freight cost down by up to 60%.',
    ],
  },
  {
    slug: 'canton-fair-checklist-indian-importers',
    category: 'TRADE FAIRS',
    readTime: '6 min read',
    title: 'Canton Fair First-Timer Checklist for Indian Importers',
    summary:
      'Which Phase matches your product category, how to register your Buyer Badge early, WeChat & Alipay setup, and how to separate real factories from trading booths.',
    paragraphs: [
      'Held every Spring (April–May) and Autumn (October–November) in Guangzhou, the Canton Fair is split into 3 distinct phases covering Electronics & Machinery (Phase 1), Furniture, Lighting & Home Goods (Phase 2), and Textiles, Toys & Office Supplies (Phase 3).',
      'Before flying, ensure your Chinese business visa invitation letter is issued early, set up Alipay/WeChat Pay linked to your international card, and shortlist real manufacturers rather than middleman booths.',
      'On ImportNow’s guided Canton Fair trips, our bilingual team accompanies you across the exhibition halls and takes you directly to the actual factory floors in Foshan, Shenzhen, and Guzhen.',
    ],
  },
];

const FAQS_DATA = [
  {
    q: 'Can I import just one piece?',
    a: 'Yes, for many products. Height-adjustable desks have a minimum order of one piece. Private-label items such as car LED lights usually start at around 500 units.',
    defaultOpen: true,
  },
  {
    q: 'How long does delivery take?',
    a: 'Most sea shipments take about 30 to 40 days depending on the product, production time and port. Air cargo is faster for urgent orders.',
  },
  {
    q: 'Do you handle customs and GST?',
    a: 'Yes. We take care of documentation, duties, GST and clearance at the Indian port, so there are no surprises when the ship lands.',
  },
  {
    q: 'Do I need an Import Export Code (IEC)?',
    a: 'Yes, for commercial imports. We will guide you through getting one.',
  },
  {
    q: 'Can I visit factories myself?',
    a: 'Yes. Join a guided China trip, or we can arrange visits to factories you have shortlisted.',
  },
  {
    q: 'What is the best business to start importing?',
    a: 'It depends on your interests and budget. Popular choices include furniture, EV scooters, car accessories, lighting and supermarket goods.',
  },
];

const TICKER_ROUTES = [
  ['Yiwu', 'Adilabad'],
  ['Foshan', 'Hyderabad'],
  ['Shenzhen', 'Siddipet'],
  ['Guangzhou', 'Chennai'],
  ['Shanghai', 'Nhava Sheva'],
  ['Guzhen', 'Vizag'],
  ['Ningbo', 'Mumbai'],
];

/* ============================================================================
 * REUSABLE UI COMPONENTS (src/components/*)
 * ==========================================================================*/

function ChinaFlag({ className = 'w-3.5 h-2.5' }) {
  return (
    <svg className={`${className} rounded-[1.5px] shrink-0`} viewBox="0 0 30 20" aria-label="China flag">
      <rect width="30" height="20" fill="#DE2910" />
      <polygon points="5,2.5 5.9,5.2 8.7,5.2 6.4,6.8 7.3,9.5 5,7.9 2.7,9.5 3.6,6.8 1.3,5.2 4.1,5.2" fill="#FFDE00" />
      <circle cx="10.5" cy="2.5" r="0.85" fill="#FFDE00" />
      <circle cx="12.2" cy="4.8" r="0.85" fill="#FFDE00" />
      <circle cx="12.2" cy="7.8" r="0.85" fill="#FFDE00" />
      <circle cx="10.5" cy="10" r="0.85" fill="#FFDE00" />
    </svg>
  );
}

function IndiaFlag({ className = 'w-4 h-3' }) {
  return (
    <svg className={`${className} rounded-[2px] shrink-0 border border-black/5`} viewBox="0 0 30 20" aria-label="India flag">
      <rect width="30" height="6.67" y="0" fill="#FF9933" />
      <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
      <rect width="30" height="6.67" y="13.33" fill="#138808" />
      <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.7" />
      <circle cx="15" cy="10" r="0.5" fill="#000080" />
    </svg>
  );
}

function Eyebrow({ children, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 h-6 font-sans text-[12px] uppercase tracking-[0.14em] text-[#E1472E] font-bold ${className}`}>
      <span className="w-5 h-[1.5px] bg-[#E1472E]" />
      <span>{children}</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, accent, subtitle, tight = false, dark = false }) {
  return (
    <div className={tight ? 'mb-7' : 'mb-[52px]'}>
      <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
      <h2
        className={`font-display font-extrabold text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.07] tracking-[-0.035em] max-w-[700px] ${
          dark ? 'text-white' : 'text-[#111315]'
        }`}
      >
        {title} {accent && <span className="text-[#E1472E]">{accent}</span>}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-[700px] text-[16.5px] sm:text-[18px] leading-[1.63] ${dark ? 'text-[#A1A1AA]' : 'text-[#4B5563]'}`}>{subtitle}</p>
      )}
    </div>
  );
}

function Navbar({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Services', href: '#services', route: '/services', section: 'services' },
    { label: 'How it works', href: '#journey', route: '/journey', section: 'journey' },
    { label: 'What we import', href: '#industries', route: '/products', section: 'industries' },
    { label: 'China trips', href: '#trips', route: '/trips', section: 'trips' },
    { label: 'Blog', href: '#blog', route: '/blog', section: 'blog' },
    { label: 'Contact', href: '#contact', route: '/contact', section: 'contact' },
  ];

  const handleClick = (e, item) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(item.route, item.section, item.href);
  };

  return (
    <header
      id="navbar"
      className={`fixed top-0 inset-x-0 z-40 h-20 transition-all duration-300 backdrop-blur-md border-b ${
        scrolled ? 'bg-white/95 border-gray-200 shadow-xs' : 'bg-[#F7F7F5]/90 border-gray-200/60'
      }`}
    >
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0 h-20 flex items-center justify-between gap-4">
        <a
          href="#services"
          onClick={(e) => handleClick(e, { route: '/services', section: 'services', href: '#heroSection' })}
          className="inline-flex items-center font-display font-extrabold text-[20px] sm:text-[21px] tracking-[-0.03em] text-[#111315] select-none focus:outline-none"
        >
          <span>IMP</span>
          <span className="inline-flex items-center justify-center mx-[1.5px] text-[#111315]" aria-hidden="true">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="3" x2="12" y2="14" />
              <polyline points="8.5 10.5 12 14 15.5 10.5" />
            </svg>
          </span>
          <span>RTNOW</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#374151]">
          {navItems.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <a
                key={item.section}
                href={item.href}
                onClick={(e) => handleClick(e, item)}
                className={`relative hover:text-[#111315] transition-colors py-1.5 underline-offset-[6px] decoration-2 decoration-[#111315] ${
                  isActive ? 'underline text-[#111315] font-semibold' : ''
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, { route: '/contact', section: 'contact', href: '#contact' })}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#111315] hover:bg-[#272A2E] text-white font-semibold text-[13.5px] shadow-sm transition-all active:scale-[0.98]"
          >
            Get a free quote
          </a>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-full bg-white border border-gray-200 text-[#111315] hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-gray-200 px-5 pt-3 pb-6 space-y-1.5">
          {navItems.map((item) => (
            <a
              key={item.section}
              href={item.href}
              onClick={(e) => handleClick(e, item)}
              className="block px-4 py-3 rounded-xl text-[#111315] hover:bg-[#F8F7F4] font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function ServiceCard({ service }) {
  return (
    <div className="relative bg-white rounded-[22px] border border-gray-200/80 shadow-[0_2px_14px_rgba(17,19,21,0.04)] hover:shadow-[0_12px_28px_rgba(17,19,21,0.07)] transition-shadow p-[30px] flex flex-col">
      <span className="absolute right-[26px] top-[22px] font-display text-[13.5px] font-semibold text-gray-300">{service.num}</span>
      <div className="w-[52px] h-[52px] rounded-2xl bg-[#111315] flex items-center justify-center text-white shrink-0 mb-5">{service.icon}</div>
      <h3 className="font-display font-bold text-[22px] leading-[1.25] text-[#111315] tracking-[-0.02em] mb-2">{service.title}</h3>
      <p className="text-[#4B5563] text-[15px] leading-[1.65]">{service.description}</p>
    </div>
  );
}

function IndustryCard({ item }) {
  return (
    <div className="hub-card group relative overflow-hidden w-full h-full bg-white rounded-[22px] border border-gray-200/80 shadow-[0_2px_14px_rgba(17,19,21,0.04)] hover:shadow-[0_12px_28px_rgba(17,19,21,0.07)] transition-shadow p-[30px] flex flex-col">
      <svg
        className={`hub-watermark-icon pointer-events-none absolute ${item.posClass} w-[190px] h-[190px] text-[#EEEEEE]`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        {item.watermark}
      </svg>

      <div className="relative z-10 inline-flex items-center gap-[11px] h-4 mb-3">
        <ChinaFlag className="w-5 h-[14px]" />
        <span className="font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-[#4B5563]">{item.hub}</span>
      </div>
      <h3 className="relative z-10 font-display font-extrabold text-[22px] leading-[1.25] text-[#111315] tracking-[-0.02em] mb-5">{item.title}</h3>
      <ul className="relative z-10 space-y-1.5 text-[14.6px] text-[#4B5563] leading-[1.65] mb-[22px]">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E1472E] shrink-0 mt-[9px]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="relative z-10 mt-auto">
        <div className="inline-block max-w-full px-[13px] py-[8.5px] rounded-xl bg-[#F3F3F3] border border-gray-200 font-sans text-[13.2px] font-semibold text-[#111315] leading-[1.15]">
          {item.callout}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="surface-card rounded-[22px] p-7 flex flex-col justify-between">
      <div>
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#E1472E] mb-3">{project.tag}</div>
        <h3 className="font-display font-bold text-xl text-[#111315] mb-2">{project.title}</h3>
        <p className="text-sm text-[#4B5563] leading-relaxed mb-5">{project.items}</p>
      </div>
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <div className="text-xs font-mono text-[#6B7280]">{project.route}</div>
        <div className="inline-block px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
          {project.saved}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <div className="surface-card rounded-[22px] p-7 flex flex-col justify-between">
      <p className="text-[#374151] text-sm sm:text-[15px] leading-relaxed mb-6">“{item.quote}”</p>
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          <div className="font-display font-bold text-base text-[#111315]">{item.name}</div>
          <div className="text-xs text-[#6B7280]">{item.role}</div>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#F8F7F4] border border-gray-200 text-[#4B5563]">
          {item.route}
        </span>
      </div>
    </div>
  );
}

function FAQAccordion() {
  return (
    <section id="faq" className="py-24 sm:py-32 relative bg-[#F8F7F4]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-14">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#E1472E] font-semibold mb-3">Questions</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#111315]">Before you import</h2>
        </div>

        <div className="space-y-4">
          {FAQS_DATA.map((faq, idx) => (
            <details key={idx} open={faq.defaultOpen} className="surface-card rounded-2xl p-6 group">
              <summary className="flex items-center justify-between gap-4 cursor-pointer font-display font-bold text-base sm:text-lg text-[#111315]">
                <span>{faq.q}</span>
                <svg className="faq-chevron w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-[#4B5563] text-sm sm:text-base leading-relaxed mt-4 pt-4 border-t border-gray-100">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#F8F7F4] border-t border-gray-200 py-14">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-gray-200">
          <div>
            <a
              href="#heroSection"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/services', 'services', '#heroSection');
              }}
              className="inline-flex items-center font-display font-extrabold text-xl tracking-[-0.03em] text-[#111315]"
            >
              <span>IMP</span>
              <span className="inline-flex items-center justify-center mx-[1.5px]">
                <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="3" x2="12" y2="14" />
                  <polyline points="8.5 10.5 12 14 15.5 10.5" />
                </svg>
              </span>
              <span>RTNOW</span>
            </a>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-3 max-w-md">
              Operating legally in China as <strong className="text-[#111315] font-semibold">Shanghai Shengqiao Chain Trading Co., Ltd.</strong> · Serving businesses and homeowners across India from Hyderabad &amp; Shanghai.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-[#4B5563] font-medium">
            <a href="#services" onClick={(e) => { e.preventDefault(); onNavigate('/services', 'services', '#services'); }} className="hover:text-[#111315] transition-colors">Services</a>
            <a href="#journey" onClick={(e) => { e.preventDefault(); onNavigate('/journey', 'journey', '#journey'); }} className="hover:text-[#111315] transition-colors">How it works</a>
            <a href="#industries" onClick={(e) => { e.preventDefault(); onNavigate('/products', 'industries', '#industries'); }} className="hover:text-[#111315] transition-colors">What we import</a>
            <a href="#trips" onClick={(e) => { e.preventDefault(); onNavigate('/trips', 'trips', '#trips'); }} className="hover:text-[#111315] transition-colors">China trips</a>
            <a href="#blog" onClick={(e) => { e.preventDefault(); onNavigate('/blog', 'blog', '#blog'); }} className="hover:text-[#111315] transition-colors">Blog</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('/contact', 'contact', '#contact'); }} className="hover:text-[#111315] transition-colors">Contact</a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] font-mono">
          <div>© 2026 ImportNow · Shanghai Shengqiao Chain Trading Co., Ltd. All rights reserved.</div>
          <div>Hyderabad, India · Shanghai, China</div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919989724320"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
    >
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z" />
      </svg>
    </a>
  );
}

/* ============================================================================
 * SECTIONS (src/sections/*)
 * ==========================================================================*/

function Hero({ onNavigate }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);
  const [bizCount, setBizCount] = useState(500);
  const [igCount, setIgCount] = useState(83);

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();
    let frameId;
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setBizCount(Math.round(eased * 500));
      setIgCount(Math.round(eased * 83));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const labelsLayer = labelsRef.current;
    if (!container || !canvas || !labelsLayer) return;

    labelsLayer.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 7.85);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;

    const worldAnchorGroup = new THREE.Group();
    scene.add(worldAnchorGroup);

    const earthGroup = new THREE.Group();
    worldAnchorGroup.add(earthGroup);

    const EARTH_RADIUS = 2.0;
    let baseGlobeScale = 1.0;
    let currentZoomMultiplier = 0.80;

    function updateGlobeFraming() {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      const vFovRad = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFovRad / 2) * camera.position.z;
      const desiredDiameter = visibleHeight * 0.89;
      baseGlobeScale = desiredDiameter / (EARTH_RADIUS * 2);
      worldAnchorGroup.scale.setScalar(baseGlobeScale * currentZoomMultiplier);
      worldAnchorGroup.position.set(0, 0, 0);
    }

    updateGlobeFraming();
    window.addEventListener('resize', updateGlobeFraming);

    // Procedural fallback satellite Earth texture
    const width = 1024;
    const height = 512;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = width;
    texCanvas.height = height;
    const ctx = texCanvas.getContext('2d');
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#091930');
    oceanGrad.addColorStop(0.5, '#12305C');
    oceanGrad.addColorStop(1, '#08162B');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    const fallbackColorTex = new THREE.CanvasTexture(texCanvas);
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 96, 96);
    const earthMat = new THREE.MeshPhongMaterial({
      map: fallbackColorTex,
      specular: new THREE.Color('#27548A'),
      shininess: 24,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    const texLoader = new THREE.TextureLoader();
    texLoader.setCrossOrigin('anonymous');
    texLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg', (tex) => {
      tex.anisotropy = 8;
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });
    texLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png', (tex) => {
      earthMat.bumpMap = tex;
      earthMat.bumpScale = 0.048;
      earthMat.needsUpdate = true;
    });
    texLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png', (tex) => {
      earthMat.specularMap = tex;
      earthMat.specular = new THREE.Color('#3468A8');
      earthMat.shininess = 28;
      earthMat.needsUpdate = true;
    });

    // Outer full-circle electric-blue atmospheric halo
    const atmosOuterGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.095, 96, 96);
    const atmosOuterMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color('#5A9EFF') },
        upperLeftDir: { value: new THREE.Vector3(-0.65, 0.65, 0.35).normalize() },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform vec3 upperLeftDir;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        void main() {
          float rim = clamp(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
          float upperLeftBoost = 0.85 + 0.30 * clamp(dot(vWorldNormal, upperLeftDir), 0.0, 1.0);
          float alpha = pow(rim, 1.85) * 0.92 * upperLeftBoost;
          gl_FragColor = vec4(glowColor, clamp(alpha, 0.0, 0.96));
        }
      `,
    });
    worldAnchorGroup.add(new THREE.Mesh(atmosOuterGeo, atmosOuterMat));

    // Inner blue horizon rim
    const atmosInnerGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.003, 80, 80);
    const atmosInnerMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        rimColor: { value: new THREE.Color('#60A5FA') },
        upperLeftDir: { value: new THREE.Vector3(-0.65, 0.65, 0.35).normalize() },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 rimColor;
        uniform vec3 upperLeftDir;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        void main() {
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.3);
          float boost = 0.82 + 0.36 * clamp(dot(vWorldNormal, upperLeftDir), 0.0, 1.0);
          gl_FragColor = vec4(rimColor, fresnel * 0.76 * boost);
        }
      `,
    });
    earthGroup.add(new THREE.Mesh(atmosInnerGeo, atmosInnerMat));

    scene.add(new THREE.AmbientLight(0xffffff, 0.94));
    const sunLight = new THREE.DirectionalLight(0xfffdf8, 0.92);
    sunLight.position.set(4.8, 2.6, 5.8);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x5a9eff, 0.48);
    rimLight.position.set(-5.2, 2.4, 1.5);
    scene.add(rimLight);

    function latLonToVector3(latDeg, lonDeg, radius) {
      const phi = ((90 - latDeg) * Math.PI) / 180;
      const theta = ((lonDeg + 180) * Math.PI) / 180;
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    const cities = [
      { id: 'yiwu', name: 'Yiwu', country: 'CN', lat: 29.3, lon: 120.07, align: 'top-left' },
      { id: 'shanghai', name: 'Shanghai', country: 'CN', lat: 31.23, lon: 121.47, align: 'right' },
      { id: 'guangzhou', name: 'Guangzhou', country: 'CN', lat: 23.13, lon: 113.26, align: 'right' },
      { id: 'nhava', name: 'Nhava Sheva', country: 'IN', lat: 18.95, lon: 72.95, align: 'left' },
      { id: 'hyderabad', name: 'Hyderabad', country: 'IN', lat: 17.38, lon: 78.48, align: 'right' },
      { id: 'chennai', name: 'Chennai', country: 'IN', lat: 13.08, lon: 80.27, align: 'right' },
    ];

    const cityMap = {};
    const pinMeshes = [];

    cities.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, EARTH_RADIUS * 1.006);
      city.vec3 = pos;
      cityMap[city.id] = city;

      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);
      pinGroup.lookAt(pos.clone().multiplyScalar(2));

      const isChina = city.country === 'CN';
      const whiteCenter = new THREE.Mesh(
        new THREE.CircleGeometry(0.024, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      const outerRing = new THREE.Mesh(
        new THREE.RingGeometry(0.042, 0.06, 32),
        new THREE.MeshBasicMaterial({
          color: isChina ? 0xe1472e : 0xffffff,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
        })
      );
      const glowDisc = new THREE.Mesh(
        new THREE.CircleGeometry(0.088, 24),
        new THREE.MeshBasicMaterial({
          color: isChina ? 0xff5733 : 0xfbbf24,
          transparent: true,
          opacity: 0.28,
          side: THREE.DoubleSide,
        })
      );

      pinGroup.add(glowDisc, whiteCenter, outerRing);
      earthGroup.add(pinGroup);
      pinMeshes.push({ ring: outerRing, glow: glowDisc, city });

      const alignClass =
        city.align === 'left' ? 'left-side' : city.align === 'top-left' ? 'top-left-side' : '';

      const badge = document.createElement('div');
      badge.className = `globe-pin-label ${alignClass}`;
      const flagSvg = isChina
        ? `<svg class="w-3.5 h-2.5 rounded-[1.5px] shrink-0" viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><polygon points="5,2.5 5.9,5.2 8.7,5.2 6.4,6.8 7.3,9.5 5,7.9 2.7,9.5 3.6,6.8 1.3,5.2 4.1,5.2" fill="#FFDE00"/></svg>`
        : `<svg class="w-3.5 h-2.5 rounded-[1.5px] shrink-0 border border-black/10" viewBox="0 0 30 20"><rect width="30" height="6.67" y="0" fill="#FF9933"/><rect width="30" height="6.67" y="6.67" fill="#FFFFFF"/><rect width="30" height="6.67" y="13.33" fill="#138808"/><circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" stroke-width="0.7"/></svg>`;

      badge.innerHTML = `<div class="globe-pill-badge">${flagSvg}<span>${city.name}</span></div>`;
      labelsLayer.appendChild(badge);
      city.el = badge;
    });

    const routePairs = [
      ['yiwu', 'nhava', 0xe1472e, 0.21],
      ['yiwu', 'hyderabad', 0xff5733, 0.18],
      ['shanghai', 'nhava', 0xe1472e, 0.24],
      ['guangzhou', 'hyderabad', 0xf8fafc, 0.13],
      ['guangzhou', 'chennai', 0xe1472e, 0.15],
    ];

    const pulseParticles = [];
    routePairs.forEach(([fromId, toId, hexColor, archHeight], idx) => {
      const start = cityMap[fromId].vec3.clone();
      const end = cityMap[toId].vec3.clone();
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(EARTH_RADIUS + archHeight);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
      const arcMat = new THREE.LineBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: hexColor === 0xf8fafc ? 0.85 : 0.92,
      });
      earthGroup.add(new THREE.Line(arcGeo, arcMat));

      const pulseMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfff7ed })
      );
      pulseMesh.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(0.064, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xff7a45, transparent: true, opacity: 0.36 })
        )
      );
      earthGroup.add(pulseMesh);
      pulseParticles.push({ mesh: pulseMesh, curve, offset: idx * 0.19, speed: 0.21 + (idx % 3) * 0.035 });
    });

    const baseRotY = -((102.5 + 180) * Math.PI) / 180 + Math.PI / 2;
    const baseRotX = 0.30;
    earthGroup.rotation.y = baseRotY;
    earthGroup.rotation.x = baseRotX;

    let targetOffsetY = 0;
    let targetOffsetX = 0;
    let currentOffsetY = 0;
    let currentOffsetX = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragYaw = 0;
    let dragPitch = 0;

    const onMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      if (isDragging) {
        dragYaw = Math.max(-0.35, Math.min(0.35, dragYaw + (e.clientX - prevX) * 0.004));
        dragPitch = Math.max(-0.25, Math.min(0.25, dragPitch + (e.clientY - prevY) * 0.003));
        prevX = e.clientX;
        prevY = e.clientY;
      } else {
        targetOffsetY = normX * ((14 * Math.PI) / 180);
        targetOffsetX = normY * ((9 * Math.PI) / 180);
      }
    };

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();
    const worldNormal = new THREE.Vector3();
    const globeCenterWorld = new THREE.Vector3();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const zoomProgress = Math.min(elapsed / 1.4, 1);
      const easedZoom = 1 - Math.pow(1 - zoomProgress, 3);
      currentZoomMultiplier = 0.80 + 0.20 * easedZoom;
      worldAnchorGroup.scale.setScalar(baseGlobeScale * currentZoomMultiplier);

      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.055;
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.055;

      earthGroup.rotation.y = baseRotY + currentOffsetY + dragYaw + Math.sin(elapsed * 0.45) * 0.016;
      earthGroup.rotation.x = baseRotX + currentOffsetX + dragPitch;

      pulseParticles.forEach((p) => {
        const t = (elapsed * p.speed + p.offset) % 1;
        p.mesh.position.copy(p.curve.getPoint(t));
      });

      worldAnchorGroup.updateMatrixWorld(true);
      worldAnchorGroup.getWorldPosition(globeCenterWorld);
      const rect = container.getBoundingClientRect();

      pinMeshes.forEach(({ ring, glow, city }, idx) => {
        const pulse = 1 + Math.sin(elapsed * 3.0 + idx) * 0.16;
        ring.scale.set(pulse, pulse, 1);
        glow.scale.set(pulse * 1.1, pulse * 1.1, 1);

        tempVec.copy(city.vec3).applyMatrix4(earthGroup.matrixWorld);
        worldNormal.copy(tempVec).sub(globeCenterWorld).normalize();
        if (worldNormal.z <= 0.08) {
          city.el.style.opacity = '0';
          return;
        }
        tempVec.project(camera);
        city.el.style.opacity = '1';
        city.el.style.left = `${((tempVec.x * 0.5 + 0.5) * rect.width).toFixed(1)}px`;
        city.el.style.top = `${((-tempVec.y * 0.5 + 0.5) * rect.height).toFixed(1)}px`;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateGlobeFraming);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  return (
    <section id="heroSection" className="hero">
      <div className="absolute -left-24 top-20 w-[520px] h-[520px] rounded-full bg-[#E1472E]/[0.04] blur-3xl pointer-events-none" />

      <div className="hero-inner">
        <div className="hero-content">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-gray-200/90 shadow-xs text-[13px] font-medium text-[#374151] mb-6">
            <ChinaFlag className="w-4 h-3 shadow-2xs" />
            <span className="text-[#E1472E] font-bold text-xs">→</span>
            <IndiaFlag className="w-4 h-3 shadow-2xs" />
            <span>Trusted by 500+ Indian businesses</span>
          </div>

          <h1 className="font-display font-extrabold text-[44px] sm:text-[58px] lg:text-[87px] text-[#111315] leading-[1.035] tracking-[-0.04em] mb-[22px]">
            Import directly
            <br />
            from China.
            <br />
            <span className="text-[#E1472E]">
              Without the
              <br />
              guesswork.
            </span>
          </h1>

          <p className="text-[17px] sm:text-[20px] text-[#4B5563] leading-[1.65] max-w-[530px] mb-8 font-normal">
            Sourcing, factory inspection, shipping and customs, handled end to end by a team with its own company in Shanghai. You choose the product. We bring it to your door.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-12">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/contact', 'contact', '#contact');
              }}
              className="inline-flex items-center justify-center gap-2.5 h-[46px] px-6 rounded-full bg-[#111315] hover:bg-[#26292E] text-white font-semibold text-[15px] shadow-md shadow-black/10 transition-all active:scale-[0.98]"
            >
              <span>Get a free sourcing quote</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#journey"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/journey', 'journey', '#journey');
              }}
              className="inline-flex items-center justify-center h-[46px] px-6 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#111315] font-semibold text-[15px] shadow-2xs transition-all"
            >
              See how it works
            </a>
          </div>

          <div className="flex flex-wrap gap-x-[60px] gap-y-6">
            <div>
              <div className="font-display font-extrabold text-[27px] sm:text-[29px] text-[#111315] leading-[1.15]">{bizCount}+</div>
              <div className="text-[13px] text-[#6B7280] leading-[1.3] mt-[9px]">
                Businesses
                <br />
                served
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-[27px] sm:text-[29px] text-[#111315] leading-[1.15]">{igCount}K+</div>
              <div className="text-[13px] text-[#6B7280] leading-[1.3] mt-[9px]">
                Community on
                <br />
                Instagram
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-[27px] sm:text-[29px] text-[#111315] leading-[1.15]">1 pc</div>
              <div className="text-[13px] text-[#6B7280] leading-[1.3] mt-[9px]">
                MOQ on many
                <br />
                products
              </div>
            </div>
            <div>
              <div className="font-display font-extrabold text-[27px] sm:text-[29px] text-[#111315] leading-[1.15]">Shanghai</div>
              <div className="text-[13px] text-[#6B7280] leading-[1.3] mt-[9px]">
                Own registered
                <br />
                company
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-globe-wrapper">
        <div ref={containerRef} id="earthStageContainer" className="hero-globe select-none">
          <canvas ref={canvasRef} id="earthGlobeCanvas" className="w-full h-full block" />
          <div ref={labelsRef} id="globeLabelsLayer" className="absolute inset-0 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

function Statistics() {
  return (
    <div className="marquee-wrapper relative z-10 bg-white border-y border-gray-200 h-[57px] flex items-center overflow-hidden select-none">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((track) => (
          <div key={track} aria-hidden={track === 1} className="flex items-center gap-[45px] pr-[45px] font-display font-semibold text-[17px] tracking-[-0.01em] text-[#111315]">
            {TICKER_ROUTES.map(([origin, dest], idx) => (
              <span key={`${track}-${idx}`} className="inline-flex items-center gap-5 whitespace-nowrap">
                {origin} <span className="text-[#E1472E] font-bold">→</span> {dest}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="bg-white pt-[111px] pb-[112px]">
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0">
        <SectionHeading
          eyebrow="End-to-end imports"
          title="One team from the"
          accent="factory floor to your front door."
          subtitle="Anyone can say they import from China. What you actually need is a smooth process, clear communication and a shipment that arrives safely."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.num} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Scroll-pinned sections: progress 0..1 while the sticky panel is pinned. */
const NAV_H = 80;
function usePinnedProgress(outerRef, onProgress) {
  const cbRef = useRef(onProgress);
  cbRef.current = onProgress;
  useEffect(() => {
    let target = 0;
    let cur = 0;
    let raf = 0;
    let last = performance.now();
    let first = true;

    const compute = () => {
      const el = outerRef.current;
      if (!el) return;
      const range = Math.max(1, el.offsetHeight - (window.innerHeight - NAV_H));
      target = Math.min(1, Math.max(0, (NAV_H - el.getBoundingClientRect().top) / range));
    };
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      cur += (target - cur) * (1 - Math.exp(-dt * 7));
      if (Math.abs(target - cur) < 0.0002) cur = target;
      cbRef.current(cur);
      raf = cur === target ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      compute();
      if (first) {
        cur = target;
        first = false;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      cancelAnimationFrame(raf);
    };
  }, [outerRef]);
}

// scroll progress at which each step becomes active
const STEP_STARTS = [0, 0.338, 0.483, 0.58, 0.7, 0.92];

function ShippingJourney() {
  const outerRef = useRef(null);
  const pRef = useRef(0);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const [prog, setProg] = useState(0);

  usePinnedProgress(outerRef, (p) => {
    pRef.current = p;
    let s = 0;
    STEP_STARTS.forEach((v, i) => {
      if (p >= v - 1e-6) s = i;
    });
    setStep((prev) => (prev === s ? prev : s));
    setProg((prev) => (Math.abs(prev - p) > 0.004 || p === 0 || p === 1 ? p : prev));
  });

  useEffect(() => {
    if (!wrapperRef.current || !canvasRef.current) return;
    return createPortScene(canvasRef.current, wrapperRef.current, () => pRef.current);
  }, []);

  const goTo = (i) => {
    const el = outerRef.current;
    if (!el) return;
    const range = el.offsetHeight - (window.innerHeight - NAV_H);
    const top = window.scrollY + el.getBoundingClientRect().top - NAV_H + (STEP_STARTS[i] + 0.004) * range;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const stage = JOURNEY_STAGES[step];

  return (
    <section id="journey" ref={outerRef} style={{ height: '820vh', scrollMarginTop: NAV_H }} className="relative">
      <div
        className="sticky overflow-hidden bg-[#D5DCE3]"
        style={{ top: NAV_H, height: `calc(100vh - ${NAV_H}px)`, minHeight: 640 }}
      >
        <div ref={wrapperRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[62%] bg-gradient-to-r from-white/85 via-white/50 to-transparent" />

        <div className="absolute top-6 right-5 sm:right-8 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 shadow-sm text-[13px] font-semibold text-[#111315]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E1472E] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E1472E]" />
          </span>
          Live shipment view
        </div>

        <div className="relative z-10 max-w-[1152px] mx-auto px-6 lg:px-0 h-full flex flex-col justify-center pt-0 pb-5">
          <Eyebrow className="mb-3">How it works</Eyebrow>
          <h2 className="font-display font-extrabold text-[36px] sm:text-[48px] text-[#111315] leading-[1.07] tracking-[-0.035em] max-w-[480px] mb-7">
            Watch your order travel from China to India.
          </h2>

          <div className="max-w-[412px] space-y-1.5">
            {JOURNEY_STAGES.map((st, idx) => {
              const isActive = idx === step;
              return (
                <button
                  key={st.title}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={`w-full text-left flex items-start gap-[18px] transition-all duration-300 ${
                    isActive
                      ? 'px-[17px] py-[14px] rounded-[22px] bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(17,19,21,0.08)]'
                      : 'px-[17px] py-3 rounded-2xl hover:bg-white/40'
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[14px] shrink-0 transition-colors ${
                      isActive ? 'bg-[#D8301B] text-white' : 'bg-white/80 text-[#6B7280]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="block pt-[7px]">
                    <span className={`block font-display font-bold tracking-[-0.02em] text-[18px] leading-[1.25] ${isActive ? 'text-[#111315]' : 'text-[#6B7280]'}`}>
                      {st.title}
                    </span>
                    {isActive && <span className="block text-[13.5px] text-[#4B5563] leading-[1.7] mt-1">{st.blurb}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10">
          <div className="max-w-[1152px] mx-auto px-6 lg:px-0 flex items-end gap-4">
            <div className="flex-1 max-w-[643px] flex items-center gap-5 px-5 py-3.5 rounded-[20px] bg-white/90 backdrop-blur-md shadow-[0_10px_30px_rgba(17,19,21,0.1)]">
              <div className="flex items-center gap-2 shrink-0">
                <ChinaFlag className="w-5 h-[14px]" />
                <div className="leading-[1.25]">
                  <div className="font-display font-bold text-[14px] text-[#111315]">Shanghai</div>
                  <div className="text-[12.5px] text-[#6B7280]">Origin port</div>
                </div>
              </div>

              <div className="relative flex-1 h-8 min-w-[80px]">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-gray-300/80" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-[#E1472E]" style={{ width: `${prog * 100}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#E1472E]/40 shadow-sm flex items-center justify-center text-[#111315]"
                  style={{ left: `calc(${prog * 100}% - ${prog * 32}px)` }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17l2 3h14l2-3H3zM6 17V11h12v6M9 11V7h6v4M12 3v4" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="leading-[1.25]">
                  <div className="font-display font-bold text-[14px] text-[#111315]">Chennai</div>
                  <div className="text-[12.5px] text-[#6B7280]">Destination</div>
                </div>
                <IndiaFlag className="w-5 h-[14px]" />
              </div>

              <div className="font-display font-extrabold text-[16px] whitespace-nowrap pl-4 text-[#111315]">{stage.day}</div>
            </div>
            {prog < 0.97 && (
              <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 backdrop-blur-md text-[12px] font-semibold text-[#4B5563] shadow-sm">
                Scroll to continue <span aria-hidden="true">↓</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

function Industries() {
  return (
    <section id="industries" className="bg-white pt-[111px] pb-[112px]" style={{ scrollMarginTop: NAV_H }}>
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0">
        <SectionHeading
          eyebrow="WHAT WE IMPORT"
          title="China has a market for every industry."
          accent="We know each one."
          subtitle="Each industry has its own manufacturing hub. We take you straight to the source."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES_DATA.map((item, i) => (
            <Reveal key={item.hub} delay={(i % 3) * 110} className="h-full">
              <IndustryCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LicenceCertificate() {
  const innerRef = useRef(null);
  const BASE = 'perspective(900px) rotateX(0deg) rotateY(-10deg) rotateZ(0.6deg) translateZ(0px)';
  const onMove = (e) => {
    const el = innerRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    // the part under the cursor is pushed back, so the card tips away from the pointer
    el.style.transition = 'transform 0.12s ease-out';
    el.style.transform = `perspective(900px) rotateX(${(-ny * 9).toFixed(2)}deg) rotateY(${(-10 + nx * 9).toFixed(2)}deg) rotateZ(0.6deg) translateZ(-26px)`;
  };
  const onLeave = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = BASE;
  };
  const rows = [
    ['Company', 'Shanghai Shengqiao Chain Trading Co., Ltd.'],
    ['Location', "Shanghai, People's Republic of China"],
    ['Scope', 'Supply chain, sourcing & international trade'],
    ['Serving', 'Importers across India'],
  ];
  const serif = { fontFamily: "'Times New Roman', 'Liberation Serif', Georgia, 'Noto Serif SC', 'Songti SC', serif" };
  return (
    <div className="w-[440px] max-w-full h-[600px] cursor-default" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div
        ref={innerRef}
        className="relative w-full h-full rounded-[26px] p-[11px]"
        style={{
          transform: BASE,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg,#9a2e24 0%,#84261d 100%)',
          boxShadow: '0 0 0 1.5px #C99A45, 0 50px 90px rgba(0,0,0,0.65), 0 18px 40px rgba(0,0,0,0.45)',
          willChange: 'transform',
        }}
      >
        <div
          className="relative w-full h-full rounded-[16px] overflow-hidden px-6 pt-[34px]"
          style={{ background: 'linear-gradient(180deg,#FAF4E7 0%,#F6EDDC 55%,#F1E5CF 100%)', boxShadow: 'inset 0 2px 10px rgba(90,50,20,0.12)' }}
        >
          <div className="text-center">
            <div style={{ ...serif, color: '#A02F25', fontWeight: 800 }} className="text-[28px] tracking-[0.12em] leading-[1.2]">
              营业执照
            </div>
            <div className="mt-1 font-sans text-[12px] font-semibold uppercase tracking-[0.26em] text-[#8A5A2B]">Business Licence</div>
          </div>

          <div className="mx-auto mt-[22px] w-[60px] h-[60px] rounded-full flex items-center justify-center" style={{ background: '#C9372C', boxShadow: '0 2px 6px rgba(120,30,20,0.35)' }}>
            <div className="w-[38px] h-[38px] rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%,#EDC967 0%,#DBB04C 70%,#C9993F 100%)', boxShadow: 'inset 0 1px 3px rgba(120,80,10,0.4)' }} />
          </div>

          <dl className="mt-4 flex flex-col gap-[9.5px]">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[70px_1fr] gap-x-2.5 items-end">
                <dt className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#8B6B2E] pb-[8px]">{k}</dt>
                <dd style={{ ...serif, color: '#2C241C' }} className="text-[14px] leading-[1.4] pb-[7px] border-b border-dashed border-[#CDBBA0]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <div
            className="absolute left-[16px] bottom-[42px] w-[60px] h-[66px] border border-[#6b6355]"
            style={{ background: 'conic-gradient(#6b6355 25%, #F1E8D6 0 50%, #6b6355 0 75%, #F1E8D6 0) 0 0 / 8px 8px' }}
          />

          <div className="absolute right-[26px] bottom-[30px] w-[122px] h-[122px] rounded-full border-[3px] border-[#C63B30] text-[#C63B30] flex flex-col items-center justify-center rotate-[-18deg] opacity-90">
            <span className="text-[28px] leading-none -mt-1">★</span>
            <span className="font-sans font-bold text-[10.5px] leading-[1.25] tracking-[0.1em] text-center mt-0.5">
              SHANGHAI
              <br />
              SHENGQIAO
              <br />
              TRADING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChinaOffice() {
  const points = [
    ['Registered business licence', ' issued in Shanghai, China'],
    ['Chinese company bank account', ', so payments to factories are safe and traceable'],
    ['Team on the ground', ' for factory visits, quality checks and market trips'],
    ['Indian founder on both sides', ': talk to us in Telugu, Hindi or English'],
  ];
  return (
    <section id="china-office" className="bg-[#0A0A0A] py-[104px]" style={{ scrollMarginTop: NAV_H }}>
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-[580px_1fr] gap-14 items-center">
        <div>
          <Eyebrow className="mb-3">Officially in China</Eyebrow>
          <h2 className="font-display font-extrabold text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.07] tracking-[-0.035em] text-white mb-5 max-w-[560px]">
            Many claim an office in China. <span className="text-[#E1472E]">We have the licence.</span>
          </h2>
          <p className="text-[18px] leading-[1.67] text-[#A1A1AA] mb-[30px]">
            ImportNow operates through its own registered company in Shanghai, <strong className="font-semibold text-white">Shanghai Shengqiao Chain Trading Co., Ltd.</strong> That means we can sign contracts with factories, pay suppliers locally and stand behind every order.
          </p>
          <ul className="space-y-4">
            {points.map(([lead, rest]) => (
              <li key={lead} className="flex items-start gap-[15px] text-[16px] leading-[1.67] text-[#A1A1AA]">
                <span className="w-[26px] h-[26px] rounded-full bg-[#D8301B] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.3l2.3 2.3 4.7-5" />
                  </svg>
                </span>
                <span>
                  <strong className="font-semibold text-white">{lead}</strong>
                  {rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center lg:justify-end lg:pr-5">
          <LicenceCertificate />
        </div>
      </div>
    </section>
  );
}

function TripIcon({ name }) {
  const common = { className: 'w-[18px] h-[18px] shrink-0 mt-[3px] text-[#D8301B]', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    visa: <><rect x="4.5" y="3" width="15" height="18" rx="2.5" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></>,
    hotel: <><path d="M3.5 21V11a8.5 8.5 0 0117 0v10" /><path d="M9 21v-6h6v6" /></>,
    food: <><path d="M3.5 13h17a8.5 8.5 0 01-17 0z" /><path d="M8 4c-1 1.2 1 2 0 3.2M12 3.5c-1 1.2 1 2 0 3.2M16 4c-1 1.2 1 2 0 3.2" /></>,
    translate: <><path d="M3 5h9M7.5 3v2M5 5c.5 3 2.5 5.5 6 7M10.5 5c-.5 3-3 6-7 8" /><path d="M13 20l4-9 4 9M14.4 17h5.2" /></>,
    factory: <><path d="M3 20h18V9l-5 3V8l-5 3V6L8 9v4" /><path d="M3 20V9M8 15h1.5M12.5 15H14M17 15h1" /></>,
    pin: <><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0113 0c0 5.3-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function ChinaTrips({ onNavigate }) {
  const included = [
    ['visa', 'Visa guidance & invitation letter'],
    ['hotel', 'Hotels close to the fair'],
    ['food', 'Indian food daily, veg & non-veg'],
    ['translate', 'Guides & translators'],
    ['factory', 'Factory visits you choose'],
    ['pin', 'Sightseeing between markets'],
  ];
  const cities = ['Guangzhou', 'Shenzhen', 'Yiwu', 'Foshan', 'Macau', 'Glass bridge'];
  const departures = [
    ['Spring', 'Canton Fair · April–May'],
    ['Autumn', 'Canton Fair · October–November'],
  ];
  const card = 'bg-white rounded-[22px] border border-gray-200/80 shadow-[0_2px_14px_rgba(17,19,21,0.04)] px-[31px] py-[27px]';
  return (
    <section id="trips" className="bg-white pt-[111px] pb-[112px]" style={{ scrollMarginTop: NAV_H }}>
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0">
        <SectionHeading
          eyebrow="Business trips to China"
          title="Your business trip doesn't"
          accent="have to feel like work."
          subtitle="Guided trips to the Canton Fair, wholesale markets and factories you choose. Our clients often tell us it felt like a personal trip, not a business tour."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* dark Canton Fair card */}
          <div
            className="relative overflow-hidden rounded-[26px] min-h-[533px] flex flex-col justify-end p-[31px]"
            style={{
              background:
                'radial-gradient(circle at 72% 24%, rgba(190,52,42,0.85) 0%, rgba(140,46,46,0.55) 24%, rgba(80,40,45,0.15) 48%, transparent 62%), linear-gradient(180deg,#3d3c42 0%,#27252b 42%,#0c0c0d 78%)',
            }}
          >
            <svg className="absolute inset-x-0 top-[33%] w-full h-[34%]" viewBox="0 0 560 190" preserveAspectRatio="none" aria-hidden="true">
              <g fill="#1d1428" opacity="0.92">
                <rect x="30" y="120" width="26" height="70" />
                <rect x="70" y="90" width="22" height="100" />
                <polygon points="140,190 140,60 165,30 190,60 190,190" />
                <rect x="215" y="100" width="40" height="90" />
                <rect x="262" y="125" width="30" height="65" />
                <rect x="330" y="90" width="26" height="100" />
                <rect x="360" y="30" width="28" height="160" />
                <rect x="371" y="6" width="5" height="30" />
                <rect x="405" y="75" width="34" height="115" />
                <rect x="445" y="110" width="40" height="80" />
                <rect x="490" y="70" width="50" height="120" />
                <rect x="0" y="150" width="560" height="40" />
              </g>
            </svg>
            <div className="relative">
              <div className="inline-flex items-center gap-3 mb-3 font-sans text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white">
                <span className="w-5 h-[1.5px] bg-white" />
                Canton Fair · Guangzhou
              </div>
              <h3 className="font-display font-extrabold text-[34px] leading-[1.08] tracking-[-0.03em] text-white mb-4">
                Meet factories face to face. We handle everything else.
              </h3>
              <p className="text-[15.5px] leading-[1.6] text-white/85 max-w-[440px] mb-[22px]">
                Walk the world's biggest trade fair with a guide who speaks the language, then visit the factories you shortlist.
              </p>
              <div className="flex flex-wrap gap-[9px] max-w-[480px]">
                {cities.map((c) => (
                  <span key={c} className="px-[13px] h-[29px] inline-flex items-center rounded-full bg-white/10 border border-white/20 text-[14px] font-medium text-white">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="flex flex-col gap-6">
            <div className={card}>
              <h3 className="font-display font-extrabold text-[22px] leading-[1.25] tracking-[-0.02em] text-[#111315] mb-6">What's included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                {included.map(([icon, label]) => (
                  <li key={label} className="flex items-start gap-3 text-[14.5px] leading-[1.65] text-[#4B5563]">
                    <TripIcon name={icon} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${card} flex-1`}>
              <h3 className="font-display font-extrabold text-[22px] leading-[1.25] tracking-[-0.02em] text-[#111315] mb-5">Next departures</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-5">
                {departures.map(([season, when]) => (
                  <div key={season} className="h-[85px] rounded-[14px] bg-[#F4F4F5] border border-gray-200 px-[19px] flex flex-col justify-center">
                    <div className="font-display font-extrabold text-[26px] leading-[1.15] tracking-[-0.02em] text-[#111315]">{season}</div>
                    <div className="text-[13px] leading-[1.5] text-[#4B5563]">{when}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/contact', 'contact', '#contact')}
                className="inline-flex items-center h-12 px-7 rounded-full bg-[#111315] hover:bg-[#26292E] text-white font-semibold text-[15.5px] transition-colors"
              >
                Join the next trip →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="py-24 sm:py-32 bg-white border-y border-gray-200">
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0">
        <SectionHeading
          eyebrow="RECENT DELIVERIES"
          title="Another container unloaded,"
          accent="another happy client."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS_DATA.map((p, idx) => (
            <ProjectCard key={idx} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-[#F8F7F4]">
      <div className="max-w-[1152px] mx-auto px-6 lg:px-0">
        <SectionHeading
          eyebrow="CLIENT STORIES"
          title="Heard from the people"
          accent="who made the trip."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <TestimonialCard key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * PAGES & OVERLAYS (src/pages/*)
 * ==========================================================================*/

function BlogPage({ onOpenArticle }) {
  return (
    <section id="blog" className="py-24 sm:py-32 bg-white border-y border-gray-200">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#E1472E] font-semibold mb-3">Import guides</div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#111315] leading-tight">
              Learn before you import.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenArticle(0)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#E1472E] hover:text-[#C93820] transition-colors self-start sm:self-auto"
          >
            <span>View all articles</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((article, idx) => (
            <article
              key={article.slug}
              onClick={() => onOpenArticle(idx)}
              className="surface-card rounded-2xl p-7 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#6B7280] mb-4">
                  <span className={idx === 1 ? 'text-emerald-700 font-semibold' : 'text-[#E1472E] font-semibold'}>
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-[#111315] group-hover:text-[#E1472E] transition-colors mb-3">
                  {article.title}
                </h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">{article.summary}</p>
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#E1472E]">
                <span>Read guide</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPost({ articleIndex, onClose, onSwitch, onNavigateContact }) {
  if (articleIndex === null) return null;
  const article = ARTICLES_DATA[articleIndex] || ARTICLES_DATA[0];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-gray-200">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E1472E]">
            {article.category} · {article.readTime.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111315] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111315] mb-4">{article.title}</h3>
        <div className="space-y-4 text-[#4B5563] text-sm sm:text-base leading-relaxed">
          {article.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => onSwitch(0)} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 font-mono text-xs text-[#111315]">
              01. Landed Cost
            </button>
            <button type="button" onClick={() => onSwitch(1)} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 font-mono text-xs text-[#111315]">
              02. MOQ vs FCL
            </button>
            <button type="button" onClick={() => onSwitch(2)} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 font-mono text-xs text-[#111315]">
              03. Canton Fair
            </button>
          </div>
          <button
            type="button"
            onClick={onNavigateContact}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111315] hover:bg-[#26292E] text-white font-semibold text-xs"
          >
            <span>Calculate my landed cost</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const IMPORT_OPTIONS = [
    'Furniture & interiors',
    'Electronics & tech',
    'EV & automotive',
    'Lighting',
    'Supermarket & general goods',
    'Machinery',
    'China business trip / Canton Fair',
    'Something else',
  ];
  const BUDGETS = ['Under ₹1 lakh', '₹1–5 lakh', '₹5–25 lakh', '₹25 lakh+'];
  const [form, setForm] = useState({ name: '', city: '', product: IMPORT_OPTIONS[0], quantity: '', budget: BUDGETS[1], details: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text =
      `Hi ImportNow! I'd like a sourcing quote:\n` +
      `• Name: ${form.name}\n• City: ${form.city}\n• Import: ${form.product}\n` +
      `• Quantity: ${form.quantity}\n• Budget: ${form.budget}\n• Details: ${form.details}`;
    window.open(`https://wa.me/919989724320?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const inputCls =
    'w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-[#111315] placeholder-gray-400 text-sm focus:outline-none focus:border-[#E1472E]';
  const labelCls = 'block font-mono text-xs uppercase tracking-wider text-[#374151] font-semibold mb-2';

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white border-t border-gray-200 relative">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#E1472E] font-semibold mb-3">Start importing</div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#111315] leading-tight mb-6">
              Tell us what you want to import. <span className="text-[#E1472E]">We&apos;ll take it from there.</span>
            </h2>
            <p className="text-[#4B5563] text-base leading-relaxed mb-10">
              Share a product, a photo or just an idea. We&apos;ll come back with factory pricing and an estimated landed cost to your city.
            </p>
            <div className="space-y-4">
              <a href="tel:+919989724320" className="surface-card rounded-2xl p-4 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs text-[#6B7280]">Call or WhatsApp</div>
                  <div className="font-display font-bold text-[#111315] text-base sm:text-lg">+91 99897 24320</div>
                </div>
              </a>
              <a href="https://instagram.com/importnow.in" target="_blank" rel="noopener noreferrer" className="surface-card rounded-2xl p-4 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#FEF3F1] border border-[#E1472E]/20 text-[#E1472E] flex items-center justify-center shrink-0 group-hover:bg-[#E1472E] group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs text-[#6B7280]">Instagram</div>
                  <div className="font-display font-bold text-[#111315] text-base sm:text-lg">@importnow.in</div>
                </div>
              </a>
              <div className="surface-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F8F7F4] border border-gray-200 text-[#E1472E] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs text-[#6B7280]">Offices</div>
                  <div className="font-display font-bold text-[#111315] text-base">Hyderabad, India · Shanghai, China</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-[#F8F7F4] rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-5">
              <div className="pb-5 mb-1 border-b border-gray-200">
                <h3 className="font-display font-bold text-2xl text-[#111315]">Get a free sourcing quote</h3>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">No obligation · Sent straight to our WhatsApp desk</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Your name *</label>
                  <input required value={form.name} onChange={set('name')} placeholder="e.g., Rahul" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input required value={form.city} onChange={set('city')} placeholder="e.g., Hyderabad" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>What do you want to import?</label>
                  <select value={form.product} onChange={set('product')} className={inputCls}>
                    {IMPORT_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Approx. quantity</label>
                  <input value={form.quantity} onChange={set('quantity')} placeholder="e.g., 1 pc, 500 units, 1 container" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={`${labelCls} !mb-2.5`}>Budget</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BUDGETS.map((b) => (
                    <label key={b} className="cursor-pointer">
                      <input
                        type="radio"
                        name="budget"
                        value={b}
                        checked={form.budget === b}
                        onChange={() => setForm({ ...form, budget: b })}
                        className="peer sr-only"
                      />
                      <div className="text-center py-3 px-2 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-[#374151] peer-checked:border-[#E1472E] peer-checked:bg-[#FEF3F1] peer-checked:text-[#E1472E] peer-checked:font-semibold transition-all">
                        {b}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Details</label>
                <textarea rows={4} value={form.details} onChange={set('details')} placeholder="Product link, specs, delivery timeline, anything that helps…" className={inputCls} />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Send on WhatsApp</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * MAIN APP (src/App.jsx)
 * ==========================================================================*/

export default function App() {
  const [activeSection, setActiveSection] = useState('services');
  const [activeArticleIdx, setActiveArticleIdx] = useState(null);

  const syncHistoryRoute = (routePath) => {
    try {
      if (window.location.protocol.startsWith('http') && window.history && window.history.replaceState) {
        window.history.replaceState({ route: routePath }, '', routePath);
      }
    } catch (_) {
      // Safe fallback inside sandboxed iframes
    }
  };

  const handleNavigate = (route, section, hashSelector) => {
    setActiveArticleIdx(null);
    setActiveSection(section);
    syncHistoryRoute(route);
    const el = document.querySelector(hashSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenArticle = (idx) => {
    const article = ARTICLES_DATA[idx] || ARTICLES_DATA[0];
    setActiveArticleIdx(idx);
    setActiveSection('blog');
    syncHistoryRoute(`/post?id=${article.slug}`);
  };

  const handleCloseArticle = () => {
    setActiveArticleIdx(null);
    syncHistoryRoute('/blog');
  };

  useEffect(() => {
    const trackedSections = ['services', 'journey', 'industries', 'trips', 'blog', 'contact'];
    const sectionToRoute = {
      services: '/services',
      journey: '/journey',
      industries: '/products',
      trips: '/trips',
      blog: '/blog',
      contact: '/contact',
    };

    const onScroll = () => {
      if (activeArticleIdx !== null) return;
      const scrollMarker = window.scrollY + 180;
      for (const id of trackedSections) {
        const el = document.getElementById(id);
        if (el && scrollMarker >= el.offsetTop && scrollMarker < el.offsetTop + el.offsetHeight) {
          setActiveSection((prev) => {
            if (prev !== id) syncHistoryRoute(sectionToRoute[id]);
            return id;
          });
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeArticleIdx]);

  return (
    <div className="antialiased selection:bg-[#E1472E]/15 selection:text-[#E1472E] bg-[#F7F7F5] text-[#111315]">
      <style>{`
        body {
          background-color: #F7F7F5;
          color: #111315;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .font-display { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 34s linear infinite;
        }

        .surface-card {
          background-color: #FFFFFF;
          border: 1px solid rgba(17, 19, 21, 0.08);
          box-shadow: 0 2px 10px rgba(17, 19, 21, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .surface-card:hover {
          transform: translateY(-2px);
          border-color: rgba(225, 71, 46, 0.28);
          box-shadow: 0 12px 28px rgba(17, 19, 21, 0.06);
        }

        .licence-card {
          background: linear-gradient(145deg, #FFFFFF 0%, #FBF9F5 100%);
          border: 1px solid rgba(225, 71, 46, 0.22);
          box-shadow: 0 16px 40px rgba(17, 19, 21, 0.06);
        }

        details summary::-webkit-details-marker { display: none; }
        details[open] .faq-chevron { transform: rotate(180deg); }

        @keyframes hubIconFloatZoom {
          0%, 100% { transform: scale(1.18) rotate(-4deg) translate(-6px, 5px); }
          50% { transform: scale(1.26) rotate(4deg) translate(4px, -4px); }
        }
        .hub-card .hub-watermark-icon {
          transform-origin: center center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), color 0.35s ease;
        }
        .hub-card:hover .hub-watermark-icon {
          color: rgba(225, 71, 46, 0.18);
          transform: scale(1.22) rotate(-3deg) translate(-5px, 4px);
          animation: hubIconFloatZoom 2.4s ease-in-out infinite;
        }

        .hero {
          position: relative;
          min-height: max(826px, 100vh);
          overflow: hidden;
          background-color: #F7F7F5;
          padding-top: 80px;
          display: flex;
          align-items: center;
        }

        .hero-inner {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 1152px;
          margin: 0 auto;
          padding: 40px 24px 48px;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-inner {
            grid-template-columns: minmax(0, 640px) 1fr;
            padding: 24px 0;
          }
        }
        @media (max-width: 1200px) and (min-width: 1024px) {
          .hero-inner { padding-left: 32px; padding-right: 32px; }
        }

        .hero-content {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 640px;
        }

        .hero-globe-wrapper {
          position: absolute;
          width: 840px;
          height: 840px;
          right: -120px;
          top: 76px;
          z-index: 1;
          pointer-events: none;
          user-select: none;
        }
        .hero-globe {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          pointer-events: auto;
          cursor: grab;
        }
        .hero-globe:active { cursor: grabbing; }
        .hero-globe canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
          border-radius: 50%;
        }

        @media (min-width: 1024px) and (max-width: 1200px) {
          .hero { min-height: max(760px, 100vh); }
          .hero-globe-wrapper { width: 700px; height: 700px; right: -105px; top: 60px; }
        }
        @media (min-width: 1201px) and (max-width: 1439px) {
          .hero { min-height: max(856px, 100vh); }
          .hero-globe-wrapper { width: 800px; height: 800px; right: -115px; top: 56px; }
        }
        @media (min-width: 1440px) {
          .hero-globe-wrapper { width: 860px; height: 860px; right: -115px; top: 56px; }
        }

        .globe-pin-label {
          position: absolute;
          transform: translate(11px, -50%);
          pointer-events: none;
          transition: opacity 0.2s ease;
          will-change: transform, left, top;
          z-index: 20;
        }
        .globe-pin-label.left-side { transform: translate(calc(-100% - 11px), -50%); }
        .globe-pin-label.top-left-side { transform: translate(calc(-100% - 8px), -108%); }
        .globe-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 28px;
          padding: 0 11px;
          border-radius: 20px;
          background: #FFFFFF;
          border: 1px solid rgba(17, 19, 21, 0.08);
          color: #111315;
          font-size: 11.5px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(17, 19, 21, 0.14), 0 1px 3px rgba(17, 19, 21, 0.08);
        }
      `}</style>

      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        <Hero onNavigate={handleNavigate} />
        <Statistics />
        <Services />
        <ShippingJourney />
        <Industries />
        <ChinaOffice />
        <ChinaTrips onNavigate={handleNavigate} />
        <Projects />
        <Testimonials />
        <BlogPage onOpenArticle={handleOpenArticle} />
        <FAQAccordion />
        <ContactPage />
      </main>

      <Footer onNavigate={handleNavigate} />
      <WhatsAppButton />

      <BlogPost
        articleIndex={activeArticleIdx}
        onClose={handleCloseArticle}
        onSwitch={handleOpenArticle}
        onNavigateContact={() => handleNavigate('/contact', 'contact', '#contact')}
      />
    </div>
  );
}