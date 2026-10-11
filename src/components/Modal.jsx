import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { lockScroll } from '../lib/motion';

/** Bottom-sheet on mobile, centred dialog on desktop. */
export default function Modal({ onClose, children, center = false, label = 'Details' }) {
  useEffect(() => {
    lockScroll(true);
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('keydown', esc); lockScroll(false); };
  }, [onClose]);

  return createPortal(
    <div className={`overlay ${center ? 'center' : ''}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label={label}>
      <div className="sheet" data-lenis-prevent>
        <button className="sheet-close" onClick={onClose} aria-label="Close"><X /></button>
        {children}
      </div>
    </div>,
    document.body
  );
}
