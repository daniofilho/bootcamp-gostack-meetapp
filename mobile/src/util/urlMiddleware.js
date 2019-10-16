import {Platform } from 'react-native';

export default function urlMiddleware(url) {
  if (__DEV__ && Platform.OS === 'android') {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
}
