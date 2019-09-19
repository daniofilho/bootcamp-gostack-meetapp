import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { MdAddCircleOutline } from 'react-icons/md';
import api from '~/services/api';

import { Container, ButtonLink, MeetupList, Meetup } from './styles';

import Loading from '~/Components/Loading';

import {
  listMeetupRequest,
  listMeetupClearRequest,
} from '~/store/modules/meetup/actions';

export default function Dashboard() {
  const dispatch = useDispatch();

  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeetups() {
      const response = await api.get('/meetups');

      const data = response.data.map(meetup => ({
        ...meetup,
        dateFormatted: format(
          parseISO(meetup.date),
          "d 'de' MMMM, 'às' HH'h'mm",
          {
            locale: pt,
          }
        ),
      }));

      setMeetups(data);
      setLoading(false);
    }
    loadMeetups();
  }, []);

  function goToMeetupDetails(meetup) {
    dispatch(listMeetupRequest(meetup));
  }

  function newMeetup() {
    dispatch(listMeetupClearRequest());
  }

  return (
    <Container>
      <header>
        <h1>Meus meetups</h1>
        <ButtonLink
          onClick={() => {
            newMeetup();
          }}
        >
          <MdAddCircleOutline size={20} color="FFF" />
          Novo meetup
        </ButtonLink>
      </header>

      {loading ? (
        <Loading />
      ) : (
        <MeetupList>
          {meetups.map(meetup => (
            <Meetup
              key={meetup.id}
              onClick={() => {
                goToMeetupDetails(meetup);
              }}
              past={meetup.past.toString()}
            >
              <strong>{meetup.title}</strong>
              <time>{meetup.dateFormatted}</time>
            </Meetup>
          ))}
        </MeetupList>
      )}
    </Container>
  );
}
