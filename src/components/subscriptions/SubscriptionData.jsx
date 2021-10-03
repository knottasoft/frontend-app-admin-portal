// TODO: Lang support
import React, { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useSubscriptionData } from './data/hooks';
import StatusAlert from '../StatusAlert';

export const SubscriptionContext = createContext({});

export default function SubscriptionData({ children, enterpriseId }) {
  const {
    subscriptions,
    errors,
    setErrors,
    forceRefresh,
    loading,
  } = useSubscriptionData({ enterpriseId });
  const hasSubscription = subscriptions?.length > 0;

  const context = useMemo(() => ({
    data: subscriptions,
    errors,
    setErrors,
    forceRefresh,
    loading,
  }), [subscriptions, errors, loading]);

  if (subscriptions) {
    return (
      <SubscriptionContext.Provider value={context}>
        {children}
      </SubscriptionContext.Provider>
    );
  }

  return (
    <StatusAlert
      className="mt-3"
      alertType={!hasSubscription ? 'danger' : ''}
      message={!hasSubscription ? `У вашей организации нет активных подписок для управления.
      Если вы считаете, что видите это сообщение ошибочно,
      пожалуйста, свяжитесь с командой ЦОПП СК по адресу support@copp26.ru.` : ''}
    />
  );
}

SubscriptionData.propTypes = {
  children: PropTypes.node.isRequired,
  enterpriseId: PropTypes.string.isRequired,
};
