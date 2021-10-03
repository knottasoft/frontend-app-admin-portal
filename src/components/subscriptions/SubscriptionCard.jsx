// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '@edx/paragon';
import { ROUTE_NAMES } from '../EnterpriseApp/constants';

import { injectIntl, FormattedDate } from '@edx/frontend-platform/i18n';

const SubscriptionCard = ({
  uuid,
  title,
  enterpriseSlug,
  startDate,
  expirationDate,
  redirectPage,
  buttonText,
  licenses: {
    allocated,
    total,
  },
}) => {
  const formattedStartDate = moment(startDate).format('MMMM D, YYYY');
  const formattedExpirationDate = moment(expirationDate).format('MMMM D, YYYY');
  const isExpired = moment().isAfter(expirationDate);
  const buttonDisplayText = buttonText || `${isExpired ? 'View' : 'Manage'} learners`;

  return (
    <Card className="subscription-card w-100">
      <Card.Body>
        <Card.Title className="mb-0">
          {title}
        </Card.Title>
        {isExpired && (
          <div>
            <Badge variant="danger">
              Истекший
            </Badge>
          </div>
        )}
        <p className="mt-2 small">
          <FormattedDate value={formattedStartDate} /> - <FormattedDate value={formattedExpirationDate} />
        </p>
        <p className="mt-3 mb-0 small">
          Назначено лицензий
        </p>
        <p className="lead font-weight-bold">
          {allocated} из {total}
        </p>
        <div className="d-flex">
          <div className="ml-auto">
            <Button as={Link} to={`/${enterpriseSlug}/admin/${redirectPage}/${uuid}`} variant="outline-primary">
              {buttonDisplayText}
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

SubscriptionCard.defaultProps = {
  redirectPage: ROUTE_NAMES.subscriptionManagement,
  buttonText: null,
};

SubscriptionCard.propTypes = {
  uuid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  enterpriseSlug: PropTypes.string.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  expirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  licenses: PropTypes.shape({
    allocated: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  redirectPage: PropTypes.string,
  buttonText: PropTypes.string,
};

export default injectIntl(SubscriptionCard);
