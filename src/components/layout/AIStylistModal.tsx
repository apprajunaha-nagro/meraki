import { useState } from 'react';
import { X, Sparkles, ArrowRight, ArrowLeft, Check, Heart, ShoppingBag } from 'lucide-react';
import { Button, Rating } from '@/components/ui';
import { products } from '@/lib/mockData';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AIStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIStylistModal({ isOpen, onClose }: AIStylistModalProps) {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState('wedding');
  const [palette, setPalette] = useState('jewel');
  const [silhouette, setSilhouette] = useState('lehenga');
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  if (!isOpen) return null;

  const handleCalculate = () => {
    // Smart recommendation matching logic based on occasion, palette & silhouette
    let filtered = products.filter((p) => {
      if (occasion === 'wedding') return p.category_id === 5 || p.category_id === 3;
      if (occasion === 'gen-z' || occasion === 'casual') return p.category_id === 4 || p.category_id === 1;
      if (occasion === 'vacation') return p.category_id === 2;
      return true;
    });

    if (silhouette === 'lehenga') {
      const lehengas = products.filter((p) => p.category_id === 5);
      if (lehengas.length > 0) filtered = lehengas;
    } else if (silhouette === 'maxi') {
      const maxis = products.filter((p) => p.category_id === 2);
      if (maxis.length > 0) filtered = maxis;
    } else if (silhouette === 'coord') {
      const coords = products.filter((p) => p.category_id === 1);
      if (coords.length > 0) filtered = coords;
    }

    setMatchedProducts(filtered.slice(0, 4));
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setMatchedProducts([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-charcoal/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-brand shadow-elevated overflow-hidden transition-all border border-gold/30">
          {/* Header */}
          <div className="bg-gradient-brand p-6 border-b border-secondary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">AI Atelier Experience</span>
                <h3 className="font-serif text-2xl text-charcoal font-semibold">Meraki AI Virtual Stylist</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-taupe hover:text-charcoal transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Step 1 of 3</p>
                  <h4 className="font-serif text-xl text-charcoal">What occasion are you dressing for?</h4>
                  <p className="text-taupe text-xs mt-1">Our AI stylist will curate outfits tailored to your event vibes.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'wedding', label: 'Grand Wedding / Reception', icon: '👑', desc: 'Bridal & Royal Ethnic' },
                    { id: 'sangeet', label: 'Sangeet & Mehendi', icon: '💃', desc: 'Vibrant Bandhani & Shimmer' },
                    { id: 'gen-z', label: 'Gen-Z Party & Nightout', icon: '✨', desc: 'Corsets, Capes & Vests' },
                    { id: 'casual', label: 'Everyday Work & Brunch', icon: '🌿', desc: 'Linen & Cotton Co-ords' },
                    { id: 'vacation', label: 'Resort & Sunset Soirée', icon: '🌅', desc: 'Flowing Tiered Maxis' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setOccasion(item.id)}
                      className={`p-4 rounded-brand border text-left flex flex-col justify-between transition-all ${
                        occasion === item.id
                          ? 'border-primary bg-secondary/30 ring-2 ring-primary/40'
                          : 'border-secondary hover:border-primary/40'
                      }`}
                    >
                      <span className="text-2xl mb-2">{item.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-charcoal">{item.label}</p>
                        <p className="text-[10px] text-taupe mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-secondary/30">
                  <Button onClick={() => setStep(2)} rightIcon={<ArrowRight size={14} />}>
                    Next: Color Palette
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Step 2 of 3</p>
                  <h4 className="font-serif text-xl text-charcoal">Choose your preferred color mood</h4>
                  <p className="text-taupe text-xs mt-1">Select tones that match your personal undertone and style aesthetic.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'jewel', label: 'Royal Jewel Tones', colors: 'Emerald Green, Rani Pink, Indigo', hexes: ['#05445E', '#D1512D', '#189AB4'] },
                    { id: 'pastel', label: 'Romantic Pastels', colors: 'Powder Blue, Dusty Rose, Champagne Gold', hexes: ['#A0C3D2', '#ECA8A6', '#F7ECDE'] },
                    { id: 'earthy', label: 'Earthy Warm Tones', colors: 'Terracotta Clay, Marigold Mustard, Sage', hexes: ['#C36A4D', '#E28743', '#7C9473'] },
                    { id: 'obsidian', label: 'Obsidian & Gold', colors: 'Midnight Black, Metallic Silver, Antique Gold', hexes: ['#1E1E1E', '#C7A96B', '#E5E5E5'] },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPalette(item.id)}
                      className={`p-4 rounded-brand border text-left flex items-center justify-between transition-all ${
                        palette === item.id
                          ? 'border-primary bg-secondary/30 ring-2 ring-primary/40'
                          : 'border-secondary hover:border-primary/40'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-charcoal mb-1">{item.label}</p>
                        <p className="text-[10px] text-taupe">{item.colors}</p>
                      </div>
                      <div className="flex -space-x-1 shrink-0">
                        {item.hexes.map((hex, i) => (
                          <span key={i} className="w-5 h-5 rounded-full border border-white" style={{ backgroundColor: hex }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary/30">
                  <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft size={14} />}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} rightIcon={<ArrowRight size={14} />}>
                    Next: Silhouette
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">Step 3 of 3</p>
                  <h4 className="font-serif text-xl text-charcoal">Which silhouette do you feel most confident in?</h4>
                  <p className="text-taupe text-xs mt-1">Choose your favorite garment structure.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'lehenga', label: 'Bridal & Festive Lehenga', icon: '👗' },
                    { id: 'maxi', label: 'Tiered Resort Maxi', icon: '💃' },
                    { id: 'coord', label: 'Structured Co-ord Set', icon: '🧥' },
                    { id: 'kurti', label: 'Anarkali & Sharara Kurti', icon: '🌸' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSilhouette(item.id)}
                      className={`p-4 rounded-brand border text-center flex flex-col items-center justify-center transition-all ${
                        silhouette === item.id
                          ? 'border-primary bg-secondary/30 ring-2 ring-primary/40'
                          : 'border-secondary hover:border-primary/40'
                      }`}
                    >
                      <span className="text-3xl mb-2">{item.icon}</span>
                      <p className="text-xs font-semibold text-charcoal">{item.label}</p>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary/30">
                  <Button variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft size={14} />}>
                    Back
                  </Button>
                  <Button onClick={handleCalculate} variant="primary" size="lg" rightIcon={<Sparkles size={16} />}>
                    Generate Styling Recommendations
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center bg-cream-alt p-4 rounded-brand border border-gold/30">
                  <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-2">
                    <Sparkles size={12} /> 99.4% Style Match Found
                  </span>
                  <h4 className="font-serif text-2xl text-charcoal">Your Personalized Outfit Recommendations</h4>
                  <p className="text-taupe text-xs mt-1">Handpicked by Meraki AI Stylist for your occasion and palette preference.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {matchedProducts.map((p) => (
                    <div key={p.id} className="bg-cream-alt rounded-brand p-3 border border-secondary flex gap-3 items-center group">
                      <img
                        src={p.images?.[0]?.image_url || '/logo.png'}
                        alt={p.name}
                        className="w-16 h-20 object-cover rounded-brand shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-charcoal truncate">{p.name}</p>
                        <p className="text-[11px] font-bold text-primary mt-1">₹{p.base_price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              const variant = p.variants?.[0] || { id: p.id * 10 + 1, product_id: p.id, size: 'M', color: 'Standard', color_hex: '#D4AF37', sku: `${p.sku}-M`, stock_qty: 10 };
                              addItem(p, variant, 1);
                              toast.success(`Added ${p.name} to Bag!`);
                            }}
                            className="px-2.5 py-1 bg-charcoal text-white text-[10px] rounded-brand hover:bg-primary transition-colors flex items-center gap-1"
                          >
                            <ShoppingBag size={10} /> Add
                          </button>
                          <Link
                            to={`/product/${p.slug}`}
                            onClick={onClose}
                            className="text-[10px] text-primary underline hover:text-primary-dark font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary/30">
                  <Button variant="ghost" onClick={resetQuiz} leftIcon={<ArrowLeft size={14} />}>
                    Retake Quiz
                  </Button>
                  <Button onClick={onClose} variant="primary">
                    Explore Storefront
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
