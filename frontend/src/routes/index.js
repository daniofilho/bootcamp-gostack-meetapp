import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import _404 from '../pages/404';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import Meetup from '../pages/Meetup';
import MeetupDetails from '../pages/MeetupDetails';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/dashboard" isPrivate component={Dashboard} />
      <Route path="/profile" isPrivate component={Profile} />

      <Route path="/meetup" exact isPrivate component={Meetup} />
      <Route path="/meetup/details" isPrivate component={MeetupDetails} />

      <Route path="/" component={_404} />
    </Switch>
  );
}
