import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { hapticFeedback } from '@tma.js/sdk';
import './LoginAnimation.css';

// Animation keyframes
const textReveal = keyframes`
  0% {
    width: 1px;
    left: -12px;
    opacity: 0.3;
  }
  100% {
    width: 406px;
    left: 17px;
    opacity: 1;
  }
`;

const buttonSlideUp = keyframes`
  0% {
    top: 967px;
  }
  100% {
    top: 879px;
  }
`;

const textGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 
                 0 0 30px rgba(255, 255, 255, 0.2);
  }
`;

// Styled components
const Container = styled.div<{ scale: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 1000;
`;

const DesignWrapper = styled.div<{ scale: number }>`
  width: 440px;
  height: 956px;
  position: relative;
  background: white;
  overflow: hidden;
  transform: scale(${props => props.scale});
  transform-origin: center;
`;

const Background = styled.div`
  width: 755px;
  height: 1159px;
  left: -160.58px;
  top: -128.76px;
  position: absolute;
  background: #0C0C0C;
`;

const WelcomeTextWrapper = styled.div<{ stage: number }>`
  position: absolute;
  height: 162px;
  top: 397px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  /* Stage 1: Initial collapsed state */
  ${props => props.stage === 1 && css`
    width: 1px;
    left: -12px;
  `}

  /* Stage 2 & 3: Expanded state */
  ${props => props.stage >= 2 && css`
    width: 406px;
    left: 17px;
    animation: ${textReveal} 0.8s ease-out forwards;
  `}

  /* Stage 3: Glowing effect */
  ${props => props.stage === 3 && css`
    animation: ${textReveal} 0.8s ease-out forwards,
               ${textGlow} 2s ease-in-out infinite;
  `}
`;

const WelcomeText = styled.div`
  width: 406px;
  height: 162px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const WelcomeLine1 = styled.span`
  color: white;
  font-size: 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
  font-weight: 100; /* Thin */
  line-height: 60px;
  letter-spacing: -0.5px;
`;

const WelcomeLine2 = styled.span`
  color: white;
  font-size: 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
  font-weight: 900; /* Black */
  line-height: 60px;
  letter-spacing: -0.5px;
  margin-top: -10px;
`;

const ButtonContainer = styled.div<{ stage: number }>`
  width: 378px;
  left: 31px;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;

  /* Stage 1 & 2: Bottom position */
  ${props => props.stage <= 2 && css`
    top: 967px;
  `}

  /* Stage 3: Slid up position */
  ${props => props.stage === 3 && css`
    top: 879px;
    animation: ${buttonSlideUp} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
`;

const TelegramButton = styled.button<{ isActive: boolean }>`
  align-self: stretch;
  height: 58px;
  padding: 15px 12px;
  background: var(--Native-button_color, #007AFF);
  border: none;
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: ${props => props.isActive ? 'pointer' : 'default'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: ${props => props.isActive ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isActive ? '0 8px 25px rgba(0, 122, 255, 0.4)' : 'none'};
  }

  &:active {
    transform: ${props => props.isActive ? 'translateY(0)' : 'none'};
    box-shadow: ${props => props.isActive ? '0 4px 12px rgba(0, 122, 255, 0.3)' : 'none'};
  }
`;

const ButtonLabel = styled.span`
  color: var(--Native-button_text_color, white);
  font-size: 17px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
  font-weight: 600; /* SemiBold */
  line-height: 22px;
  letter-spacing: 0.5px;
`;

const PersonIcon = styled.div<{ stage: number }>`
  width: 24px;
  height: 24px;
  left: 78px;
  top: 17px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Stage 1 & 2: Simple div */
  ${props => props.stage <= 2 && css`
    &::after {
      content: '';
      width: 19.3px;
      height: 19.8px;
      background: white;
      border-radius: 1px;
    }
  `}

  /* Stage 3: SVG icon */
  ${props => props.stage === 3 && css`
    & svg {
      width: 24px;
      height: 24px;
    }
  `}
`;

const ProgressDots = styled.div<{ stage: number }>`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #007AFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    opacity: ${props => props.stage < 3 ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`;

const Dot = styled.div<{ isActive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.isActive ? '#007AFF' : 'rgba(255, 255, 255, 0.3)'};
  transform: ${props => props.isActive ? 'scale(1.2)' : 'scale(1)'};
  transition: all 0.3s ease;
`;

// Hook for responsive scaling
const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Design dimensions
      const designWidth = 440;
      const designHeight = 956;
      
      // Calculate scale to fit screen
      const widthScale = screenWidth / designWidth;
      const heightScale = screenHeight / designHeight;
      
      // Use the smaller scale to ensure everything fits
      const newScale = Math.min(widthScale, heightScale, 1.2); // Cap at 1.2x
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return scale;
};

export const LoginAnimation: React.FC = () => {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [buttonActive, setButtonActive] = useState(false);
  const scale = useResponsiveScale();
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage(2);
    }, 800);

    const timer2 = setTimeout(() => {
      setStage(3);
    }, 1600);

    const timer3 = setTimeout(() => {
      setButtonActive(true);
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleButtonClick = () => {
    if (hapticFeedback) {
        hapticFeedback.impactOccurred('medium');
      }
  };

  return (
    <Container scale={scale} ref={containerRef}>
      <DesignWrapper scale={scale}>
        <Background />
        
        {/* Welcome Text */}
        <WelcomeTextWrapper stage={stage}>
          <WelcomeText>
            <WelcomeLine1>Welcome to</WelcomeLine1>
            <WelcomeLine2>ugarit</WelcomeLine2>
          </WelcomeText>
        </WelcomeTextWrapper>

        {/* Login Button */}
        <ButtonContainer stage={stage}>
          <TelegramButton 
            className="telegram-login-button"
            isActive={buttonActive}
            onClick={handleButtonClick}
          >
            <ButtonLabel>Log in with Telegram</ButtonLabel>
            <PersonIcon stage={stage}>
              {stage === 3 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 3.89998C9.93798 3.89998 8.26764 5.57001 8.26764 7.62855C8.26764 9.68709 9.93798 11.3571 12 11.3571C14.062 11.3571 15.7323 9.68709 15.7323 7.62855C15.7323 5.57001 14.062 3.89998 12 3.89998ZM6.46764 7.62855C6.46764 4.57451 8.94525 2.09998 12 2.09998C15.0547 2.09998 17.5323 4.57451 17.5323 7.62855C17.5323 10.6826 15.0547 13.1571 12 13.1571C8.94525 13.1571 6.46764 10.6826 6.46764 7.62855ZM4.11957 16.2241C5.15411 15.2699 6.41697 14.9571 7.36762 14.9571H16.6323C17.583 14.9571 18.8458 15.2699 19.8804 16.2241C20.9368 17.1984 21.65 18.7438 21.65 21C21.65 21.497 21.247 21.9 20.75 21.9C20.2529 21.9 19.85 21.497 19.85 21C19.85 19.1418 19.2764 18.1158 18.66 17.5473C18.0218 16.9586 17.2258 16.7571 16.6323 16.7571H7.36762C6.77416 16.7571 5.9782 16.9586 5.33994 17.5473C4.72352 18.1158 4.14998 19.1418 4.14998 21C4.14998 21.497 3.74703 21.9 3.24998 21.9C2.75292 21.9 2.34998 21.497 2.34998 21C2.34998 18.7438 3.06319 17.1984 4.11957 16.2241Z" fill="white"/>
                </svg>
              )}
            </PersonIcon>
          </TelegramButton>
        </ButtonContainer>

        {/* Progress Indicator */}
        <ProgressDots stage={stage}>
          <Dot isActive={stage >= 1} />
          <Dot isActive={stage >= 2} />
          <Dot isActive={stage >= 3} />
        </ProgressDots>
      </DesignWrapper>
    </Container>
  );
};