// TODO: Lang support
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ModalDialog, MailtoLink } from '@edx/paragon';

import { configuration } from '../../../config';
import Img from '../../Img';
import { formatTimestamp } from '../../../utils';
import { SubscriptionDetailContext } from '../SubscriptionDetailContextProvider';

export const EXPIRED_MODAL_TITLE = 'This subscription cohort is expired';

const SubscriptionExpiredModal = ({
  onClose,
  isOpen,
  enableCodeManagementScreen,
  enterpriseSlug,
}) => {
  const { subscription: { expirationDate } } = useContext(SubscriptionDetailContext);

  return (
    <ModalDialog
      title={EXPIRED_MODAL_TITLE}
      onClose={onClose}
      isOpen={isOpen}
      hasCloseButton={false}
    >
      <ModalDialog.Body>
        <Img className="w-25 my-5 mx-auto d-block" src={configuration.LOGO_URL} alt="edX logo" />
        <p>
          Срок действия этой когорты подписчиков истек <b>{formatTimestamp({ timestamp: expirationDate })}</b>.
          {' '}
          Чтобы внести изменения в эту когорту, свяжитесь с ЦОПП СК для повторной активации подписки.
        </p>
        <p>Что делать дальше?</p>
        <ul>
          <li>
            Чтобы возобновить подписку, пожалуйста, свяжитесь с командой ЦОПП СК по адресу
            {' '}
            <MailtoLink to="customersuccess@edx.org">support@copp26.ru</MailtoLink>
          </li>
          {enableCodeManagementScreen && (
            <li>
              Управляйте своими кодами на <Link to={`/${enterpriseSlug}/admin/coupons`}>странице управления кодами</Link>
            </li>
          )}
        </ul>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

SubscriptionExpiredModal.propTypes = {
  enterpriseSlug: PropTypes.string.isRequired,
  enableCodeManagementScreen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

SubscriptionExpiredModal.defaultProps = {
  isOpen: false,
};

const mapStateToProps = state => ({
  enterpriseSlug: state.portalConfiguration.enterpriseSlug,
  enableCodeManagementScreen: state.portalConfiguration.enableCodeManagementScreen,
});

export default connect(mapStateToProps)(SubscriptionExpiredModal);
