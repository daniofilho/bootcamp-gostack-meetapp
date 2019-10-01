import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import nl2br from 'react-nl2br';

import { MdDeleteForever, MdModeEdit, MdEvent, MdPlace } from 'react-icons/md';

import { Container, EditButton, CancelButton } from './styles';

import api from '~/services/api';
import history from '~/services/history';

import Loading from '~/Components/Loading';

export default function Meetup() {
  const [loading, setLoading] = useState(false);

  const meetup = useSelector(state => state.meetup.info);

  async function cancelMeetup(meetup_id) {
    setLoading(true);
    await api.delete(`/meetups/${meetup_id}`);
    setLoading(false);
    history.push('/');
  }

  async function cancelMeetupRequest(meetup_id) {
    confirmAlert({
      title: 'Atenção!',
      message: 'Tem certeza que deseja cancelar este Meetup?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => cancelMeetup(meetup_id),
        },
        {
          label: 'Não',
          onClick: () => {},
        },
      ],
    });
  }

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          <header>
            <h1>{meetup.title}</h1>
            {/* Não pode editar meetups que passaram */
            !meetup.past && (
              <div>
                <EditButton to="/meetup/details/">
                  <MdModeEdit size={20} color="#FFF" />
                  Editar
                </EditButton>
                <CancelButton
                  onClick={() => {
                    cancelMeetupRequest(meetup.id);
                  }}
                >
                  <MdDeleteForever size={20} color="#FFF" />
                  Cancelar
                </CancelButton>
              </div>
            )}
          </header>
          <section>
            <img src={meetup.File.url} alt={meetup.title} />
            <p>{nl2br(meetup.description)}</p>
          </section>
          <footer>
            <time>
              <MdEvent size={20} color="#FFF" />
              {meetup.formatedDate}
            </time>
            <span>
              <MdPlace size={20} color="#FFF" />
              {meetup.location}
            </span>
          </footer>
        </>
      )}
    </Container>
  );
}
