import { darken } from 'polished';
import colors from './colors';

const primaryButton = () => `
  background: ${colors.primary};
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 16px;

  &:hover {
    background: ${darken(0.03, colors.primary)};
  }
`;

const secondaryButton = () => `
  background: ${colors.secondary};
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 16px;

  &:hover {
    background: ${darken(0.03, colors.secondary)};
  }
`;

const buttonHasIcon = () => `
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
  }
`;

export { primaryButton, secondaryButton, buttonHasIcon };
