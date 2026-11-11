import { Layers, Wrench, Globe, Wallet, Package, Hammer, Building2, GitMerge, TrendingUp } from 'lucide-react';

// One entry per service page. The key is the route (#/business-expansion-loans).
// To add another service, copy an entry, change the text and link it from the nav.
// NOTE: the "faq" and "process" text is general guidance; please review it against your real policies.
export const services = {
  '/business-expansion-loans': {
    eyebrow: 'Services',
    title: 'Business Expansion Loans',
    intro:
      'Empower your growing business with our Business Expansion Loans, designed to provide the capital you need for scaling operations, upgrading equipment, or entering new markets. Get flexible terms and competitive rates to help you take your business to the next level.',
    chips: ['Flexible terms', 'Competitive rates', 'Built for long-term growth'],
    heroVisual: 'growth',
    visualTitle: 'Growth, illustrated',
    pillarsHeading: 'Capital built for expansion.',
    pillars: [
      { icon: Layers, title: 'Scaling operations', text: 'Capital to grow your capacity and extend your operations as demand rises.' },
      { icon: Wrench, title: 'Upgrading equipment', text: 'Fund the purchase or upgrade of the equipment your business needs to move forward.' },
      { icon: Globe, title: 'Entering new markets', text: 'Support for widening your footprint and reaching customers in new markets.' }
    ],
    build: {
      label: 'BUILT FOR GROWTH',
      heading: 'Fuel the growth of your business.',
      paragraphs: [
        'At FINEX.PH our Business Expansion Loan is specifically designed to fuel the growth of your business by providing capital for scaling operations, purchasing new equipment, or entering new markets. Unlike other general-purpose loans, this loan focuses on helping businesses expand their footprint with flexible terms tailored to long-term growth strategies.'
      ],
      diagram: { type: 'roadmap', items: ['Scale operations', 'Upgrade equipment', 'Enter new markets'] }
    },
    compare: {
      label: 'HOW IT DIFFERS',
      heading: 'Made for strategic growth.',
      paragraphs: [
        'In contrast, other loans, such as MSME Financing or Corporate Loans, may serve broader purposes like managing working capital, addressing short-term needs, or funding specific projects. While these loans offer crucial support for various financial requirements, the Business Expansion Loan is uniquely structured to support the strategic growth and scaling of your enterprise.'
      ],
      columns: ['Business Expansion Loan', 'MSME Financing / Corporate Loans'],
      rows: [
        { label: 'Main focus', a: 'Strategic growth and scaling of your enterprise', b: 'Broader financial needs across the business' },
        { label: 'Typically used for', a: 'Scaling operations, new equipment, entering new markets', b: 'Working capital, short-term needs, or specific projects' },
        { label: 'Planning horizon', a: 'Long-term growth strategies', b: 'Day-to-day needs or a defined project' },
        { label: 'Terms', a: 'Flexible, tailored to long-term growth', b: 'Depends on the loan type' }
      ]
    },
    faq: [
      { q: 'What can I use a Business Expansion Loan for?', a: 'It is designed for scaling operations, purchasing or upgrading equipment, and entering new markets.' },
      { q: 'How is it different from MSME Financing or Corporate Loans?', a: 'Those loans can cover broader needs such as working capital, short-term needs or specific projects. The Business Expansion Loan is structured around the long-term growth and scaling of your business.' },
      { q: 'Are the terms flexible?', a: 'Yes. Terms are flexible and tailored to long-term growth strategies. Contact us to discuss what would work for your business.' },
      { q: 'How do I get started?', a: 'Use our Contact Us page, call or message us, and our team will guide you through the next steps.' }
    ],
    cta: {
      label: 'READY TO GROW?',
      heading: 'Take your business to the next level.',
      text: 'Talk to the FINEX.PH team about how a Business Expansion Loan can fit your growth plans.'
    }
  },

  '/msme-financing': {
    eyebrow: 'Services',
    title: 'MSME Financing',
    intro:
      'Tailored specifically for Micro, Small, and Medium Enterprises, our MSME Financing offers accessible funding solutions to support working capital, inventory purchase, or business improvements. With fast approval and flexible repayment options, we make financing easy for small businesses.',
    chips: ['Fast approval', 'Flexible repayment', 'Accessible funding'],
    heroVisual: 'store',
    visualTitle: 'Small business, big momentum',
    pillarsHeading: 'Funding for the everyday needs of your business.',
    pillars: [
      { icon: Wallet, title: 'Working capital', text: 'Keep day-to-day operations running smoothly, from suppliers and payroll to rent and utilities.' },
      { icon: Package, title: 'Inventory purchase', text: 'Stock up on the products you need to meet customer demand and never miss a sale.' },
      { icon: Hammer, title: 'Business improvements', text: 'Upgrade your space, tools or processes so you can serve your customers better.' }
    ],
    build: {
      label: 'KEEP CASH FLOWING',
      heading: 'Financing that keeps small businesses moving.',
      paragraphs: [
        'Small businesses run on cash flow. Our MSME Financing is built to keep that cycle turning, so you can restock, pay your people and suppliers, and invest in improvements without waiting on slow, complicated processes.',
        'With fast approval and flexible repayment options, we make financing easy for small businesses, so you can spend less time on paperwork and more time on your customers.'
      ],
      diagram: { type: 'cycle', items: ['Buy inventory', 'Sell & serve', 'Collect payments', 'Reinvest'] }
    },
    idealFor: {
      label: "WHO IT'S FOR",
      heading: 'Made for Micro, Small and Medium Enterprises.',
      items: [
        { title: 'Micro enterprises', text: 'Home-based and very small businesses ready to take their next step.' },
        { title: 'Small enterprises', text: 'Growing shops, studios and service businesses with steady customers.' },
        { title: 'Medium enterprises', text: 'Established businesses that need flexible funding to keep moving forward.' }
      ]
    },
    faq: [
      { q: 'What can I use MSME Financing for?', a: 'It supports working capital, inventory purchases and business improvements.' },
      { q: 'How fast is approval?', a: 'MSME Financing is designed for fast approval. The exact timeline depends on your application and documents, and our team will keep you updated along the way.' },
      { q: 'What repayment options are available?', a: 'We offer flexible repayment options. Contact us to talk about a schedule that fits your business cash flow.' },
      { q: 'Who can apply?', a: 'MSME Financing is tailored for Micro, Small and Medium Enterprises. Reach out and our team will help you check what fits your business.' }
    ],
    cta: {
      label: 'SMALL BUSINESS, BIG PLANS',
      heading: 'Let’s keep your business moving.',
      text: 'Tell us what your business needs and the FINEX.PH team will guide you to the right financing.'
    }
  },

  '/corporate-financing': {
    eyebrow: 'Services',
    title: 'Corporate Financing Solutions',
    intro:
      'For large enterprises, our Corporate Financing Solutions provide comprehensive lending options for major projects, mergers, and acquisitions. Whether you’re expanding operations or managing large-scale investments, we offer customized financial products to suit your corporation’s needs.',
    chips: ['Customized products', 'Major projects', 'Mergers & acquisitions'],
    heroVisual: 'skyline',
    visualTitle: 'Financing at enterprise scale',
    pillarsHeading: 'Comprehensive lending for large enterprises.',
    pillars: [
      { icon: Building2, title: 'Major projects', text: 'Lending options built for the scale and complexity of large projects.' },
      { icon: GitMerge, title: 'Mergers & acquisitions', text: 'Financing to support mergers and acquisitions that move your corporation forward.' },
      { icon: TrendingUp, title: 'Large-scale investments', text: 'Capital for expanding operations and managing large-scale investments.' }
    ],
    build: {
      label: 'TAILORED TO YOUR CORPORATION',
      heading: 'Financial products designed around you.',
      paragraphs: [
        'Large enterprises have large ambitions, and the financing behind them has to keep pace. Our Corporate Financing Solutions provide comprehensive lending options so your corporation can take on major projects with confidence.',
        'Whether you’re expanding operations or managing large-scale investments, we offer customized financial products to suit your corporation’s needs, built around your goals rather than a one-size-fits-all package.'
      ],
      diagram: { type: 'hub', items: ['Major projects', 'Mergers', 'Acquisitions', 'Expansion'] }
    },
    idealFor: {
      label: "WHO IT'S FOR",
      heading: 'Built for corporations with big goals.',
      items: [
        { title: 'Large enterprises', text: 'Established corporations that need comprehensive, customized lending.' },
        { title: 'Corporations pursuing M&A', text: 'Businesses planning mergers or acquisitions that need a financing partner.' },
        { title: 'Groups funding major projects', text: 'Teams taking on large-scale projects and investments.' }
      ]
    },
    faq: [
      { q: 'What can Corporate Financing Solutions fund?', a: 'Major projects, mergers and acquisitions, expansion of operations and large-scale investments.' },
      { q: 'Are the financial products customized?', a: 'Yes. We offer customized financial products to suit your corporation’s needs rather than a one-size-fits-all package.' },
      { q: 'Who is this for?', a: 'It is designed for large enterprises. If you are unsure which financing fits, our team can help you compare options.' },
      { q: 'How do I start a conversation?', a: 'Contact us through the Contact Us page, by phone, or on WhatsApp or Viber, and our team will take it from there.' }
    ],
    cta: {
      label: 'LET’S TALK',
      heading: 'Financing shaped around your corporation.',
      text: 'Speak with the FINEX.PH team about your next major project or investment.'
    }
  }
};