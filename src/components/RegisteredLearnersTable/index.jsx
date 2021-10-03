// TODO: Lang support
import React from 'react';

import TableContainer from '../../containers/TableContainer';

import { formatTimestamp } from '../../utils';
import EnterpriseDataApiService from '../../data/services/EnterpriseDataApiService';

const RegisteredLearnersTable = () => {
  const tableColumns = [
    {
      label: 'Электронная почта',
      key: 'user_email',
      columnSortable: true,
    },
    {
      label: 'Созданный аккаунт',
      key: 'user_account_creation_timestamp',
      columnSortable: true,
    },
  ];

  const formatLearnerData = learners => learners.map(learner => ({
    ...learner,
    user_email: <span data-hj-suppress>{learners.user_email}</span>,
    user_account_creation_timestamp: formatTimestamp({
      timestamp: learner.user_account_creation_timestamp,
    }),
  }));

  return (
    <TableContainer
      id="registered-unenrolled-learners"
      className="registered-unenrolled-learners"
      fetchMethod={EnterpriseDataApiService.fetchUnenrolledRegisteredLearners}
      columns={tableColumns}
      formatData={formatLearnerData}
      tableSortable
    />
  );
};

export default RegisteredLearnersTable;
