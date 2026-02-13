'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 6000); // Auto-close na 6 seconden

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isVisible, onClose]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (isVisible && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 6000);
    }
  };

  const handleToastClick = () => {
    // Dispatch custom event om winkelwagen te openen
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openCart'));
    }
    onClose();
  };

  if (!isVisible || typeof window === 'undefined') return null;

  const toastContent = (
    <div className="toast-container">
      <div 
        className="toast"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleToastClick}
        style={{ cursor: 'pointer' }}
      >
        <CheckCircle2 size={20} className="toast-icon" />
        <span className="toast-message">{message}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="toast-close" 
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
}
