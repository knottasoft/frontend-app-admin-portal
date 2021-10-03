// TODO: Lang support
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Button, Row, Col } from '@edx/paragon';

import { SubscriptionDetailContext } from './SubscriptionDetailContextProvider';
import { TAB_ALL_USERS, TAB_PENDING_USERS } from './data/constants';
import InviteLearnersButton from './buttons/InviteLearnersButton';
import { SubscriptionContext } from './SubscriptionData';
import { ToastsContext } from '../Toasts';

import { injectIntl, FormattedDate } from '@edx/frontend-platform/i18n';

const SubscriptionDetails = ({ enterpriseSlug }) => {
  const { forceRefresh } = useContext(SubscriptionContext);
  const {
    activeTab,
    setActiveTab,
    hasMultipleSubscriptions,
    subscription,
  } = useContext(SubscriptionDetailContext);
  const { addToast } = useContext(ToastsContext);
  return (
    <>
      {hasMultipleSubscriptions && (
        <Row className="ml-0 mb-3">
          <Link to={`/${enterpriseSlug}/admin/subscriptions`}>
            <Button variant="outline-primary">
              <FontAwesomeIcon icon={faAngleLeft} className="mr-2" />
              Назад к подпискам
            </Button>
          </Link>
        </Row>
      )}
      <Row className="mb-5">
        <Col className="mb-3 mb-lg-0">
          <Row className="m-0 justify-content-between">
            <h2>{subscription?.title}</h2>
            {(subscription.licenses?.allocated > 0 || activeTab !== TAB_ALL_USERS) && (
              <div className="text-md-right">
                <InviteLearnersButton
                  onSuccess={({ numAlreadyAssociated, numSuccessfulAssignments }) => {
                    forceRefresh();
                    addToast(`${numAlreadyAssociated} адреса электронной почты были назначены ранее. ${numSuccessfulAssignments} адреса электронной почты были успешно добавлены.`);
                    setActiveTab(TAB_PENDING_USERS);
                  }}
                />
              </div>
            )}
          </Row>
          <div className="mt-3 d-flex align-items-center">
            <div className="mr-5">
              <div className="text-uppercase text-muted">
                <small>Дата начала</small>
              </div>
              <div className="lead">
                < FormattedDate value={moment(subscription?.startDate).format('MMMM D, YYYY')} />
              </div>
            </div>
            <div>
              <div className="text-uppercase text-muted">
                <small>Дата окончания</small>
              </div>
              <div className="lead">
                <FormattedDate value={moment(subscription?.expirationDate).format('MMMM D, YYYY')} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

SubscriptionDetails.propTypes = {
  enterpriseSlug: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  enterpriseSlug: state.portalConfiguration.enterpriseSlug,
});

export default connect(mapStateToProps)(injectIntl(SubscriptionDetails));
