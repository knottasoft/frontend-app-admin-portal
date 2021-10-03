// TODO: Lang support
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import {
  Container, Row, Col, Alert, MailtoLink,
} from '@edx/paragon';
import { getAuthenticatedUser, hydrateAuthenticatedUser } from '@edx/frontend-platform/auth';
import { LoginRedirect } from '@edx/frontend-enterprise-logistration';

import { useInterval } from '../../hooks';
import { ToastsContext } from '../Toasts';
import EnterpriseAppSkeleton from '../EnterpriseApp/EnterpriseAppSkeleton';

const USER_ACCOUNT_POLLING_TIMEOUT = 5000;

const UserActivationPage = ({ match }) => {
  const user = getAuthenticatedUser();

  if (!user) {
    // user is not authenticated, so redirect to enterprise proxy login flow
    return (
      <LoginRedirect
        loadingDisplay={<EnterpriseAppSkeleton />}
      />
    );
  }
  const { enterpriseSlug } = match.params;
  const { addToast } = useContext(ToastsContext);
  const { roles, isActive } = user;

  if (!roles?.length) {
    // user is authenticated but doesn't have any JWT roles so redirect the user to
    // `:enterpriseSlug/admin/register` to force a log out in an attempt to refresh JWT roles.
    return (
      <Redirect to={`/${enterpriseSlug}/admin/register`} />
    );
  }

  if (isActive === undefined) {
    // user hydration is still pending when ``isActive`` is undefined, so display app skeleton state
    return <EnterpriseAppSkeleton />;
  }

  useInterval(() => {
    if (!isActive) {
      hydrateAuthenticatedUser();
    }
  }, USER_ACCOUNT_POLLING_TIMEOUT);

  // user data is hydrated with a verified email address, so redirect the user
  // to the default page in the Admin Portal.
  if (isActive) {
    addToast('Ваша учетная запись администратора была успешно активирована.');
    return <Redirect to={`/${enterpriseSlug}/admin/learners`} />;
  }

  // user data is hydrated with an unverified email address, so display a warning message since
  // they have not yet verified their email via the "Activate your account" flow, so we should
  // prevent access to the Admin Portal.
  return (
    <Container style={{ flex: 1 }} fluid>
      <Row className="my-3 justify-content-md-center">
        <Col xs lg={8} offset={1}>
          <Alert variant="warning">
            <p>
              Чтобы продолжить, вы должны подтвердить свой адрес электронной почты для активации
              вашей учетной записи. Пожалуйста, оставайтесь на этой странице, так как она будет автоматически обновляться
              как только ваша учетная запись будет активирована.
            </p>
            <p className="mb-0">
              Если у вас возникнут дополнительные проблемы, пожалуйста, свяжитесь с командой ЦОПП СК по адресу{' '}
              <MailtoLink className="alert-link" to="support@copp26.ru">
                support@copp26.ru
              </MailtoLink>.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

UserActivationPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enterpriseSlug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserActivationPage;
