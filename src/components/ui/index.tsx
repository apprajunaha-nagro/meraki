import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// ─── Button ─────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-primary text-white shadow-[0_2px_12px_rgba(126,93,119,0.3)] hover:shadow-[0_4px_20px_rgba(126,93,119,0.4)] hover:-translate-y-px active:translate-y-0',
  secondary: 'bg-secondary text-charcoal border border-secondary-deep hover:bg-secondary-deep',
  ghost: 'bg-transparent text-charcoal border border-charcoal/20 hover:border-primary hover:text-primary',
  outline: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
  danger: 'bg-rust text-white hover:bg-rust/90',
  link: 'bg-transparent text-primary hover:underline p-0 h-auto',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-xs rounded-md',
  sm: 'px-4 py-2 text-sm rounded-brand',
  md: 'px-6 py-3 text-sm rounded-brand',
  lg: 'px-8 py-3.5 text-base rounded-brand',
  xl: 'px-10 py-4 text-base rounded-brand',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 active:scale-95 cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          variant !== 'link' && 'tracking-[0.03em]',
          className
        )}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── Badge ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'new' | 'bestseller' | 'sale' | 'sold-out' | 'low-stock' | 'featured' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  new: 'bg-primary text-white',
  bestseller: 'bg-gold text-white',
  sale: 'bg-rust text-white',
  'sold-out': 'bg-taupe/70 text-white',
  'low-stock': 'bg-amber-100 text-amber-800 border border-amber-300',
  featured: 'bg-secondary-deep text-charcoal',
  default: 'bg-cream-alt text-taupe',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full tracking-[0.05em] uppercase',
        badgeVariantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, leftIcon, rightIcon, wrapperClassName, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 bg-white border rounded-brand text-charcoal placeholder-taupe text-sm',
              'transition-all duration-200 outline-none',
              'focus:border-primary focus:ring-2 focus:ring-primary/15',
              error ? 'border-rust focus:border-rust focus:ring-rust/15' : 'border-secondary-deep',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe">{rightIcon}</span>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-rust">{error}</p>}
        {helper && !error && <p className="mt-1 text-xs text-taupe">{helper}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, wrapperClassName, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-3 bg-white border rounded-brand text-charcoal text-sm appearance-none',
            'transition-all duration-200 outline-none cursor-pointer',
            'focus:border-primary focus:ring-2 focus:ring-primary/15',
            error ? 'border-rust' : 'border-secondary-deep',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-rust">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ─── Textarea ────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, wrapperClassName, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 bg-white border rounded-brand text-charcoal placeholder-taupe text-sm resize-y min-h-[120px]',
            'transition-all duration-200 outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/15',
            error ? 'border-rust' : 'border-secondary-deep',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rust">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ─── Rating Stars ─────────────────────────────────────────────────────────────

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function Rating({ value, max = 5, size = 'sm', showCount, count, className }: RatingProps) {
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4.5 h-4.5', lg: 'w-5 h-5' };
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={cn(sizeMap[size], i < Math.floor(value) ? 'text-gold' : i < value ? 'text-gold/60' : 'text-taupe/30')}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showCount && count !== undefined && (
        <span className="text-xs text-taupe ml-1">({count})</span>
      )}
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-xs text-taupe', className)}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span aria-hidden>/</span>}
          {item.href && i < items.length - 1 ? (
            <a href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </a>
          ) : (
            <span className={i === items.length - 1 ? 'text-charcoal font-medium' : ''}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-secondary/60 via-secondary-tint to-secondary/60 bg-[length:400%_100%]',
        variant === 'circle' ? 'rounded-full' : 'rounded-brand',
        className
      )}
      aria-hidden
    />
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

interface DividerProps {
  className?: string;
  gold?: boolean;
}

export function Divider({ className, gold = false }: DividerProps) {
  if (gold) {
    return (
      <div
        className={cn('h-px', className)}
        style={{ background: 'linear-gradient(90deg, transparent, #C7A96B, transparent)' }}
      />
    );
  }
  return <hr className={cn('border-secondary', className)} />;
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
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="divide-y divide-secondary">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-3">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex justify-between items-center w-full text-left font-serif text-charcoal hover:text-primary transition-colors py-2 text-base font-medium"
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <span className={cn("text-xs transition-transform duration-200 text-taupe", isOpen && "rotate-180")}>
                <ChevronDown size={16} />
              </span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[500px] mt-2 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="text-sm text-taupe leading-relaxed pb-2 font-sans">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
