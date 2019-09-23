import React, { useState, useEffect } from 'react';

import { withNavigationFocus } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/Components/Background';
import Loading from '~/Components/Loading';
import Meetup from '~/Components/Meetup';

import api from '~/services/api';

import { Container, List, NoMeetupsText } from './styles';

function Subscriptions({ isFocused }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadSubscriptions() {
    const response = await api.get('subscriptions');
    setSubscriptions(response.data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    loadSubscriptions();
  }, [isFocused]);

  async function handleCancelSubscription(id) {
    await api.delete(`subscriptions/${id}`);

    setLoading(true);
    loadSubscriptions();
  }

  return (
    <Background>
      <Container>
        {loading ? (
          <Loading />
        ) : subscriptions.length < 1 ? (
          <NoMeetupsText>Você não está inscrito em Meetups</NoMeetupsText>
        ) : (
          <List
            data={subscriptions}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Meetup
                data={item.meetup}
                subscribed={true}
                onPress={() => handleCancelSubscription(item.id)}
              />
            )}
          />
        )}
      </Container>
    </Background>
  );
}

Subscriptions.navigationOptions = {
  tabBarLabel: 'Inscrições',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="subscriptions" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Subscriptions);
