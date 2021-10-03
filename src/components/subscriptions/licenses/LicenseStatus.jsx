// TODO: Lang support
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatTimestamp } from '../../../utils';
import { ACTIVATED, ASSIGNED, REVOKED } from '../data/constants';

export default function LicenseStatus({ user }) {
  const licenseStatus = useMemo(
    () => {
      switch (user.status) {
        case ACTIVATED:
          return {
            iconClassName: 'fa-check-circle text-success',
            text: 'Активированный',
          };
        case ASSIGNED:
          return {
            iconClassName: 'fa-hourglass-half text-muted',
            text: (
              <>
                <span>В ожидании</span>
                {
                  user.lastRemindDate && (
                    <span className="d-block text-muted">
                      С { formatTimestamp({ timestamp: user.lastRemindDate })}
                    </span>
                  )
                }
              </>
            ),
          };
        case REVOKED:
          return {
            iconClassName: 'fa-times-circle text-danger',
            text: 'Отозвано',
          };
        default:
          return {
            text: '-',
          };
      }
    },
    [user],
  );

  return (
    <>
      {licenseStatus.iconClassName && (
        <i className={classNames('fa mr-2', licenseStatus.iconClassName)} />
      )}
      {licenseStatus.text}
    </>
  );
}

LicenseStatus.propTypes = {
  user: PropTypes.shape({
    status: PropTypes.string.isRequired,
    lastRemindDate: PropTypes.string,
  }).isRequired,
};
