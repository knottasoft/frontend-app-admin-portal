// TODO: Lang support
import React, { useContext, useEffect, useMemo } from 'react';
import {
  Alert,
  Icon,
  Pagination,
  Table,
  MailtoLink,
  useToggle,
} from '@edx/paragon';
import { Error, WarningFilled } from '@edx/paragon/icons';

import LoadingMessage from '../../LoadingMessage';
import { ToastsContext } from '../../Toasts';
import RemindUsersButton from '../buttons/RemindUsersButton';
import {
  TAB_ALL_USERS,
  TAB_LICENSED_USERS,
  TAB_PENDING_USERS,
  TAB_REVOKED_USERS,
} from '../data/constants';
import LicenseActions from './LicenseActions';
import LicenseStatus from './LicenseStatus';
import { SubscriptionDetailContext } from '../SubscriptionDetailContextProvider';
import { useSubscriptionUsers } from '../data/hooks';
import { SubscriptionContext } from '../SubscriptionData';
import SubscriptionZeroStateMessage from '../SubscriptionZeroStateMessage';

const columns = [
  {
    label: 'Адрес электронной почты',
    key: 'emailAddress',
  },
  {
    label: 'Статус',
    key: 'status',
  },
  {
    label: 'Действия',
    key: 'actions',
  },
];

const LicenseManagementTabContentTable = () => {
  const { errors, forceRefresh, setErrors } = useContext(SubscriptionContext);
  const {
    activeTab,
    currentPage,
    overview,
    searchQuery,
    setCurrentPage,
    subscription,
  } = useContext(SubscriptionDetailContext);
  const { addToast } = useContext(ToastsContext);

  const users = useSubscriptionUsers({
    activeTab,
    currentPage,
    searchQuery,
    subscriptionUUID: subscription.uuid,
    errors,
    setErrors,
  });

  const hasErrors = Object.values(errors).length > 0;
  const hasLoadedUsers = !!(users?.numPages || users?.count);

  const isRevocationCapEnabled = subscription?.isRevocationCapEnabled;
  const hasNoRevocationsRemaining = !!(isRevocationCapEnabled && subscription?.revocations?.remaining <= 0);

  const [isRevocationLimitAlertOpen, openRevocationLimitAlert, closeRevocationLimitAlert] = useToggle(false);
  useEffect(() => {
    if (hasNoRevocationsRemaining && !isRevocationLimitAlertOpen) {
      openRevocationLimitAlert();
    }
  }, [hasNoRevocationsRemaining]);

  const activeTabData = useMemo(() => {
    switch (activeTab) {
      case TAB_ALL_USERS:
        return {
          title: 'Все пользователи',
          paginationLabel: 'пагинация для всех пользователей',
          noResultsLabel: 'Нет пользователей, находящихся на рассмотрении, активированных или отозванных',
        };
      case TAB_PENDING_USERS:
        return {
          title: 'Ожидающие пользователи',
          paginationLabel: 'пагинация для ожидающих пользователей',
          noResultsLabel: 'Нет ожидающих пользователей',
        };
      case TAB_LICENSED_USERS:
        return {
          title: 'Лицензированные пользователи',
          paginationLabel: 'пагинация для лицензированных пользователей',
          noResultsLabel: 'Нет лицензированных пользователей',
        };
      case TAB_REVOKED_USERS:
        return {
          title: 'Отозванные пользователи',
          paginationLabel: 'пагинация для отозванных пользователей',
          noResultsLabel: 'Нет отозванных пользователей',
        };
      default:
        return null;
    }
  }, [activeTab]);

  const tableData = useMemo(
    () => users?.results?.map(user => ({
      emailAddress: <span data-hj-suppress>{user.userEmail}</span>,
      status: (
        <LicenseStatus user={user} />
      ),
      actions: (
        <LicenseActions user={user} />
      ),
    })),
    [users],
  );

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="mb-3">{activeTabData.title}</h3>
        {activeTab === TAB_PENDING_USERS && tableData?.length > 0 && (
          <RemindUsersButton
            pendingUsersCount={overview.assigned}
            isBulkRemind
            onSuccess={() => {
              addToast('Напоминания успешно отправлены');
              forceRefresh();
            }}
            subscriptionUUID={subscription.uuid}
          />
        )}
      </div>
      {!hasLoadedUsers && (
        <LoadingMessage className="loading mt-3 subscriptions" />
      )}
      {hasErrors && Object.entries(errors).map(([title, message]) => (
        <Alert
          key={title}
          className="mt-3"
          variant="danger"
        >
          <Icon src={Error} className="alert-icon" />
          <Alert.Heading>Невозможно загрузить данные для {title}</Alert.Heading>
          <p>Попробуйте обновить экран ({message})</p>
        </Alert>
      ))}
      {!hasErrors && hasLoadedUsers && (
        <>
          {activeTab === TAB_ALL_USERS && tableData?.length === 0 && !searchQuery ? (
            <SubscriptionZeroStateMessage />
          ) : (
            <>
              {tableData?.length > 0 ? (
                <>
                  <Alert
                    variant="warning"
                    show={isRevocationLimitAlertOpen}
                    onClose={closeRevocationLimitAlert}
                    dismissible
                  >
                    Вы достигли лимита отзыва доступа. Для получения помощи
                    управления лицензиями на подписку,
                    {' '}
                    <MailtoLink to="customersuccess@edx.org" className="alert-link">
                      связаться со службой поддержки клиентов
                    </MailtoLink>.
                  </Alert>
                  <div className="table-responsive">
                    <Table
                      data={tableData}
                      columns={columns}
                      className="table-striped"
                    />
                  </div>
                  <div className="mt-3 d-flex justify-content-center">
                    <Pagination
                      onPageSelect={page => setCurrentPage(page)}
                      pageCount={users.numPages || 1}
                      currentPage={currentPage}
                      paginationLabel={activeTabData.paginationLabel}
                    />
                  </div>
                </>
              ) : (
                <>
                  <hr className="mt-0" />
                  <Alert variant="warning">
                    <Icon src={WarningFilled} className="alert-icon" />
                    <Alert.Heading>Результаты не найдены</Alert.Heading>
                    <p>{activeTabData.noResultsLabel}</p>
                  </Alert>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default LicenseManagementTabContentTable;
