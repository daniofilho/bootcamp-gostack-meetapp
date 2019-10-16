import { all, takeLatest, put, call } from 'redux-saga/effects';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import {
  listMeetupSuccess,
  listMeetupClearSuccess,
  updateMeetupSuccess,
  updateMeetupFailure,
  newMeetupFailure,
  newMeetupSuccess,
} from './actions';

export function* listMeetup({ payload }) {
  const meetupInfo = payload.info;

  yield put(
    listMeetupSuccess({
      ...meetupInfo,
      formatedDate: format(
        parseISO(meetupInfo.date),
        "d 'de' MMMM, 'às' HH'h'mm",
        {
          locale: pt,
        }
      ),
    })
  );
  history.push('/meetup');
}

export function* listMeetupClearSaga() {
  yield put(listMeetupClearSuccess());
  history.push('/meetup/details');
}

export function* updateMeetup({ payload }) {
  try {
    const { info, meetup_id } = payload;
    const { title, description, date, location, file_id } = info;

    const response = yield call(api.put, `/meetups/${meetup_id}`, {
      title,
      description,
      date,
      location,
      file_id,
    });

    toast.success('Meetup atualizado com sucesso!');
    history.push('/meetup');

    response.data.formatedDate = format(
      parseISO(response.data.date),
      "d 'de' MMMM, 'às' HH'h'mm",
      {
        locale: pt,
      }
    );

    yield put(updateMeetupSuccess(response.data));
  } catch (error) {
    toast.error('Erro ao atualizar o meetup, verifique os campos.');
    yield put(updateMeetupFailure());
  }
}

export function* newMeetup({ payload }) {
  try {
    const { title, description, date, location, file_id } = payload.info;

    const response = yield call(api.post, '/meetups', {
      title,
      description,
      date,
      location,
      file_id,
    });

    toast.success('Meetup criado com sucesso!');
    history.push('/');

    yield put(newMeetupSuccess(response.data));
  } catch (error) {
    toast.error('Erro ao criar o meetup, verifique os campos.');
    yield put(newMeetupFailure());
  }
}

export default all([
  takeLatest('@meetup/UPDATE_REQUEST', updateMeetup),
  takeLatest('@meetup/LIST_REQUEST', listMeetup),
  takeLatest('@meetup/LIST_CLEAR_REQUEST', listMeetupClearSaga),
  takeLatest('@meetup/NEW_REQUEST', newMeetup),
]);
