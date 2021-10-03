import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'admin.cards.numberOfUsers.description': {
    id: 'admin.cards.numberOfUsers.description',
    defaultMessage: 'total number of learners registered',
  },
  'admin.cards.numberOfUsers.action.label': {
    id: 'admin.cards.numberOfUsers.action.label',
    defaultMessage: 'Which learners are registered but not yet enrolled in any courses?',
  },
  'admin.cards.enrolledLearners.description': {
    id: 'admin.cards.enrolledLearners.description',
    defaultMessage: 'learners enrolled in at least one course',
  },
  'admin.cards.enrolledLearners.action1.label': {
    id: 'admin.cards.enrolledLearners.action1.label',
    defaultMessage: 'How many courses are learners enrolled in?',
  },
  'admin.cards.enrolledLearners.action2.label': {
    id: 'admin.cards.enrolledLearners.action2.label',
    defaultMessage: 'Who is no longer enrolled in a current course?',
  },
  'admin.cards.activeLearners.description': {
    id: 'admin.cards.activeLearners.description',
    defaultMessage: 'active learners in the past week',
  },
  'admin.cards.activeLearners.action1.label': {
    id: 'admin.cards.activeLearners.action1.label',
    defaultMessage: 'Who are my top active learners?',
  },
  'admin.cards.activeLearners.action2.label': {
    id: 'admin.cards.activeLearners.action2.label',
    defaultMessage: 'Who has not been active for over a week?',
  },
  'admin.cards.activeLearners.action3.label': {
    id: 'admin.cards.activeLearners.action2.label',
    defaultMessage: 'Who has not been active for over a month?',
  },
  'admin.cards.courseCompletions.description': {
    id: 'admin.cards.courseCompletions.description',
    defaultMessage: 'course completions',
  },
  'admin.cards.courseCompletions.action1.label': {
    id: 'admin.cards.courseCompletions.action1.label',
    defaultMessage: 'How many courses have been completed by learners?',
  },
  'admin.cards.courseCompletions.action2.label': {
    id: 'admin.cards.courseCompletions.action2.label',
    defaultMessage: 'Who completed a course in the past week?',
  },
  'admin.cards.skeleton': {
    id: 'admin.cards.skeleton',
    defaultMessage: 'Loading...',
  },
  'admin.searchForm.filter.course': {
    id: 'admin.searchForm.filter.course',
    defaultMessage: 'Filter by course',
  },
  'admin.searchForm.filter.startDate.label': {
    id: 'admin.searchForm.filter.startDate.label',
    defaultMessage: 'Filter by start date',
  },
  'admin.searchForm.filter.startDate.altText': {
    id: 'admin.searchForm.filter.startDate.altText',
    defaultMessage: 'More information',
  },
  'admin.searchForm.filter.startDate.tooltipText': {
    id: 'admin.searchForm.filter.startDate.tooltipText',
    defaultMessage: 'A start date can be selected after the course name is selected.',
  },
  'admin.searchForm.filter.startDate.options.allDates': {
    id: 'admin.searchForm.filter.startDate.options.allDates',
    defaultMessage: 'All Dates',
  },
  'admin.searchForm.filter.startDate.options.course': {
    id: 'admin.searchForm.filter.startDate.options.course',
    defaultMessage: 'Choose a course',
  },
  'admin.searchForm.filter.email': {
    id: 'admin.searchForm.filter.email',
    defaultMessage: 'Filter by email',
  },
  'admin.searchForm.filter.email.search.placeholder': {
    id: 'admin.searchForm.filter.email.search.placeholder',
    defaultMessage: 'Search by email...',
  },
  'admin.report.full.title': {
    id: 'admin.report.full.title',
    defaultMessage: 'Full Report',
  },
  'admin.report.unenrolled.title': {
    id: 'admin.report.unenrolled.title',
    defaultMessage: 'Registered Learners Not Yet Enrolled in a Course',
  },
  'admin.report.enrolled.title': {
    id: 'admin.report.enrolled.title',
    defaultMessage: 'Number of Courses Enrolled by Learners',
  },
  'admin.report.enrolled.inactive.title': {
    id: 'admin.report.enrolled.inactive.title',
    defaultMessage: 'Learners Not Enrolled in an Active Course',
  },
  'admin.report.enrolled.inactive.description': {
    id: 'admin.report.enrolled.inactive.description',
    defaultMessage: 'Learners who have completed all of their courses and/or courses have ended.',
  },
  'admin.report.enrolled.active-week.title': {
    id: 'admin.report.enrolled.active-week.title',
    defaultMessage: 'Learners Enrolled in a Course',
  },
  'admin.report.enrolled.active-week.subtitle': {
    id: 'admin.report.enrolled.active-week.subtitle',
    defaultMessage: 'Top Active Learners',
  },
  'admin.report.enrolled.inactive-week.title': {
    id: 'admin.report.enrolled.inactive-week.title',
    defaultMessage: 'Learners Enrolled in a Course',
  },
  'admin.report.enrolled.inactive-week.subtitle': {
    id: 'admin.report.enrolled.inactive-week.subtitle',
    defaultMessage: 'Not Active in Past Week',
  },
  'admin.report.enrolled.inactive-month.title': {
    id: 'admin.report.enrolled.inactive-month.title',
    defaultMessage: 'Learners Enrolled in a Course',
  },
  'admin.report.enrolled.inactive-month.subtitle': {
    id: 'admin.report.enrolled.inactive-month.subtitle',
    defaultMessage: 'Not Active in Past Month',
  },
  'admin.report.enrolled.completed.title': {
    id: 'admin.report.enrolled.completed.title',
    defaultMessage: 'Number of Courses Completed by Learner',
  },
  'admin.report.enrolled.completed-week.title': {
    id: 'admin.report.enrolled.completed-week.title',
    defaultMessage: 'Number of Courses Completed by Learner',
  },
  'admin.report.enrolled.completed-week.subtitle': {
    id: 'admin.report.enrolled.completed-week.subtitle',
    defaultMessage: 'Past Week',
  },
  'admin.report.button.download': {
    id: 'admin.report.button.download',
    defaultMessage: 'Download {actionSlug} report (CSV)',
  },
  'admin.report.button.reset.report': {
    id: 'admin.report.button.reset.report',
    defaultMessage: 'Reset to {actionSlug}',
  },
  'admin.report.button.reset.filters': {
    id: 'admin.report.button.reset.filters',
    defaultMessage: 'Reset Filters',
  },
  'admin.report.message.error.title': {
    id: 'admin.report.message.error.title',
    defaultMessage: 'Unable to load overview',
  },
  'admin.report.message.error.message': {
    id: 'admin.report.message.error.message',
    defaultMessage: 'Try refreshing your screen {message}',
  },
  'admin.report.message.csv.error.title': {
    id: 'admin.report.message.csv.error.title',
    defaultMessage: 'Unable to Generate CSV Report',
  },
  'admin.report.message.csv.error.message': {
    id: 'admin.report.message.csv.error.message',
    defaultMessage: 'Please try again. ({message})',
  },
  'admin.helmet': {
    id: 'admin.helmet',
    defaultMessage: 'Learner Progress Report',
  },
  'admin.title': {
    id: 'admin.title',
    defaultMessage: 'Learner Progress Report',
  },
  'admin.overview.title': {
    id: 'admin.overview.title',
    defaultMessage: 'Overview',
  },
  'admin.message.last-update.message': {
    id: 'admin.message.last-update.message',
    defaultMessage: 'Showing data as of {lastUpdatedDate}',
  },
});

export default messages;
