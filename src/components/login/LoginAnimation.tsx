import { useState, useEffect, useRef } from 'react';
import { hapticFeedback, viewport, init, isTMA } from '@tma.js/sdk';

const LoginAnimation = () => {
  const [stage, setStage] = useState(1);
  const [, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Correct fullscreen implementation as you provided
  useEffect(() => {
    async function initTg() {
      if (await isTMA()) {
        init();

        if (viewport.mount.isAvailable()) {
          await viewport.mount();
          viewport.expand();
        }

        if (viewport.requestFullscreen.isAvailable()) {
          await viewport.requestFullscreen();
        }
      }
    }
    initTg();
  }, []);

  // Track actual container dimensions for responsive calculations
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation sequence - ensure button is hidden in stage 1
  useEffect(() => {
    const timer1 = setTimeout(() => setStage(2), 800);
    const timer2 = setTimeout(() => setStage(3), 1600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Haptic feedback
  const handleButtonClick = () => {
    if (hapticFeedback) {
      hapticFeedback.impactOccurred('medium');
    }
    console.log('Telegram login button clicked');
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    >
      {/* Welcome Text - Centered with responsive scaling */}
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: stage === 1 
            ? 'translate(-50%, -50%) scaleX(0.002)' 
            : 'translate(-50%, -50%) scaleX(1)',
          transformOrigin: 'center',
          opacity: stage === 1 ? 0.3 : 1,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            color: 'white',
            fontSize: 'clamp(40px, 10vw, 60px)',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 100,
            lineHeight: '1.1',
            display: 'block'
          }}>
            Welcome to
          </span>
          <span style={{
            color: 'white',
            fontSize: 'clamp(40px, 10vw, 60px)',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 900,
            lineHeight: '1.1',
            display: 'block',
            marginTop: '0.2em'
          }}>
            ugarit
          </span>
        </div>
      </div>

      {/* Login Button - Responsive bottom positioning */}
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: stage === 3 ? '85vh' : 'calc(100vh + 100px)', // Start off-screen for stage 1 & 2
          width: '85vw',
          maxWidth: '378px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 10
        }}
      >
        <button
          onClick={handleButtonClick}
          style={{
            width: '100%',
            height: 'clamp(50px, 6vh, 58px)',
            padding: 'clamp(12px, 1.5vh, 15px) clamp(10px, 2.5vw, 12px)',
            background: '#007AFF',
            border: 'none',
            borderRadius: 'clamp(10px, 1.5vh, 12px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(8px, 1vw, 10px)',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <span style={{
            color: 'white',
            fontSize: 'clamp(15px, 4vw, 17px)',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            lineHeight: '1.3',
            whiteSpace: 'nowrap'
          }}>
            Log in with Telegram
          </span>
        </button>
        
        {/* Person icon - Only show in stage 3 */}
        {stage === 3 && (
          <div style={{
            position: 'absolute',
            left: '20%',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: stage === 3 ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}>
            <svg 
              width="clamp(20px, 5vw, 24px)" 
              height="clamp(20px, 5vw, 24px)" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 3.89998C9.93798 3.89998 8.26764 5.57001 8.26764 7.62855C8.26764 9.68709 9.93798 11.3571 12 11.3571C14.062 11.3571 15.7323 9.68709 15.7323 7.62855C15.7323 5.57001 14.062 3.89998 12 3.89998ZM6.46764 7.62855C6.46764 4.57451 8.94525 2.09998 12 2.09998C15.0547 2.09998 17.5323 4.57451 17.5323 7.62855C17.5323 10.6826 15.0547 13.1571 12 13.1571C8.94525 13.1571 6.46764 10.6826 6.46764 7.62855ZM4.11957 16.2241C5.15411 15.2699 6.41697 14.9571 7.36762 14.9571H16.6323C17.583 14.9571 18.8458 15.2699 19.8804 16.2241C20.9368 17.1984 21.65 18.7438 21.65 21C21.65 21.497 21.247 21.9 20.75 21.9C20.2529 21.9 19.85 21.497 19.85 21C19.85 19.1418 19.2764 18.1158 18.66 17.5473C18.0218 16.9586 17.2258 16.7571 16.6323 16.7571H7.36762C6.77416 16.7571 5.9782 16.9586 5.33994 17.5473C4.72352 18.1158 4.14998 19.1418 4.14998 21C4.14998 21.497 3.74703 21.9 3.24998 21.9C2.75292 21.9 2.34998 21.497 2.34998 21C2.34998 18.7438 3.06319 17.1984 4.11957 16.2241Z" fill="white"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginAnimation;