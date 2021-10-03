import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container } from '@edx/paragon';

import { Switch, Route } from 'react-router-dom';
import Hero from '../Hero';
import { MultipleSubscriptionsPage, SubscriptionData } from '../subscriptions';
import CourseSearch, { BaseCourseSearch } from './CourseSearch';
import { ROUTE_NAMES } from '../EnterpriseApp/constants';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollment.messages';

function BulkEnrollmentPage({ enterpriseId, intl }) {
  return (
    <div className="container-fluid bulk-enrollment">
      <Hero title={intl.formatMessage(messages['bulk.course-search.hero.title'])} />
      <SubscriptionData enterpriseId={enterpriseId}>
        <main role="main" className="manage-subscription">
          <Switch>
            <Route
              path={`/:enterpriseSlug/admin/${ROUTE_NAMES.bulkEnrollment}`}
              component={routeProps => (
                <Container className="py-3" fluid>
                  <MultipleSubscriptionsPage
                    {...routeProps}
                    redirectPage={ROUTE_NAMES.bulkEnrollment}
                    useCatalog
                    leadText={intl.formatMessage(messages['bulk.course-search.multi.leadText'])}
                    buttonText={intl.formatMessage(messages['bulk.course-search.multi.buttonText'])}
                  />
                </Container>
              )}
              exact
            />
            <Route
              path={`/:enterpriseSlug/admin/${ROUTE_NAMES.bulkEnrollment}/:subscriptionUUID`}
              component={CourseSearch}
              exact
            />
          </Switch>
        </main>
      </SubscriptionData>
    </div>
  );
}

BulkEnrollmentPage.propTypes = {
  intl: intlShape.isRequired,
  enterpriseId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  enterpriseId: state.portalConfiguration.enterpriseId,
});

export default connect(mapStateToProps)(injectIntl(BulkEnrollmentPage));
