import { useEffect, useRef } from 'react';

/**
 * useScrollLock - Custom hook for locking body scroll when modals are open
 *
 * Properly handles scroll position restoration and prevents memory leaks
 * by storing scroll position in a ref instead of a closure.
 *
 * @param {boolean} isLocked - Whether scroll should be locked
 * @returns {void}
 *
 * @example
 * function Modal({ isOpen }) {
 *   useScrollLock(isOpen);
 *   return isOpen ? <div>Modal content</div> : null;
 * }
 */
export function useScrollLock(isLocked) {
  const scrollYRef = useRef(0);
  const scrollbarWidthRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Store current scroll position and scrollbar width
      scrollYRef.current = window.scrollY;
      scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;

      // Lock both html and body to prevent all scroll scenarios
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      document.body.style.overflow = 'hidden';
      // Prevent layout shift from scrollbar disappearing
      document.body.style.paddingRight = `${scrollbarWidthRef.current}px`;

      return () => {
        // Restore scroll position when unlocking
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.bottom = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isLocked]);
}

export default useScrollLock;
