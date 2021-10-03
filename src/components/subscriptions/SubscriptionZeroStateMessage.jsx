// TODO: Lang support
import React, { useContext } from 'react';
import { Card } from '@edx/paragon';
import InviteLearnersButton from './buttons/InviteLearnersButton';
import { TAB_PENDING_USERS } from './data/constants';
import { SubscriptionContext } from './SubscriptionData';
import { ToastsContext } from '../Toasts';
import { SubscriptionDetailContext } from './SubscriptionDetailContextProvider';

const SubscriptionZeroStateMessage = () => {
  const { addToast } = useContext(ToastsContext);
  const { forceRefresh } = useContext(SubscriptionContext);
  const { setActiveTab } = useContext(SubscriptionDetailContext);
  return (
    <Card className="text-center">
      <Card.Body>
        <h2>Начало работы</h2>
        <p className="py-2 lead">
          Назначьте своим обучающимся лицензию на подписку, чтобы обеспечить им возможность обучения на платформе ЦОПП СК.
        </p>
        <InviteLearnersButton
          onSuccess={({ numSuccessfulAssignments }) => {
            forceRefresh();
            addToast(`${numSuccessfulAssignments} адреса электронной почты были успешно добавлены.`);
            setActiveTab(TAB_PENDING_USERS);
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default SubscriptionZeroStateMessage;
