// TODO: Lang support
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { ModalDialog, MailtoLink } from '@edx/paragon';

import { SubscriptionDetailContext } from '../SubscriptionDetailContextProvider';
import { getSubscriptionExpiringCookieName } from '../data/utils';

import { formatTimestamp } from '../../../utils';

export const EXPIRING_MODAL_TITLE = 'Продлить подписку с истекающим сроком действия';

const SubscriptionExpiringModal = ({
  onClose,
  isOpen,
  expirationThreshold,
  enterpriseId,
}) => {
  const { subscription: { daysUntilExpiration, expirationDate } } = useContext(SubscriptionDetailContext);

  const handleClose = () => {
    if (expirationThreshold) {
      const cookies = new Cookies();
      const seenCurrentExpirationModalCookieName = getSubscriptionExpiringCookieName({
        expirationThreshold,
        enterpriseId,
      });
      // Mark that the user has seen this range's expiration modal when they close it
      cookies.set(
        seenCurrentExpirationModalCookieName,
        true,
        // Cookies without the `sameSite` attribute are rejected if they are missing the `secure`
        // attribute. See
        // https//developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        { sameSite: 'strict' },
      );
    }
    onClose();
  };

  return (
    <ModalDialog
      title={EXPIRING_MODAL_TITLE}
      onClose={handleClose}
      isOpen={isOpen}
      hasCloseButton={false}
    >
      <ModalDialog.Body>
        <p>
          Срок действия этой когорты подписчиков истекает через {daysUntilExpiration} дней.
          Чтобы минимизировать сбои в доступе к курсу для ваших учеников, убедитесь, что счет оплачен.
        </p>
        <p>
          Если у вас есть вопросы или вам нужна помощь, пожалуйста, свяжитесь с командой ЦОПП СК по адресу
          {' '}
          <MailtoLink to="customersuccess@edx.org">support@copp26.ru</MailtoLink>.
        </p>
        <i>
          Срок действия доступа истекает {formatTimestamp({ timestamp: expirationDate })}
        </i>
      </ModalDialog.Body>
    </ModalDialog>
  );
};

SubscriptionExpiringModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  expirationThreshold: PropTypes.number,
};

SubscriptionExpiringModal.defaultProps = {
  isOpen: false,
  expirationThreshold: null,
};

export default SubscriptionExpiringModal;
