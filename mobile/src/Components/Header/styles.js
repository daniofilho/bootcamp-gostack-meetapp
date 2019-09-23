import styled from 'styled-components/native';
import colors from '~/styles/colors';

import logo from '~/assets/logo.png';

export const Container = styled.SafeAreaView`
  background: ${colors.bar};
  padding: 15px;
`;

export const Logo = styled.Image.attrs({
  source: logo,
  resizeMode: 'cover',
})`
  width: 30px;
  height: 30px;
  align-self: center;
`;
