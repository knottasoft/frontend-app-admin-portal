// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { SubmissionError } from 'redux-form';
import { MailtoLink } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';

import SupportForm from './SupportForm';
import Hero from '../Hero';
import { features } from '../../config/index';

import ZendeskApiService from '../../data/services/ZendeskApiService';

class SupportPage extends React.Component {
  hasEmailAndEnterpriseName() {
    const { emailAddress, enterpriseName } = this.props;
    return !!(emailAddress && enterpriseName);
  }

  render() {
    const {
      emailAddress,
      enterpriseName,
      match,
    } = this.props;

    return (
      <>
        <Helmet>
          <title>Служба поддержки</title>
        </Helmet>
        <Hero title="Служба поддержки" />
        <div className="container-fluid">
          <div className="row my-3">
            <div className="col">
              {features.SUPPORT && this.hasEmailAndEnterpriseName() ? (
                <SupportForm
                  onSubmit={options => (
                    ZendeskApiService.createZendeskTicket(options)
                      .then(response => response)
                      .catch((error) => {
                        logError(error);
                        throw new SubmissionError({ _error: error });
                      })
                  )}
                  initialValues={{
                    emailAddress, enterpriseName, subject: '', notes: '',
                  }}
                  match={match}
                />
              ) : (
                <p>
                  Для получения помощи, пожалуйста, свяжитесь с командой ЦОПП СК по адресу
                  {' '}
                  <MailtoLink to="customersuccess@edx.org">support@copp26.ru</MailtoLink>.
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

SupportPage.defaultProps = {
  enterpriseName: null,
  emailAddress: null,
};

SupportPage.propTypes = {
  enterpriseName: PropTypes.string,
  emailAddress: PropTypes.string,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default SupportPage;
