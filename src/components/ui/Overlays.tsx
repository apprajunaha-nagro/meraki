import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={cn(
          'relative bg-white rounded-[12px] shadow-elevated w-full animate-scale-in',
          'max-h-[90vh] overflow-auto',
          modalSizes[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary">
            <h2 className="font-serif text-xl text-charcoal">{title}</h2>
            <button
              onClick={onClose}
              className="text-taupe hover:text-charcoal transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-cream-alt"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 text-taupe hover:text-charcoal transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-cream-alt"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}
        <div className={title ? 'p-6' : 'p-6 pt-10'}>{children}</div>
      </div>
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  width?: string;
  className?: string;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  width = 'w-[420px] max-w-[95vw]',
  className,
  footer,
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer panel */}
      <div
        className={cn(
          'fixed top-0 z-50 h-full bg-white shadow-elevated flex flex-col',
          'transition-transform duration-350 ease-out',
          side === 'right' ? 'right-0' : 'left-0',
          isOpen
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full',
          width,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary flex-shrink-0">
          {title && <h2 className="font-serif text-lg text-charcoal">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-taupe hover:text-charcoal transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-cream-alt"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-secondary px-5 py-4 bg-cream">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={cn('divide-y divide-secondary', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-charcoal hover:text-primary transition-colors"
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <svg
                className={cn('w-4 h-4 text-taupe transition-transform duration-200', isOpen && 'rotate-180')}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-96 pb-4' : 'max-h-0'
              )}
            >
              <div className="text-sm text-taupe leading-relaxed">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
