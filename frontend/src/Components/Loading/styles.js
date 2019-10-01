import styled, { keyframes } from 'styled-components';

export const rotating = keyframes`
 from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
`;

export const Container = styled.div`
  width: 100%;
  padding: 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    animation: ${rotating} 2s infinite;
  }
`;
