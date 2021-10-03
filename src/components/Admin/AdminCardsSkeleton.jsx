import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { FormattedMessage } from 'react-intl';

import { injectIntl } from '@edx/frontend-platform/i18n';

const AdminCardsSkeleton = () => (

  <div
    className="admin-cards-skeleton mb-3 d-md-flex w-100"
  >
    <div className="sr-only">
      <FormattedMessage id='admin.cards.skeleton' defaultMessage='Loading...' />
    </div>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </div>
);

export default injectIntl(AdminCardsSkeleton);
