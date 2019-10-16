import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

import $ from 'jquery';

import Page from '~/pages/SignIn';

import { signInRequest } from '~/store/modules/auth/actions';

jest.mock('react-redux');

describe('SignIn Page', () => {
  it('should be able to login', async () => {
    // useSelector
    useSelector.mockImplementation(cb =>
      cb({
        auth: {
          loading: false,
        },
      })
    );

    // Mock dispatch
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    // component
    const { getByTestId, getByLabelText } = render(
      <Router>
        <Page />
      </Router>
    );

    // fill the form
    fireEvent.change(getByLabelText('email'), {
      target: {
        value: 'test@email.com',
      },
    });

    fireEvent.change(getByLabelText('password'), {
      target: {
        value: 'mypassword',
      },
    });

    // submit
    fireEvent.submit(getByTestId('form'));

    // expect
    expect(dispatch).toHaveBeenCalledWith(
      signInRequest('test@email.com', 'mypassword')
    );
  });
});
