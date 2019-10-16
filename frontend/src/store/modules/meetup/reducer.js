import produce from 'immer';

const INITIAL_STATE = {
  info: null,
  loading: true,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      // # UPDATE
      case '@meetup/UPDATE_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@meetup/UPDATE_SUCCESS': {
        draft.info = action.payload.info;
        draft.loading = false;
        break;
      }
      case '@meetup/UPDATE_FAILURE': {
        draft.loading = false;
        break;
      }
      // # LIST
      case '@meetup/LIST_SUCCESS': {
        draft.info = action.payload.info;
        break;
      }
      case '@meetup/LIST_CLEAR_SUCCESS': {
        draft.info = null;
        break;
      }
      // # NEW
      case '@meetup/NEW_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@meetup/NEW_SUCCESS': {
        draft.info = action.payload.info;
        draft.loading = false;
        break;
      }
      case '@meetup/NEW_FAILURE': {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
