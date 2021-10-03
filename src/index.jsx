import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  initialize, APP_INIT_ERROR, APP_READY, subscribe, mergeConfig,
} from '@edx/frontend-platform';
import { ErrorPage } from '@edx/frontend-platform/react';

import * as FullStory from '@fullstory/browser';

import { configuration } from './config';

import App from './components/App';

import appMessages from './i18n';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        // Logs JS errors matching the following regex as NewRelic page actions instead of
        // errors,reducing JS error noise.
        IGNORED_ERROR_REGEX: '(Axios Error|\'removeChild\'|Script error|getReadModeExtract)',
      });
    },
  },
  messages: [
    appMessages
  ],
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: true,
});

if (configuration.FULLSTORY_ORG_ID) {
  FullStory.init({
    orgId: configuration.FULLSTORY_ORG_ID,
    devMode: !configuration.FULLSTORY_ENABLED,
  });
}
