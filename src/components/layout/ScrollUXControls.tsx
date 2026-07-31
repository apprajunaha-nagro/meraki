import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollUXControls() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress percentage
      if (totalHeight > 0) {
        const percent = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollPercent(percent);
      }

      // Show back-to-top button after scrolling 250px
      setShowBackToTop(currentScroll > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* 1. Top Reading / Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-secondary/20">
        <div
          className="h-full bg-gradient-to-r from-primary via-gold to-primary transition-all duration-150 ease-out shadow-[0_0_8px_rgba(199,169,107,0.6)]"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* 2. Floating "Back to Top" Button with Circular Progress Indicator */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
          showBackToTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-[0_8px_24px_rgba(62,42,50,0.18)] border border-gold/40 text-charcoal hover:bg-primary hover:text-white transition-all duration-300 active:scale-90"
        >
          {/* Circular SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-0.5" viewBox="0 0 36 36">
            <path
              className="text-secondary/40"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-gold group-hover:text-white transition-colors duration-300"
              strokeDasharray={`${scrollPercent}, 100`}
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Chevron Up Icon */}
          <ChevronUp size={20} className="relative z-10 transition-transform group-hover:-translate-y-0.5" />

          {/* Hover Tooltip */}
          <span className="absolute right-14 bg-charcoal text-white text-[11px] font-sans font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
            Back to top
          </span>
        </button>
      </div>
    </>
  );
}
