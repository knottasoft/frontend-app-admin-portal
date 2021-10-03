// TODO: Lang support
import React from 'react';

import TableContainer from '../../containers/TableContainer';
import EnterpriseDataApiService from '../../data/services/EnterpriseDataApiService';

const CompletedLearnersTable = () => {
  const tableColumns = [
    {
      label: 'Электронная почта',
      key: 'user_email',
      columnSortable: true,
    },
    {
      label: 'Всего пройденных курсов',
      key: 'completed_courses',
      columnSortable: true,
    },
  ];

  const formatLearnerData = learners => learners.map(learner => ({
    ...learner,
    user_email: <span data-hj-suppress>{learner.user_email}</span>,
  }));

  return (
    <TableContainer
      id="completed-learners"
      className="completed-learners"
      fetchMethod={EnterpriseDataApiService.fetchCompletedLearners}
      columns={tableColumns}
      formatData={formatLearnerData}
      tableSortable
    />
  );
};

export default CompletedLearnersTable;
