// TODO: Lang support
import React, { useContext } from 'react';
import classNames from 'classnames';

import {
  TAB_ALL_USERS,
  TAB_LICENSED_USERS,
  TAB_PENDING_USERS,
  TAB_REVOKED_USERS,
  DEFAULT_PAGE,
} from '../data/constants';
import { SubscriptionDetailContext } from '../SubscriptionDetailContextProvider';

const LicenseAllocationNavigation = () => {
  const {
    activeTab,
    overview,
    setActiveTab,
    setCurrentPage,
  } = useContext(SubscriptionDetailContext);
  const tabs = [
    {
      key: TAB_ALL_USERS,
      text: `Все пользователи (${overview.assigned + overview.activated + overview.revoked})`,
    },
    {
      key: TAB_LICENSED_USERS,
      text: `Лицензированные пользователи (${overview.activated})`,
    },
    {
      key: TAB_PENDING_USERS,
      text: `Ожидающие пользователи (${overview.assigned})`,
    },
    {
      key: TAB_REVOKED_USERS,
      text: `Отозванные пользователи (${overview.revoked})`,
    },
  ];

  function updateTabWithDefaultPage(key) {
    setActiveTab(key);
    setCurrentPage(DEFAULT_PAGE);
  }

  return (
    <nav className="nav sticky-top">
      <ul className="list-unstyled w-100">
        {tabs.map(tab => (
          <li key={tab.key}>
            <button
              id={`navigation-${tab.key}`}
              className={classNames(
                'btn btn-link btn-block pl-0 text-left',
                { 'font-weight-bold': activeTab === tab.key },
              )}
              onClick={() => updateTabWithDefaultPage(tab.key)}
              type="button"
            >
              {tab.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LicenseAllocationNavigation;
