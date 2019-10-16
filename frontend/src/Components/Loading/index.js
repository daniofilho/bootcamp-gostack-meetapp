import React from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import { Container } from './styles';
import colors from '~/styles/colors';

export default function Loading() {
  return (
    <Container>
      <FaCircleNotch color={colors.primary} size={30} />
    </Container>
  );
}
