'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'up' | 'left' | 'right' | 'fade';
  delay?: number; // in milliseconds
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  animation = 'up',
  delay = 0,
  className = '',
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If browser doesn't support IntersectionObserver, make visible immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Unobserve after trigger for performance
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const animationClass = {
    up: 'reveal-hidden',
    fade: 'reveal-hidden-fade',
    left: 'reveal-hidden-left',
    right: 'reveal-hidden-right',
  }[animation];

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: isVisible && delay ? `${delay}ms` : '0ms',
      }}
      className={`${animationClass} ${isVisible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
