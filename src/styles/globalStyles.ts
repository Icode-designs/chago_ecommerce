import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    color: ${({ theme }) => theme.colors.onSurface};
    background-color: ${({ theme }) => theme.colors.surface};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    color: ${({ theme }) => theme.colors.primary};
    letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.displayMd};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: ${({ theme }) => theme.fontSizes.headlineLg};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.headlineLg};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: ${({ theme }) => theme.fontSizes.headlineSm};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.headlineSm};
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.titleLg};
  }

  h5 {
    font-size: ${({ theme }) => theme.fontSizes.titleMd};
  }

  h6 {
    font-size: ${({ theme }) => theme.fontSizes.titleSm};
  }

  p {
    color: ${({ theme }) => theme.colors.onSurfaceVariant};
    line-height: ${({ theme }) => theme.lineHeights.relaxed};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  button {
    font-family: ${({ theme }) => theme.fonts.body};
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-size: inherit;
  }

  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.bodyMd};
    outline: none;
    border: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ul, ol {
    list-style: none;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primaryContainer};
    color: ${({ theme }) => theme.colors.primary};
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.outlineVariant};
    border-radius: ${({ theme }) => theme.radii.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.outline};
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

export default GlobalStyles;
