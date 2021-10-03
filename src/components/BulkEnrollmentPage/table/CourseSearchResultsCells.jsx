import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { configuration } from '../../../config';
import { injectIntl, FormattedDate } from '@edx/frontend-platform/i18n';

export const CourseNameCell = ({ value, row, enterpriseSlug }) => (
  <a
    href={`${configuration.ENTERPRISE_LEARNER_PORTAL_URL}/${enterpriseSlug}/course/${row?.original?.key}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {value}
  </a>
);

CourseNameCell.propTypes = {
  value: PropTypes.string.isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  }).isRequired,
  enterpriseSlug: PropTypes.string.isRequired,
};

export const FormattedDateCell = injectIntl(({ value }) =>
  <span>
    <FormattedDate
      value={moment(value).format('MMM D, YYYY')}
      year = 'numeric'
      month= 'long'
      day = 'numeric'
    />
  </span>
);

FormattedDateCell.propTypes = {
  value: PropTypes.string.isRequired,
};
