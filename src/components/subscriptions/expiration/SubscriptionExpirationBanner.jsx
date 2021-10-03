// TODO: Lang support
import React, { useContext } from 'react';
import { MailtoLink } from '@edx/paragon';

import StatusAlert from '../../StatusAlert';
import {
  SUBSCRIPTION_DAYS_REMAINING_MODERATE,
  SUBSCRIPTION_DAYS_REMAINING_SEVERE,
  SUBSCRIPTION_DAYS_REMAINING_EXCEPTIONAL,
} from '../data/constants';
import { SubscriptionDetailContext } from '../SubscriptionDetailContextProvider';

const SubscriptionExpirationBanner = () => {
  const { subscription: { daysUntilExpiration }, hasMultipleSubscriptions } = useContext(SubscriptionDetailContext);

  const renderMessage = () => (
    <>
      {hasMultipleSubscriptions && daysUntilExpiration <= 0 ? (
        <>
          Срок действия этой когорты подписчиков истек. Вы все еще можете просматривать статусы обучающихся, которые участвовали в программе.
        </>
      ) : (
        <>
          До истечения срока действия вашей подписки осталось {daysUntilExpiration} дней.
          Свяжитесь с командой ЦОПП СК по адресу
          {' '}
          <MailtoLink to="customersuccess@edx.org">support@copp26.ru</MailtoLink>
          {' '}
          для продления контракта.
        </>
      )}
    </>
  );

  if (daysUntilExpiration > SUBSCRIPTION_DAYS_REMAINING_MODERATE) {
    return null;
  }

  let dismissible = true;
  let alertType = 'info';
  if (daysUntilExpiration <= SUBSCRIPTION_DAYS_REMAINING_SEVERE) {
    alertType = 'warning';
  }
  if (daysUntilExpiration <= SUBSCRIPTION_DAYS_REMAINING_EXCEPTIONAL) {
    dismissible = false;
    alertType = 'danger';
  }

  return (
    <StatusAlert
      className="expiration-alert mt-1"
      alertType={alertType}
      message={renderMessage(daysUntilExpiration)}
      dismissible={dismissible}
    />
  );
};

export default SubscriptionExpirationBanner;
