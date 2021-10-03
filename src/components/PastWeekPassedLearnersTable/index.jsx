// TODO: Lang support
import React from 'react';

import TableContainer from '../../containers/TableContainer';
import EnterpriseDataApiService from '../../data/services/EnterpriseDataApiService';
import { formatTimestamp } from '../../utils';

const PastWeekPassedLearnersTable = () => {
  const tableColumns = [
    {
      label: 'Электронная почта',
      key: 'user_email',
      columnSortable: true,
    },
    {
      label: 'Название курса',
      key: 'course_title',
      columnSortable: true,
    },
    {
      label: 'Дата прохождения',
      key: 'passed_timestamp',
      columnSortable: true,
    },
  ];

  const formatLearnerData = learners => learners.map(learner => ({
    ...learner,
    user_email: <span data-hj-suppress>{learner.user_email}</span>,
    passed_timestamp: formatTimestamp({ timestamp: learner.passed_timestamp }),
  }));

  return (
    <TableContainer
      id="completed-learners-week"
      className="completed-learners-week"
      fetchMethod={(enterpriseId, options) => EnterpriseDataApiService.fetchCourseEnrollments(
        enterpriseId,
        {
          passed_date: 'last_week',
          ...options,
        },
      )}
      columns={tableColumns}
      formatData={formatLearnerData}
      tableSortable
    />
  );
};

export default PastWeekPassedLearnersTable;
