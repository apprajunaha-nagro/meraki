import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MessageCircle, Mail, Phone, MapPin, Sparkles, Maximize2, X } from 'lucide-react';
import { Button, Input, Textarea, Accordion, Breadcrumb, Divider } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { products, categories, curatedEdits, blogPosts, faqItems } from '@/lib/mockData';
import { useState } from 'react';

// ─── New Arrivals Page ────────────────────────────────────────────────────────

export function NewArrivalsPage() {
  const newArrivals = products.filter((p) => p.is_new_arrival);
  return (
    <div className="header-offset pb-16">
      <div className="bg-gradient-brand py-16 text-center mb-10">
        <p className="section-subtitle mb-3">Fresh from the atelier</p>
        <h1 className="font-serif text-5xl text-charcoal">New Arrivals</h1>
        <p className="text-taupe mt-3 max-w-md mx-auto">The latest additions to the Meraki collection — handcrafted with care, designed for you</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Sale Page ────────────────────────────────────────────────────────────────

export function SalePage() {
  const saleProducts = products.filter((p) => p.mrp > p.base_price);
  return (
    <div className="header-offset pb-16">
      <div className="bg-rust text-white py-14 text-center mb-10">
        <p className="nav-label text-white/70 mb-2">Limited time</p>
        <h1 className="font-serif text-5xl">The Sale</h1>
        <p className="mt-3 text-white/80">Up to 30% off on select styles — while stocks last</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {saleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Edit Page (Shop by Edit) ─────────────────────────────────────────────────

export function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const edit = curatedEdits.find((e) => e.slug === slug) ?? curatedEdits[0];
  const editProducts = products.filter((p) => edit.product_ids && edit.product_ids.includes(p.id));

  return (
    <div className="header-offset pb-16">
      <div className="relative h-72 sm:h-80 overflow-hidden">
        <img src={edit.image} alt={edit.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/50 flex flex-col items-center justify-center text-center px-4">
          <p className="nav-label text-white/80 mb-2">Curated Edit</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal">{edit.title}</h1>
          <p className="text-white/90 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">{edit.subtitle}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-secondary">
          <div>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shop by Edit', href: '/' }, { label: edit.title }]} />
            <p className="text-xs text-taupe mt-1">{editProducts.length} curated pieces available</p>
          </div>
        </div>

        {editProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {editProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-charcoal font-serif mb-2">No products found in this edit</p>
            <p className="text-sm text-taupe mb-6">Explore our main collections to discover more pieces</p>
            <Link to="/collections"><Button variant="outline">View All Collections</Button></Link>
          </div>
        )}

        <div className="mt-12 text-center pt-8 border-t border-secondary">
          <Link to="/collections"><Button variant="outline" rightIcon={<ArrowRight size={14} />}>Browse All Collections</Button></Link>
        </div>
      </div>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────

export function AboutPage() {
  return (
    <div className="header-offset pb-16">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1594938298603-c8148c4b4871?w=1600&q=80"
          alt="Kritika in her atelier"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent flex flex-col justify-end p-10">
          <p className="nav-label text-white/70 mb-2">Our Story</p>
          <h1 className="font-serif text-5xl text-white font-light">About Meraki by Kritika</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-serif text-3xl text-charcoal mb-5">The Woman Behind the Label</h2>
            <p className="text-taupe leading-relaxed mb-4">
              Kritika grew up surrounded by the rich craft traditions of Jharkhand — Tussar silk from the forests, Dokra metalwork from tribal artisans, and the vibrant textile markets of Dhanbad. From childhood, she was captivated by the stories fabrics could tell.
            </p>
            <p className="text-taupe leading-relaxed mb-4">
              After studying fashion design and working with established labels in Mumbai, Kritika returned to her roots in 2020 and founded Meraki by Kritika — a label that would honour India's handloom and craft heritage while making it accessible and wearable for modern Indian women.
            </p>
            <p className="text-taupe leading-relaxed">
              "Meraki" — a Greek word meaning to do something with soul, creativity, and love — perfectly captures Kritika's design philosophy. Every piece carries a fragment of her heart and the hands that made it.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative group">
              <div className="w-84 h-84 sm:w-[400px] sm:h-[400px] rounded-full overflow-hidden border-4 border-primary/20 shadow-[0_25px_60px_rgba(140,91,110,0.3)] bg-white transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/meraki-story-logo.jpg"
                  alt="Meraki by Kritika Official Logo Emblem"
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white shadow-card rounded-full px-6 py-3 border border-primary/20 text-center">
                <p className="font-serif text-xl text-primary font-bold">4+ Years</p>
                <p className="text-[10px] uppercase tracking-wider text-taupe font-medium">Crafting Meraki</p>
              </div>
            </div>
          </div>
        </div>

        <Divider gold className="mb-16" />

        {/* Values */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-charcoal">What Drives Us</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Craft First', desc: 'We source directly from artisan clusters and weaver cooperatives, ensuring fair wages and preserving endangered textile traditions.' },
            { title: 'Slow Fashion', desc: 'We produce in limited quantities, never rushing the creative process. Each piece is designed to last seasons, not just one wear.' },
            { title: 'Rooted in India', desc: 'Our design language draws from Indian art, architecture, and the natural landscapes of Jharkhand — where our story began.' },
          ].map((val) => (
            <div key={val.title} className="text-center p-6 bg-white rounded-brand shadow-soft">
              <h3 className="font-serif text-xl text-charcoal mb-3">{val.title}</h3>
              <p className="text-taupe text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/craftsmanship">
            <Button variant="outline" rightIcon={<ArrowRight size={14} />}>Explore Our Craftsmanship</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Craftsmanship Page ───────────────────────────────────────────────────────

// ─── Craftsmanship Page ───────────────────────────────────────────────────────

export function CraftsmanshipPage() {
  const crafts = [
    {
      title: 'Chanderi Silk Pit-Loom Weaving',
      region: 'Chanderi, Madhya Pradesh',
      timeToCreate: '14-21 Days per saree',
      technique: 'Gossamer Tissue Pit Loom',
      image: '/crafts/chanderi_weaving.jpg',
      desc: 'Woven in the historic town of Chanderi for over 700 years, this gossamer-light silk is created by master weavers using traditional pit looms. Meraki uses authentic Chanderi tissue laced with zari borders, offering lightweight elegance for weddings and festive evenings.',
      highlights: ['Lightweight silk-cotton blend', 'Authentic metallic zari border', 'Hand-woven on heirloom pit looms'],
    },
    {
      title: 'Banarasi Zari & Brocade Handloom',
      region: 'Varanasi, Uttar Pradesh',
      timeToCreate: '30-45 Days per bridal ensemble',
      technique: 'Kadwa & Tanchoi Weave',
      image: '/crafts/banarasi_zari.jpg',
      desc: 'The hallowed looms of Varanasi produce silk brocades interlaced with real gold and silver zari thread. Our bridal sarees and royal lehengas feature authentic Banarasi weaves sourced directly from weaver cooperatives in Varanasi, preserving age-old royal court aesthetics.',
      highlights: ['Pure Mulberry Silk base', 'Real gold & silver metallic zari', 'Kadwa hand-cut motif technique'],
    },
    {
      title: 'Jharkhand Tussar Silk Harvesting',
      region: 'Dhanbad & Santhal Pargana, Jharkhand',
      timeToCreate: '12 Days per garment',
      technique: 'Wild Silk Reel & Hand-Spinning',
      image: '/crafts/tussar_silk.jpg',
      desc: 'Harvested from wild silkworms in Jharkhand’s lush Sal forests, Tussar has a rich golden luster and distinct slub texture. As a label rooted in Dhanbad, Kritika honors local tribal artisans by showcasing pure Tussar silk across our fusion jackets and formal kurtis.',
      highlights: ['Wild forest-harvested silk', 'Breathable organic texture', 'Deeply rooted in Jharkhand heritage'],
    },
    {
      title: 'Bandhani & Tie-Dye Artistry',
      region: 'Kutch & Jamnagar, Gujarat',
      timeToCreate: '18 Days per dupatta',
      technique: 'Hand-Tied Dot Dyeing',
      image: '/crafts/bandhani_dyeing.jpg',
      desc: 'Bandhani involves hand-tying thousands of tiny fabric knots with thread before immersing the silk into natural dye vats. Each dot reveals a sunburst pattern. Meraki incorporates rich Rani Pink and Saffron Bandhani into festive lehenga dupattas and jacket linings.',
      highlights: ['Over 10,000 hand-tied knots per piece', 'Vibrant natural color vats', 'Intricate Ekdali & Rai Bandha patterns'],
    },
    {
      title: 'Zardozi & Dabka Gold Metalwork',
      region: 'Lucknow & Old Delhi Royal Ateliers',
      timeToCreate: '60+ Hours of hand embroidery',
      technique: '3D Metallic Needlework',
      image: '/crafts/zardozi_embroidery.jpg',
      desc: 'Derived from Persian words "Zar" (Gold) and "Dozi" (Embroidery), Zardozi utilizes coiled metallic threads, pearls, and cut beads sewn onto heavy velvet or raw silk. Our master embroiderers hand-stitch elaborate floral vines onto lehenga blouses and royal capes.',
      highlights: ['Antique gold dabka wire', 'Hand-stitched faux pearls & sequins', 'Worked on traditional wooden Adda frames'],
    },
    {
      title: 'Bolpur Kantha Running Stitch Embroidery',
      region: 'Bolpur & Birbhum, West Bengal',
      timeToCreate: '10-15 Days per co-ord',
      technique: 'Hand-Stitched Running Kantha',
      image: '/crafts/kantha_stitching.jpg',
      desc: 'Originating as a sacred folk art where Bengali women layered vintage saris with rhythmic running stitches, Kantha transforms plain fabric into textured canvases. Our contemporary co-ord sets and everyday kurtis feature geometric Kantha motifs crafted by rural women artisans.',
      highlights: ['100% hand-executed running stitch', 'Empowers women artisan circles', 'Unique organic texture and movement'],
    },
    {
      title: 'Jaipur Gotapatti Foil & Dori Work',
      region: 'Jaipur, Rajasthan',
      timeToCreate: '25 Days per flared skirt',
      technique: 'Appliqué Metallic Foil Cutwork',
      image: '/crafts/gotapatti_work.jpg',
      desc: 'A royal Rajasthani embellishment where golden ribbons (Gota) are cut into intricate leaf shapes and appliquéd onto silk or organza. Meraki’s festive collection relies on lightweight Gota Patti work to give maximum shine with effortless drape.',
      highlights: ['Real gold & silver foiled ribbon', 'Lightweight for ease of movement', 'Hand-stitched Gota floral leaves'],
    },
    {
      title: 'Barmer Hand-Block Printing & Natural Dyes',
      region: 'Barmer & Bagru, Rajasthan',
      timeToCreate: '7 Days per printed bolt',
      technique: 'Teakwood Block Stamping',
      image: '/crafts/block_printing.jpg',
      desc: 'Master printers press hand-carved wooden blocks onto natural cotton and linen using organic indigo, madder root, and turmeric dyes. Our everyday summer dresses and relaxed co-ords feature geometric block motifs stamped with precision.',
      highlights: ['Hand-carved teakwood blocks', '100% eco-friendly plant dyes', 'Zero toxic chemical processing'],
    },
  ];

  return (
    <div className="header-offset pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-brand py-20 text-center relative overflow-hidden border-b border-secondary/40">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <p className="section-subtitle mb-3">Craft Heritage · Made With Soul</p>
          <h1 className="font-serif text-5xl lg:text-6xl text-charcoal font-light mb-4">Our Craftsmanship Atelier</h1>
          <p className="text-taupe text-base leading-relaxed">
            At Meraki by Kritika, every garment is a living piece of Indian art. We collaborate directly with master weavers, dyers, and embroiderers across 6 Indian states to preserve century-old handloom traditions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-16">
        {/* Craft Process Lifecycle */}
        <div className="mb-20 bg-white p-8 rounded-brand shadow-soft border border-secondary">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-charcoal">The Meraki Craft Lifecycle</h2>
            <p className="text-taupe text-xs uppercase tracking-widest mt-1">From raw yarn to finished heirloom</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Yarn Sourcing', desc: 'Direct sourcing of pure Mulberry silk, Jharkhand Tussar, and organic cotton from weaver cooperatives.' },
              { step: '02', title: 'Pit Loom Weaving', desc: 'Hand-weaving by master artisans using traditional wooden looms passed through generations.' },
              { step: '03', title: 'Hand Embroidery', desc: 'Intricate Zardozi, Kantha, or Gota Patti needlework executed on wooden Adda frames.' },
              { step: '04', title: 'Quality & Tailoring', desc: 'Rigorous hand-inspection and custom fitting by our master tailors in Dhanbad.' },
            ].map((st) => (
              <div key={st.step} className="p-4 bg-cream-alt rounded-brand border border-secondary/50 relative">
                <span className="text-3xl font-serif font-bold text-primary/30 block mb-2">{st.step}</span>
                <h3 className="font-serif text-base text-charcoal font-semibold mb-1">{st.title}</h3>
                <p className="text-taupe text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 8 Craft Chapters */}
        <div className="space-y-20">
          {crafts.map((craft, i) => (
            <div key={craft.title} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={`relative group ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="overflow-hidden rounded-brand shadow-elevated border border-secondary">
                  <img
                    src={craft.image}
                    alt={craft.title}
                    className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 text-xs font-semibold text-primary shadow-sm">
                  📍 {craft.region}
                </div>
              </div>

              <div className={i % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-primary">{craft.technique}</span>
                  <span className="text-taupe/40">•</span>
                  <span className="text-xs text-taupe">⏱️ {craft.timeToCreate}</span>
                </div>
                <h2 className="font-serif text-3xl text-charcoal mb-4">{craft.title}</h2>
                <p className="text-taupe leading-relaxed text-sm mb-6">{craft.desc}</p>

                <div className="bg-cream-alt p-4 rounded-brand border border-secondary space-y-2">
                  <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">Craft Signature Details:</p>
                  {craft.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-taupe">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Lookbook Page ────────────────────────────────────────────────────────────

interface LookbookItem {
  id: number;
  title: string;
  category: 'festive' | 'linen' | 'velvet' | 'fusion';
  campaign: string;
  description: string;
  image: string;
  productSlug?: string;
  productName?: string;
  price?: number;
}

const lookbookData: LookbookItem[] = [
  {
    id: 1,
    title: "Sovereign Crimson Heritage",
    category: "velvet",
    campaign: "Royal Zardozi 2026",
    description: "Deep maroon velvet lehenga detailed with handcrafted Zardozi wire needlework and kalidar flare.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=90",
    productSlug: "mehrunissa-royal-velvet-bridal-lehenga",
    productName: "Mehrunissa Royal Velvet Bridal Lehenga",
    price: 24999
  },
  {
    id: 2,
    title: "Minimalist Indigo Linen",
    category: "linen",
    campaign: "Earth & Handloom 2026",
    description: "Breezy hand-tied Shibori pattern co-ord set in 100% pure organic cotton mulmul.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=90",
    productSlug: "vaidehi-royal-blue-linen-coord-set",
    productName: "Vaidehi Royal Blue Linen Co-ord Set",
    price: 2950
  },
  {
    id: 3,
    title: "Champagne Silk Elegance",
    category: "festive",
    campaign: "Festive Soirée",
    description: "Handloom Chanderi silk shirt-style co-ord adorned with multi-color floral needlework.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&q=90",
    productSlug: "kaveri-embroidered-silk-shirt-coord-set",
    productName: "Kaveri Embroidered Silk Shirt Co-ord Set",
    price: 4600
  },
  {
    id: 4,
    title: "Terracotta Earth Tones",
    category: "linen",
    campaign: "Everyday Soul",
    description: "Inspired by the warm clay soils of Jharkhand — pure breathable handloom linen drape.",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&q=90",
    productSlug: "meera-maroon-embroidered-beige-linen-coord-set",
    productName: "Meera Maroon Embroidered Beige Linen Co-ord Set",
    price: 3400
  },
  {
    id: 5,
    title: "Sage Botanical Whisper",
    category: "fusion",
    campaign: "Modern Fusion 2026",
    description: "Soft sage green silk shirt tunic decorated with delicate hand-printed leaf motifs.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=90",
    productSlug: "maitreyi-olive-leaf-print-silk-shirt-coord-set",
    productName: "Maitreyi Olive Leaf Print Silk Shirt Co-ord Set",
    price: 3850
  },
  {
    id: 6,
    title: "Royal Obsidian Tailoring",
    category: "fusion",
    campaign: "Atelier Couture",
    description: "Chic obsidian black lapel shirt co-ord set with relaxed wide-leg trousers.",
    image: "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?w=1200&q=90",
    productSlug: "rhea-paisley-cape-palazzo-3-piece-coord-set",
    productName: "Rhea Paisley Cape & Palazzo 3-Piece Co-ord Set",
    price: 4200
  },
  {
    id: 7,
    title: "Gaji Silk Bandhani Heritage",
    category: "festive",
    campaign: "Royal Zardozi 2026",
    description: "Royal crimson hues embellished with authentic hand-tied Bandhani patterns.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=90",
    productSlug: "noor-bandhani-rani-pink-lehenga",
    productName: "Noor Bandhani Rani Pink Lehenga",
    price: 14999
  },
  {
    id: 8,
    title: "Plum Velvet Opulence",
    category: "velvet",
    campaign: "Atelier Couture",
    description: "Luxurious silk velvet co-ord set with hand-embroidered metallic threadwork.",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&q=90",
    productSlug: "vartika-abstract-pastel-marble-print-silk-coord-set",
    productName: "Vartika Pastel Marble Print Silk Co-ord Set",
    price: 4400
  },
  {
    id: 9,
    title: "Marigold Ikat Celebration",
    category: "linen",
    campaign: "Earth & Handloom 2026",
    description: "Joyful marigold yellow double-breasted jacket co-ord set with wooden button accents.",
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06a95f5?w=1200&q=90",
    productSlug: "padmini-yellow-double-breasted-jacket-coord-set",
    productName: "Padmini Yellow Double-Breasted Jacket Co-ord Set",
    price: 3200
  }
];

export function LookbookPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'festive' | 'linen' | 'velvet' | 'fusion'>('all');
  const [selectedItem, setSelectedItem] = useState<LookbookItem | null>(null);

  const filteredItems = activeTab === 'all' 
    ? lookbookData 
    : lookbookData.filter((item) => item.category === activeTab);

  return (
    <div className="header-offset pb-20 bg-warm-cream/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blush-peach/30 via-warm-cream to-transparent py-16 px-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-widest mb-4">
          <Sparkles size={13} /> Seasonal Editorial 2026
        </span>
        <h1 className="font-serif text-5xl lg:text-6xl text-charcoal mb-4 tracking-tight">
          The Editorial Lookbook
        </h1>
        <p className="text-taupe text-base lg:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Soulful stories of craftsmanship — handcrafted with traditional Indian motifs, natural handloom drapes, and modern ease in Dhanbad, Jharkhand.
        </p>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: 'all', label: 'All Editorials' },
            { id: 'festive', label: 'Festive Heritage' },
            { id: 'linen', label: 'Earth & Handloom' },
            { id: 'velvet', label: 'Royal Velvet' },
            { id: 'fusion', label: 'Modern Fusion' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-charcoal text-white shadow-md'
                  : 'bg-white text-charcoal/70 border border-secondary-deep hover:border-primary hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-secondary/50 flex flex-col"
            >
              {/* Image Container with Zoom Trigger */}
              <div 
                className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-gold mb-1 font-mono">
                    {item.campaign}
                  </span>
                  <h3 className="font-serif text-2xl font-medium mb-2">{item.title}</h3>
                  <div className="flex items-center text-xs text-white/90 gap-1 mt-1">
                    <Maximize2 size={14} /> Click to expand editorial view
                  </div>
                </div>
                <span className="absolute top-4 left-4 bg-charcoal/80 text-white backdrop-blur-md text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-mono">
                  {item.campaign}
                </span>
              </div>

              {/* Editorial Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h2 className="font-serif text-xl text-charcoal mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-taupe text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {item.productSlug && (
                  <div className="pt-4 border-t border-secondary flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-taupe font-medium">{item.productName}</p>
                      {item.price && (
                        <p className="font-serif font-semibold text-charcoal text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                    <Link
                      to={`/product/${item.productSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider group/link"
                    >
                      Shop Look <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Designer Statement Quote Box */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="bg-white rounded-2xl p-8 lg:p-12 border border-secondary shadow-soft text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-gold"></div>
          <p className="section-subtitle mb-3">Behind The Atelier</p>
          <blockquote className="font-serif text-2xl lg:text-3xl text-charcoal italic leading-relaxed mb-6">
            “At Meraki, we design for the modern Indian woman who cherishes her roots while embracing effortless comfort. Every drape is made with soul.”
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-serif text-primary font-bold text-base">
              KS
            </div>
            <div className="text-left">
              <p className="font-serif font-semibold text-charcoal text-sm">Kritika Sharma</p>
              <p className="text-xs text-taupe">Founder & Creative Director — Dhanbad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-charcoal/60 text-white flex items-center justify-center hover:bg-charcoal transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="md:w-1/2 bg-charcoal aspect-[3/4] md:aspect-auto">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:w-1/2 p-8 flex flex-col justify-between bg-white overflow-y-auto">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-widest font-mono mb-3">
                  {selectedItem.campaign}
                </span>
                <h3 className="font-serif text-3xl text-charcoal mb-3">{selectedItem.title}</h3>
                <p className="text-taupe text-base leading-relaxed mb-6">
                  {selectedItem.description}
                </p>
              </div>

              {selectedItem.productSlug && (
                <div className="p-5 bg-warm-cream/50 rounded-xl border border-secondary">
                  <p className="text-xs text-taupe uppercase tracking-wider mb-1 font-mono">Featured Ensemble</p>
                  <h4 className="font-serif text-lg text-charcoal font-semibold mb-1">{selectedItem.productName}</h4>
                  {selectedItem.price && (
                    <p className="text-primary font-serif font-bold text-xl mb-4">
                      ₹{selectedItem.price.toLocaleString('en-IN')}
                    </p>
                  )}
                  <Link
                    to={`/product/${selectedItem.productSlug}`}
                    onClick={() => setSelectedItem(null)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-soft"
                  >
                    View Product Details <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Blog Pages ───────────────────────────────────────────────────────────────

export function BlogPage() {
  return (
    <div className="header-offset pb-16">
      <div className="py-14 text-center">
        <p className="section-subtitle mb-3">Stories, tips & craft</p>
        <h1 className="font-serif text-5xl text-charcoal">The Journal</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
              <div className="overflow-hidden rounded-brand aspect-[4/3] mb-4">
                <img src={post.featured_image} alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="flex gap-2 mb-2 flex-wrap">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-primary uppercase tracking-wider">{tag}</span>
                ))}
              </div>
              <h2 className="font-serif text-xl text-charcoal group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-taupe text-sm mt-2 line-clamp-3">{post.excerpt}</p>
              <p className="text-xs text-taupe mt-3">{post.author} · {new Date(post.published_at).toLocaleDateString('en-IN')}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="header-offset pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-14">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">We'd love to hear from you</p>
          <h1 className="font-serif text-4xl text-charcoal">Contact Us</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-brand shadow-soft p-6">
              <h2 className="font-serif text-xl text-charcoal mb-5">Send a Message</h2>
              {sent ? (
                <div className="text-center py-8">
                  <p className="font-serif text-2xl text-charcoal mb-2">Thank you! 🙏</p>
                  <p className="text-taupe">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <Input label="Your Name" placeholder="Ananya Krishnan" required />
                  <Input label="Email" type="email" placeholder="you@email.com" required />
                  <Input label="Phone" type="tel" placeholder="+91 9876543210" />
                  <Textarea label="Message" placeholder="Tell us how we can help..." required />
                  <Button fullWidth type="submit">Send Message</Button>
                </form>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-5">Get in Touch</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-charcoal text-sm">Studio Address</p>
                    <p className="text-taupe text-sm">Dhanbad, Jharkhand — 826001, India</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-primary flex-shrink-0" />
                  <a href="tel:+919900000000" className="text-sm text-taupe hover:text-primary transition-colors">+91 99XXX XXXXX</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-primary flex-shrink-0" />
                  <a href="mailto:hello@merakibykritika.in" className="text-sm text-taupe hover:text-primary transition-colors">hello@merakibykritika.in</a>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/919900000000?text=Hi%20Meraki!%20I%20have%20a%20query."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3.5 rounded-brand hover:bg-[#1ebe5d] transition-colors font-sans font-medium"
            >
              <MessageCircle size={20} />
              Chat with us on WhatsApp
            </a>
            <div className="bg-cream rounded-brand p-5">
              <p className="font-medium text-charcoal text-sm mb-2">Studio Hours</p>
              <p className="text-taupe text-sm">Monday – Saturday: 10am – 6pm IST</p>
              <p className="text-taupe text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Page ─────────────────────────────────────────────────────────────────

export function FaqPage() {
  return (
    <div className="header-offset pb-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-14">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">Got questions?</p>
          <h1 className="font-serif text-4xl text-charcoal">Frequently Asked Questions</h1>
        </div>
        <div className="space-y-8">
          {faqItems.map((section) => (
            <div key={section.category}>
              <h2 className="font-serif text-xl text-charcoal mb-3">{section.category}</h2>
              <div className="bg-white rounded-brand shadow-soft px-5">
                <Accordion
                  items={section.questions.map((faq, i) => ({
                    id: `${section.category}-${i}`,
                    title: faq.q,
                    content: <p>{faq.a}</p>,
                  }))}
                  allowMultiple
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center bg-secondary-tint rounded-brand p-6">
          <p className="font-serif text-xl text-charcoal mb-2">Still have questions?</p>
          <p className="text-taupe text-sm mb-4">We're happy to help — reach out to us directly</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/contact"><Button variant="outline">Contact Us</Button></Link>
            <a href="https://wa.me/919900000000" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">WhatsApp Us</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Size Guide Page ──────────────────────────────────────────────────────────

export function SizeGuidePage() {
  const sizeData = [
    { size: 'XS', bust: '32"', waist: '25"', hips: '35"', indian: '34' },
    { size: 'S', bust: '34"', waist: '27"', hips: '37"', indian: '36' },
    { size: 'M', bust: '36"', waist: '29"', hips: '39"', indian: '38' },
    { size: 'L', bust: '38"', waist: '31"', hips: '41"', indian: '40' },
    { size: 'XL', bust: '40"', waist: '33"', hips: '43"', indian: '42' },
    { size: 'XXL', bust: '42"', waist: '35"', hips: '45"', indian: '44' },
  ];
  return (
    <div className="header-offset pb-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-14">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-charcoal">Size Guide</h1>
          <p className="text-taupe mt-2">All measurements are in inches. When between sizes, we recommend sizing up.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-white">
                {['Size', 'Bust', 'Waist', 'Hips', 'Indian Size'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? 'bg-cream-alt' : 'bg-white'}>
                  <td className="px-4 py-3 font-semibold text-charcoal">{row.size}</td>
                  <td className="px-4 py-3 text-taupe">{row.bust}</td>
                  <td className="px-4 py-3 text-taupe">{row.waist}</td>
                  <td className="px-4 py-3 text-taupe">{row.hips}</td>
                  <td className="px-4 py-3 text-taupe">{row.indian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 p-5 bg-secondary-tint rounded-brand text-sm text-taupe">
          <p className="font-medium text-charcoal mb-1">How to Measure</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Bust: Measure around the fullest part of your chest</li>
            <li>Waist: Measure around your natural waistline</li>
            <li>Hips: Measure around the fullest part of your hips</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Track Order Page ─────────────────────────────────────────────────────────

export function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<null | 'found' | 'not-found'>(null);

  return (
    <div className="header-offset pb-16">
      <div className="max-w-lg mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-charcoal">Track Your Order</h1>
          <p className="text-taupe mt-2">Enter your order number and email to check status</p>
        </div>
        <div className="bg-white rounded-brand shadow-soft p-6">
          <form onSubmit={(e) => { e.preventDefault(); setResult(orderNum ? 'found' : 'not-found'); }} className="space-y-4">
            <Input label="Order Number" placeholder="MBK241200001" value={orderNum} onChange={(e) => setOrderNum(e.target.value)} required />
            <Input label="Email Address" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button fullWidth type="submit">Track Order</Button>
          </form>
          {result === 'found' && (
            <div className="mt-5 p-4 bg-sage/10 rounded-brand">
              <p className="font-medium text-charcoal mb-2">Order #{orderNum}</p>
              <div className="flex items-center gap-2 text-sage text-sm">
                <span className="w-2 h-2 rounded-full bg-sage" />
                Delivered on 20 December 2024
              </div>
            </div>
          )}
          {result === 'not-found' && (
            <div className="mt-5 p-4 bg-rust/10 rounded-brand text-rust text-sm">
              Order not found. Please check your order number and try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shipping & Returns Page ──────────────────────────────────────────────────

export function ShippingReturnsPage() {
  return (
    <div className="header-offset pb-16">
      <div className="max-w-3xl mx-auto px-4 py-14 prose prose-sm prose-slate max-w-none">
        <h1 className="font-serif text-4xl text-charcoal mb-8">Shipping & Returns</h1>
        {[
          { title: 'Shipping Policy', content: 'We ship across India via trusted courier partners (Delhivery, BlueDart, India Post). Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available for select pincodes for ₹199. Free standard shipping on orders above ₹1,499. International shipping is not available currently.' },
          { title: 'Returns & Exchanges', content: 'We accept returns within 7 days of delivery for unworn, unwashed, tag-attached items. Sarees, lehengas, bridal pieces, and sale items are FINAL SALE. To initiate a return, log into your account → My Orders → Request Return. Refunds are processed in 5–7 business days.' },
          { title: 'Damaged or Wrong Items', content: 'If you receive a damaged or incorrect item, please WhatsApp us within 48 hours of delivery with photos. We will arrange a reverse pickup and send a replacement or full refund immediately.' },
        ].map((section) => (
          <div key={section.title} className="mb-8 bg-white rounded-brand shadow-soft p-6">
            <h2 className="font-serif text-xl text-charcoal mb-3">{section.title}</h2>
            <p className="text-taupe leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gifting Page ─────────────────────────────────────────────────────────────

export function GiftingPage() {
  return (
    <div className="header-offset pb-16">
      <div className="bg-gradient-brand py-16 text-center mb-10">
        <p className="section-subtitle mb-3">The gift of soul</p>
        <h1 className="font-serif text-5xl text-charcoal">Gifting at Meraki</h1>
        <p className="text-taupe mt-3 max-w-md mx-auto">Give the gift of handcrafted Indian fashion — every piece comes wrapped in our signature packaging</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-brand shadow-soft p-6">
            <h2 className="font-serif text-2xl text-charcoal mb-3">Gift Cards</h2>
            <p className="text-taupe text-sm mb-5">Let your loved one choose what speaks to them. Available in denominations of ₹1,000 / ₹2,500 / ₹5,000 / ₹10,000.</p>
            {[1000, 2500, 5000, 10000].map((amount) => (
              <button key={amount} className="mr-3 mb-3 px-4 py-2 border border-primary text-primary text-sm rounded-brand hover:bg-primary hover:text-white transition-colors">
                ₹{amount.toLocaleString('en-IN')}
              </button>
            ))}
            <div className="mt-4">
              <Button fullWidth>Purchase Gift Card</Button>
            </div>
          </div>
          <div className="bg-white rounded-brand shadow-soft p-6">
            <h2 className="font-serif text-2xl text-charcoal mb-3">Gifting Extras</h2>
            <ul className="space-y-3 text-sm text-taupe">
              {['Complimentary gift wrapping in handmade paper', 'Personalised handwritten message card', 'Signature Meraki ribbon and bow', 'Gift receipt included (no price tag)'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-primary">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h2 className="font-serif text-3xl text-charcoal mb-6 text-center">Gift Picks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.filter((p) => p.base_price <= 5000).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 404 Page ─────────────────────────────────────────────────────────────────

export function NotFoundPage() {
  return (
    <div className="header-offset min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div>
        <p className="font-serif text-9xl text-primary/20 leading-none mb-4">404</p>
        <h1 className="font-serif text-3xl text-charcoal mb-2">Page Not Found</h1>
        <p className="text-taupe mb-8">The page you're looking for may have moved or doesn't exist.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/"><Button variant="outline">Go Home</Button></Link>
          <Link to="/collections"><Button>Browse Collections</Button></Link>
        </div>
      </div>
    </div>
  );
}
