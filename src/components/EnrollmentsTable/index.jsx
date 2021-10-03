// TODO: Lang support
import React from 'react';

import TableContainer from '../../containers/TableContainer';
import { formatTimestamp, formatPassedTimestamp, formatPercentage } from '../../utils';
import EnterpriseDataApiService from '../../data/services/EnterpriseDataApiService';

const EnrollmentsTable = () => {
  const enrollmentTableColumns = [
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
      label: 'Цена курса',
      key: 'course_price',
      columnSortable: true,
    },
    {
      label: 'Дата начала',
      key: 'course_start',
      columnSortable: true,
    },
    {
      label: 'Дата окончания',
      key: 'course_end',
      columnSortable: true,
    },
    {
      label: 'Дата прохождения',
      key: 'passed_timestamp',
      columnSortable: true,
    },
    {
      label: 'Текущая оценка',
      key: 'current_grade',
      columnSortable: true,
    },
    {
      label: 'Состояние прогресса',
      key: 'progress_status',
      columnSortable: true,
    },
    {
      label: 'Дата последней активности',
      key: 'last_activity_date',
      columnSortable: true,
    },
  ];

  const formatEnrollmentData = enrollments => enrollments.map(enrollment => ({
    ...enrollment,
    user_email: <span data-hj-suppress>{enrollment.user_email}</span>,
    last_activity_date: formatTimestamp({ timestamp: enrollment.last_activity_date }),
    course_start: formatTimestamp({ timestamp: enrollment.course_start }),
    course_end: formatTimestamp({ timestamp: enrollment.course_end }),
    enrollment_created_timestamp: formatTimestamp({
      timestamp: enrollment.enrollment_created_timestamp,
    }),
    passed_timestamp: formatPassedTimestamp(enrollment.passed_timestamp),
    user_account_creation_timestamp: formatTimestamp({
      timestamp: enrollment.user_account_creation_timestamp,
    }),
    progress_status: enrollment.progress_status,
    course_price: enrollment.course_price ? `$${enrollment.course_price}` : '',
    current_grade: formatPercentage({ decimal: enrollment.current_grade }),
  }));

  return (
    <TableContainer
      id="enrollments"
      className="enrollments"
      fetchMethod={EnterpriseDataApiService.fetchCourseEnrollments}
      columns={enrollmentTableColumns}
      formatData={formatEnrollmentData}
      tableSortable
    />
  );
};

export default EnrollmentsTable;
