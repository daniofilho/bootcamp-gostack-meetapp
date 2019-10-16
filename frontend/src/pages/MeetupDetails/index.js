import React  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { MdAddCircleOutline } from 'react-icons/md';
import {
  updateMeetupRequest,
  newMeetupRequest,
} from '~/store/modules/meetup/actions';

import { Container } from './styles';

import ImageInput from './ImageInput';
import DateTimePicker from './DateTimePicker';
import Loading from '~/Components/Loading';

export default function MeetupDetails() {
  const schema = Yup.object().shape({
    /* TODO: a validação do file_id não está aparecendo em tela */
    file_id: Yup.number()
      .transform(value => (!value ? undefined : value))
      .required('Uma imagem é obrigatória.'),
    title: Yup.string().required('O título é obrigatório.'),
    description: Yup.string(),
    date: Yup.date().required('A data é obrigatória.'),
    location: Yup.string().required('A localização é obrigatória.'),
  });

  const dispatch = useDispatch();

  const loading = useSelector(state => state.meetup.loading);

  const meetup = useSelector(state => state.meetup.info);
 
  function handleSubmit(data) {
    if (meetup) {
      /* EDIT */
      dispatch(updateMeetupRequest(data, meetup.id));
    } else {
      /* NEW */
      dispatch(newMeetupRequest(data));
    }
  }

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <Form initialData={meetup} onSubmit={handleSubmit} schema={schema}>
          <ImageInput name="file_id" />
          <Input name="title" placeholder="Título do Meetup" />
          <Input
            multiline
            name="description"
            placeholder="Descrição completa"
          />
          <DateTimePicker name="date" placeholder="Data do meetup" />
          <Input name="location" placeholder="Localização" />
          <button type="submit">
            <MdAddCircleOutline size={20} color="#FFF" />
            Salvar meetup
          </button>
        </Form>
      )}
    </Container>
  );
}
