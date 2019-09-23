import React, { useEffect, useState, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, subDays, addDays } from 'date-fns';
import pt from 'date-fns/locale/pt';

// Dispara um evento quando a tela recebeu foco novamente (quando usuário navegou pra cá de novo)
import { withNavigationFocus } from 'react-navigation';

import {
  Container,
  List,
  DateContainer,
  DateButton,
  DateText,
  NoMeetupsText,
} from './styles';

import { Alert } from 'react-native';

import api from '~/services/api';

import Header from '~/Components/Header';

import Background from '~/Components/Background';
import Meetup from '~/Components/Meetup';
import Loading from '~/Components/Loading';

function Dashboard({ isFocused }) {
  // # Init

  const [meetups, setMeetups] = useState([]);
  const [date, setDate] = useState(new Date('2019-10-08'));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  // # Load Meetups

  async function loadMeetups(_page = page) {
    const response = await api.get('meetups', {
      params: {
        date,
        page: _page,
      },
    });

    const data = _page > 1 ? [...meetups, ...response.data] : response.data;

    setMeetups(data);
    setPage(_page);
    setLoading(false);
    setLoadingMore(false);
  }

  async function loadMore() {
    setLoadingMore(true);

    loadMeetups(page + 1);
  }

  useEffect(() => {
    setLoading(true);

    loadMeetups();
  }, [isFocused, date]);

  // # Date

  function handlePrevDay() {
    setLoading(true);
    setPage(1);
    setMeetups([]);
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setLoading(true);
    setPage(1);
    setMeetups([]);
    setDate(addDays(date, 1));
  }

  // # Subscription

  async function handleSubscription(id) {
    try {
      await api.post('subscriptions', {
        meetup_id: id,
      });
      Alert.alert('Sucesso!', 'Inscrição realizada com sucesso.');
    } catch (error) {
      Alert.alert('Erro: ', error.response.data.error);
    }
  }

  // # Render

  return (
    <Background>
      <Header />
      <Container>
        <DateContainer>
          <DateButton onPress={handlePrevDay}>
            <Icon name="chevron-left" size={36} color="#FFF" />
          </DateButton>
          <DateText>{dateFormatted}</DateText>
          <DateButton onPress={handleNextDay}>
            <Icon name="chevron-right" size={36} color="#FFF" />
          </DateButton>
        </DateContainer>

        {loading ? (
          <Loading />
        ) : meetups.length < 1 ? (
          <NoMeetupsText>Não há meetups cadastrados nesta data</NoMeetupsText>
        ) : (
          <List
            data={meetups}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Meetup data={item} onPress={() => handleSubscription(item.id)} />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={loadMore}
            loadingMore={loadingMore}
          />
        )}
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamento',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="event" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Dashboard);
