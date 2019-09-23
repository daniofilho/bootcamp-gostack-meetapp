export function listMeetupRequest(info) {
  return {
    type: '@meetup/LIST_REQUEST',
    payload: { info },
  };
}
export function listMeetupSuccess(info) {
  return {
    type: '@meetup/LIST_SUCCESS',
    payload: { info },
  };
}

export function listMeetupClearRequest() {
  return {
    type: '@meetup/LIST_CLEAR_REQUEST',
  };
}
export function listMeetupClearSuccess() {
  return {
    type: '@meetup/LIST_CLEAR_SUCCESS',
  };
}

export function updateMeetupRequest(info, meetup_id) {
  return {
    type: '@meetup/UPDATE_REQUEST',
    payload: { info, meetup_id },
  };
}
export function updateMeetupSuccess(info) {
  return {
    type: '@meetup/UPDATE_SUCCESS',
    payload: { info },
  };
}
export function updateMeetupFailure() {
  return {
    type: '@meetup/UPDATE_FAILURE',
  };
}

export function newMeetupRequest(info) {
  return {
    type: '@meetup/NEW_REQUEST',
    payload: { info },
  };
}
export function newMeetupSuccess(info) {
  return {
    type: '@meetup/NEW_SUCCESS',
    payload: { info },
  };
}
export function newMeetupFailure() {
  return {
    type: '@meetup/NEW_FAILURE',
  };
}
