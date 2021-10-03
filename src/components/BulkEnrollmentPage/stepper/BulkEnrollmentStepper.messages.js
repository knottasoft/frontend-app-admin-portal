import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'bulk.stepper.add-learners.error.text': {
    id: 'bulk.stepper.add-learners.error.text',
    defaultMessage: 'There was an error retrieving email data. Please try again later.',
  },
  'bulk.stepper.add-learners.description': {
    id: 'bulk.stepper.add-learners.description',
    defaultMessage: 'Select learners with an active or pending subscription license to enroll. If you wish to enroll additional learners not shown, please first invite them under ',
  },
  'bulk.stepper.add-learners.description.link': {
    id: 'bulk.stepper.add-learners.description.link',
    defaultMessage: 'Subscription management',
  },
  'bulk.stepper.add-learners.title': {
    id: 'bulk.stepper.add-learners.title',
    defaultMessage: 'Add learners',
  },
  'bulk.stepper.table.header.email': {
    id: 'bulk.stepper.table.header.email',
    defaultMessage: 'Email',
  },
  'bulk.stepper.add-courses.description': {
    id: 'bulk.stepper.add-courses.description',
    defaultMessage: 'By enrolling your learners in courses, you connect your learning community with the content that matters most to them, and take the guesswork out of getting started on the edX platform. To begin, select a course from your subscription catalog.',
  },
  'bulk.stepper.add-courses.title': {
    id: 'bulk.stepper.add-courses.title',
    defaultMessage: 'Add courses',
  },
  'bulk.stepper.review.title': {
    id: 'bulk.stepper.review.title',
    defaultMessage: 'Review selections',
  },
  'bulk.stepper.button.next': {
    id: 'bulk.stepper.button.next',
    defaultMessage: 'Next',
  },
  'bulk.stepper.button.previous': {
    id: 'bulk.stepper.button.previous',
    defaultMessage: 'Previous',
  },
  'bulk.stepper.enrollment-submit.alert.title': {
    id: 'bulk.stepper.enrollment-submit.alert.title',
    defaultMessage: 'An error occurred behind the scenes',
  },
  'bulk.stepper.enrollment-submit.alert.body': {
    id: 'bulk.stepper.enrollment-submit.alert.body',
    defaultMessage: 'We were not able to enroll your learners. Please wait a few minutes and try again. If the problem persists, please ',
  },
  'bulk.stepper.enrollment-submit.button': {
    id: 'bulk.stepper.enrollment-submit.button',
    defaultMessage: 'OK',
  },
  'bulk.stepper.enrollment-submit.support-email.subject': {
    id: 'bulk.stepper.enrollment-submit.support-email.subject',
    defaultMessage: 'An error occurred during Subscription Enrollment for enterprise {enterpriseSlug}',
  },
  'bulk.stepper.enrollment-submit.support-email.body': {
    id: 'bulk.stepper.enrollment-submit.support-email.body',
    defaultMessage: 'enterprise UUID: {enterpriseId}\nThe following error occurred when attempting to enroll learners: {error}',
  },
  'bulk.stepper.enrollment-submit.support-email.link': {
    id: 'bulk.stepper.enrollment-submit.support-email.link',
    defaultMessage: 'contact enterprise customer support.',
  },
  'bulk.stepper.enrollment-submit.success.many': {
    id: 'bulk.stepper.enrollment-submit.success.many',
    defaultMessage: '{numEmails} learners have been enrolled.',
  },
  'bulk.stepper.enrollment-submit.success.one': {
    id: 'bulk.stepper.enrollment-submit.success.one',
    defaultMessage: '{numEmails} learner have been enrolled.',
  },
  'bulk.stepper.enrollment-submit.success.zero': {
    id: 'bulk.stepper.enrollment-submit.success.zero',
    defaultMessage: 'No learners have been enrolled.',
  },
  'bulk.stepper.enrollment-submit.notify.checkbox': {
    id: 'bulk.stepper.enrollment-submit.notify.checkbox',
    defaultMessage: 'Notify learners via Email',
  },
  'bulk.stepper.enrollment-submit.final.button-text': {
    id: 'bulk.stepper.enrollment-submit.final.button-text',
    defaultMessage: 'Enroll learners',
  },
  'bulk.stepper.review.list.button.show': {
    id: 'bulk.stepper.review.list.button.show',
    defaultMessage: 'Show {numRows} more {subject}',
  },
  'bulk.stepper.review.list.button.hide': {
    id: 'bulk.stepper.review.list.button.hide',
    defaultMessage: 'Hide {numRows} {subject}',
  },
  'bulk.stepper.review.subject.learners.title': {
    id: 'bulk.stepper.review.subject.learners.title',
    defaultMessage: 'Learners',
  },
  'bulk.stepper.review.subject.learners.plural': {
    id: 'bulk.stepper.review.subject.learners.plural',
    defaultMessage: 'learners',
  },
  'bulk.stepper.review.subject.learners.singular': {
    id: 'bulk.stepper.review.subject.learners.singular',
    defaultMessage: 'learner',
  },
  'bulk.stepper.review.subject.courses.title': {
    id: 'bulk.stepper.review.subject.courses.title',
    defaultMessage: 'Courses',
  },
  'bulk.stepper.review.subject.courses.plural': {
    id: 'bulk.stepper.review.subject.courses.plural',
    defaultMessage: 'courses',
  },
  'bulk.stepper.review.subject.courses.singular': {
    id: 'bulk.stepper.review.subject.courses.singular',
    defaultMessage: 'course',
  },
  'bulk.stepper.review.alert.body': {
    id: 'bulk.stepper.review.alert.body',
    defaultMessage: 'At least one {subject} must be selected to enroll learners',
  },
  'bulk.stepper.review.alert.button': {
    id: 'bulk.stepper.review.alert.button',
    defaultMessage: 'Return to {subject} selection',
  },
  'bulk.stepper.review.text': {
    id: 'bulk.stepper.review.text',
    defaultMessage: 'You\'re almost done! Review your selections and make any final changes before completing enrollment for your learners.',
  },
});

export default messages;
