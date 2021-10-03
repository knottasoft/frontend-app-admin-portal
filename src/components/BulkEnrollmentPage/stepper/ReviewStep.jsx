import React, { useContext } from 'react';
import { Row } from '@edx/paragon';
import PropTypes from 'prop-types';

import { BulkEnrollContext } from '../BulkEnrollmentContext';
import { ADD_LEARNERS_STEP, ADD_COURSES_STEP } from './constants';
import ReviewList from './ReviewList';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollmentStepper.messages';

const ReviewStep = ({ setCurrentStep, intl }) => {
  const {
    emails: [selectedEmails, emailsDispatch],
    courses: [selectedCourses, coursesDispatch],
  } = useContext(BulkEnrollContext);

  const LEARNERS = {
    singular: intl.formatMessage(messages['bulk.stepper.review.subject.learners.singular']),
    plural: intl.formatMessage(messages['bulk.stepper.review.subject.learners.plural']),
    title: intl.formatMessage(messages['bulk.stepper.review.subject.learners.title']),
  };

  const COURSES = {
    singular: intl.formatMessage(messages['bulk.stepper.review.subject.courses.singular']),
    plural: intl.formatMessage(messages['bulk.stepper.review.subject.courses.plural']),
    title: intl.formatMessage(messages['bulk.stepper.review.subject.courses.title']),
  };

  return (
    <>
      <p>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        {intl.formatMessage(messages['bulk.stepper.review.text'])}
      </p>
      <h2 className="mb-5">{intl.formatMessage(messages['bulk.stepper.review.title'])}</h2>
      <Row>
        <ReviewList
          key="courses"
          rows={selectedCourses}
          accessor="title"
          dispatch={coursesDispatch}
          subject={COURSES}
          returnToSelection={() => setCurrentStep(ADD_COURSES_STEP)}
        />
        <ReviewList
          key="emails"
          rows={selectedEmails}
          accessor="userEmail"
          dispatch={emailsDispatch}
          subject={LEARNERS}
          returnToSelection={() => setCurrentStep(ADD_LEARNERS_STEP)}
        />
      </Row>
    </>
  );
};

ReviewStep.propTypes = {
  intl: intlShape.isRequired,
  /* Function from the stepper to change steps */
  setCurrentStep: PropTypes.func.isRequired,
};

export default injectIntl(ReviewStep);
