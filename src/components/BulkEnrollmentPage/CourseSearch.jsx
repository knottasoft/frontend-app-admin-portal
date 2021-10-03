import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router';

import Skeleton from 'react-loading-skeleton';
import { useSubscriptionFromParams } from '../subscriptions/data/contextHooks';
import { ROUTE_NAMES } from '../EnterpriseApp/constants';
import BulkEnrollContextProvider from './BulkEnrollmentContext';
import BulkEnrollmentStepper from './stepper/BulkEnrollmentStepper';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollment.messages';

export const NO_DATA_MESSAGE = 'Нет результатов';

export const BaseCourseSearch = ({
  enterpriseId, enterpriseSlug, enterpriseName, match, intl
}) => {
  const PAGE_TITLE = intl.formatMessage(messages['bulk.course-search.page.title'], {enterpriseName: enterpriseName});
  const [subscription, isLoadingSubscription] = useSubscriptionFromParams({ match });
  if (!subscription && !isLoadingSubscription) {
    return (
      <Redirect to={`/${enterpriseSlug}/admin/${ROUTE_NAMES.bulkEnrollment}/`} />
    );
  }
  if (isLoadingSubscription) {
    return (
      <div data-testid="subscription-skelly">
        <div className="sr-only">{intl.formatMessage(messages['bulk.course-search.subscription-skelly'])}.</div>
        <Skeleton height={175} />
        <Skeleton className="mt-3" height={50} count={25} />
      </div>
    );
  }

  return (
    <>
      <Helmet title={PAGE_TITLE} />
      <BulkEnrollContextProvider>
        <BulkEnrollmentStepper
          subscription={subscription}
          enterpriseId={enterpriseId}
          enterpriseSlug={enterpriseSlug}
        />
      </BulkEnrollContextProvider>
    </>
  );
};

BaseCourseSearch.defaultProps = {
  enterpriseId: '',
  enterpriseSlug: '',
  enterpriseName: '',
};

BaseCourseSearch.propTypes = {
  intl: intlShape.isRequired,
  // from redux store
  enterpriseId: PropTypes.string,
  enterpriseSlug: PropTypes.string,
  enterpriseName: PropTypes.string,
  // from react-router
  match: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  enterpriseId: state.portalConfiguration.enterpriseId,
  enterpriseSlug: state.portalConfiguration.enterpriseSlug,
  enterpriseName: state.portalConfiguration.enterpriseName,
});

export default connect(mapStateToProps)(injectIntl(BaseCourseSearch));
