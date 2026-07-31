import React, { useState } from 'react';
import { X, Scissors, Check, Ruler, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import type { Product } from '@/types/product';
import toast from 'react-hot-toast';

interface TailoringDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSaveOptions: (options: TailoringOptions) => void;
}

export interface TailoringOptions {
  stitchingType: 'unstitched' | 'standard' | 'custom';
  neckline: string;
  sleeveLength: string;
  bustSize: string;
  waistSize: string;
  lehengaLength: string;
  specialInstructions: string;
}

export function TailoringDrawer({ isOpen, onClose, product, onSaveOptions }: TailoringDrawerProps) {
  const [stitchingType, setStitchingType] = useState<'unstitched' | 'standard' | 'custom'>('custom');
  const [neckline, setNeckline] = useState('Deep V-Neck (As Pictured)');
  const [sleeveLength, setSleeveLength] = useState('Elbow-Length');
  const [bustSize, setBustSize] = useState('36" (Size M)');
  const [waistSize, setWaistSize] = useState('30"');
  const [lehengaLength, setLehengaLength] = useState('42" (Standard)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const options: TailoringOptions = {
      stitchingType,
      neckline,
      sleeveLength,
      bustSize,
      waistSize,
      lehengaLength,
      specialInstructions,
    };
    onSaveOptions(options);
    toast.success('Custom tailoring preferences saved to product!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-elevated flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-brand border-b border-secondary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors size={20} className="text-primary" />
              <div>
                <h3 className="font-serif text-lg text-charcoal font-semibold">Custom Tailoring Atelier</h3>
                <p className="text-xs text-taupe">Personalized fitting for {product.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-taupe hover:text-charcoal transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Stitching Type */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-3">
                1. Stitching Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'custom', label: 'Custom Tailored', price: '+₹1,299', popular: true },
                  { id: 'standard', label: 'Standard Fit', price: 'Free' },
                  { id: 'unstitched', label: 'Unstitched Dress Material', price: 'Free' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStitchingType(opt.id as any)}
                    className={`p-3 rounded-brand border text-left flex flex-col justify-between transition-all ${
                      stitchingType === opt.id
                        ? 'border-primary bg-secondary/30 ring-1 ring-primary'
                        : 'border-secondary hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-charcoal">{opt.label}</span>
                      {stitchingType === opt.id && <Check size={14} className="text-primary" />}
                    </div>
                    <span className="text-[11px] text-taupe mt-2 font-medium">{opt.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {stitchingType === 'custom' && (
              <>
                {/* 2. Neckline Style */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-2">
                    2. Blouse Neckline Style
                  </label>
                  <select
                    value={neckline}
                    onChange={(e) => setNeckline(e.target.value)}
                    className="w-full p-2.5 bg-cream-alt border border-secondary rounded-brand text-xs text-charcoal outline-none focus:border-primary"
                  >
                    <option>Deep V-Neck (As Pictured)</option>
                    <option>Sweetheart Neckline with Zari</option>
                    <option>Classic Royal Scoop Neck</option>
                    <option>High Neck Collar with Keyhole</option>
                    <option>Modest Square Neck</option>
                    <option>Off-Shoulder Glamour Cut</option>
                  </select>
                </div>

                {/* 3. Sleeve Length */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-2">
                    3. Sleeve Length
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Sleeveless', 'Elbow-Length', '3/4th Sleeves', 'Full Sleeves'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSleeveLength(s)}
                        className={`p-2.5 text-xs rounded-brand border transition-colors text-center ${
                          sleeveLength === s ? 'border-primary bg-primary text-white font-medium' : 'border-secondary text-charcoal hover:bg-cream-alt'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Exact Measurements */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                      4. Custom Measurements (Inches)
                    </label>
                    <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                      <Ruler size={12} /> Size Guide Included
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-taupe">Bust / Chest</span>
                      <input
                        type="text"
                        value={bustSize}
                        onChange={(e) => setBustSize(e.target.value)}
                        className="w-full mt-1 p-2 bg-cream-alt border border-secondary rounded-md text-xs text-charcoal"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-taupe">Waist Line</span>
                      <input
                        type="text"
                        value={waistSize}
                        onChange={(e) => setWaistSize(e.target.value)}
                        className="w-full mt-1 p-2 bg-cream-alt border border-secondary rounded-md text-xs text-charcoal"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-taupe">Lehenga Length</span>
                      <input
                        type="text"
                        value={lehengaLength}
                        onChange={(e) => setLehengaLength(e.target.value)}
                        className="w-full mt-1 p-2 bg-cream-alt border border-secondary rounded-md text-xs text-charcoal"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Special Notes */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-2">
                    5. Special Alteration Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Add extra margin inside seams, include padded cups, or add matching tassel Dori."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full p-3 bg-cream-alt border border-secondary rounded-brand text-xs text-charcoal resize-none outline-none focus:border-primary"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-brand flex items-start gap-2">
                  <Sparkles size={16} className="text-amber-700 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Our master artisans in Dhanbad will stitch your garment according to these specifications. Custom orders dispatch in 5-7 business days.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-secondary bg-cream-alt flex items-center justify-between">
            <div>
              <span className="text-xs text-taupe">Stitching Fee:</span>
              <p className="font-serif font-bold text-base text-charcoal">
                {stitchingType === 'custom' ? '₹1,299' : 'FREE'}
              </p>
            </div>
            <Button onClick={handleSave} variant="primary" size="md">
              Save Tailoring Options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
