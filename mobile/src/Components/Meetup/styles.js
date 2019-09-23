import styled from 'styled-components/native';

import Button from '~/Components/Button';

import colors from '~/styles/colors';

export const Container = styled.View`
  margin-bottom: 15px;
  padding: 0;
  border-radius: 4px;
  background: #fff;

  flex-direction: column;

  opacity: ${props => (props.past ? 0.6 : 1)};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;

  margin: 5px 20px;
`;

export const Banner = styled.Image`
  height: 150px;
  margin-bottom: 15px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const Title = styled.Text`
  color: #000;
  font-size: 20px;
  margin: 5px 20px;
  font-weight: bold;
`;

export const Desc = styled.Text`
  color: #999;
  font-size: 16px;
  margin-left: 5px;
`;

export const SubscriptionButton = styled(Button)`
  margin: 20px;
  background: ${colors.primary};
`;
