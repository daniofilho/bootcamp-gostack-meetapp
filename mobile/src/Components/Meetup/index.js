import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';

import urlMiddleware from '~/util/urlMiddleware';

import {
  Container,
  Row,
  Title,
  Desc,
  Banner,
  SubscriptionButton,
} from './styles';

export default function Appointment({ data, subscribed, onPress }) {
  const [date, setDate] = useState(parseISO(data.date));
  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM 'às' HH'h'mm", { locale: pt }),
    [date]
  );

  return (
    <Container past={data.past}>
      <Banner
        source={{
          uri: data.File.url
            ? urlMiddleware(data.File.url)
            : `https://placeholder.com/900x300/text=${data.title}`,
        }}
      />

      <Title>{data.title}</Title>
      <Row>
        <Icon name="event" color="#999" size={16} />
        <Desc>{dateFormatted}</Desc>
      </Row>

      <Row>
        <Icon name="place" color="#999" size={16} />
        <Desc>{data.location}</Desc>
      </Row>

      <Row>
        <Icon name="person" color="#999" size={16} />
        <Desc>Organizador: {data.User.name}</Desc>
      </Row>

      {!data.past && !subscribed && (
        <SubscriptionButton onPress={onPress}>
          Realizar inscrição
        </SubscriptionButton>
      )}

      {subscribed && (
        <SubscriptionButton onPress={onPress}>
          Cancelar inscrição
        </SubscriptionButton>
      )}
    </Container>
  );
}
