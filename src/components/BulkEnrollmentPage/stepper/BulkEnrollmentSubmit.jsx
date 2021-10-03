// TODO: Lang support
import React, {
  useContext,
  useState,
} from 'react';
import {
  Button, Form, AlertModal, ActionRow, useToggle, MailtoLink,
} from '@edx/paragon';
import PropTypes from 'prop-types';
import { logError } from '@edx/frontend-platform/logging';
import {
  FINAL_BUTTON_TEST_ID,
  NOTIFY_CHECKBOX_TEST_ID,
  CUSTOMER_SUPPORT_HYPERLINK_TEST_ID,
} from './constants';
import LicenseManagerApiService from '../../../data/services/LicenseManagerAPIService';
import { BulkEnrollContext } from '../BulkEnrollmentContext';
import { ToastsContext } from '../../Toasts';
import { clearSelectionAction } from '../data/actions';
import { configuration } from '../../../config';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollmentStepper.messages';

export const BULK_ENROLL_ERROR = 'There was an ';

export const BulkEnrollmentAlertModal = injectIntl(({
  isOpen, toggleClose, enterpriseSlug, error, enterpriseId, intl
}) => (
  <AlertModal
    title={intl.formatMessage(messages['bulk.stepper.enrollment-submit.alert.title'])}
    isOpen={isOpen}
    onClose={toggleClose}
    footerNode={(
      <ActionRow>
        <Button variant="primary" onClick={toggleClose}>
          {intl.formatMessage(messages['bulk.stepper.enrollment-submit.button'])}
        </Button>
      </ActionRow>
    )}
  >
    <p>
      {intl.formatMessage(messages['bulk.stepper.enrollment-submit.alert.body'])}
      <MailtoLink
        to={configuration.CUSTOMER_SUPPORT_EMAIL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={CUSTOMER_SUPPORT_HYPERLINK_TEST_ID}
        subject={
          intl.formatMessage(messages['bulk.stepper.enrollment-submit.support-email.subject'], {enterpriseSlug: enterpriseSlug})
        }
        body={
          intl.formatMessage(messages['bulk.stepper.enrollment-submit.support-email.body'], {enterpriseId: enterpriseId, error: error})
        }
      >
        {intl.formatMessage(messages['bulk.stepper.enrollment-submit.support-email.link'])}
      </MailtoLink>
    </p>
  </AlertModal>
));

BulkEnrollmentAlertModal.defaultProps = {
  error: 'Неизвестная ошибка',
};

BulkEnrollmentAlertModal.propTypes = {
  intl: intlShape,
  isOpen: PropTypes.bool.isRequired,
  toggleClose: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  enterpriseId: PropTypes.string.isRequired,
  enterpriseSlug: PropTypes.string.isRequired,
};

export const generateSuccessMessage = injectIntl((numEmails) => {
  if (numEmails > 1) {
    return this.props.intl.formatMessage(messages['bulk.stepper.enrollment-submit.success.many'], {numEmails: numEmails});
  }
  if (numEmails === 1) {
    return this.props.intl.formatMessage(messages['bulk.stepper.enrollment-submit.success.one'], {numEmails: numEmails});
  }
  return this.props.intl.formatMessage(messages['bulk.stepper.enrollment-submit.success.zero']);
});

generateSuccessMessage.propTypes = {
  intl: intlShape.isRequired,
};

const BulkEnrollmentSubmit = ({ enterpriseId, enterpriseSlug, returnToInitialStep, intl }) => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState('');
  const handleChange = e => setChecked(e.target.checked);

  const {
    emails: [selectedEmails, emailsDispatch],
    courses: [selectedCourses, coursesDispatch],
  } = useContext(BulkEnrollContext);
  const { addToast } = useContext(ToastsContext);

  const courseKeys = selectedCourses.map(
    ({ original, id }) => original?.advertised_course_run?.key || id,
  );
  const emails = selectedEmails.map(({ values }) => values.userEmail);
  const [isErrorModalOpen, toggleErrorModalOpen, toggleErrorModalClose] = useToggle();
  const hasSelectedCoursesAndEmails = selectedEmails.length > 0 && selectedCourses.length > 0;

  const submitBulkEnrollment = () => {
    setLoading(true);
    const options = {
      emails,
      course_run_keys: courseKeys,
      notify: checked,
    };

    return LicenseManagerApiService.licenseBulkEnroll(
      enterpriseId,
      options,
    ).then(() => {
      coursesDispatch(clearSelectionAction());
      emailsDispatch(clearSelectionAction());
      addToast(generateSuccessMessage(selectedEmails.length));
      returnToInitialStep();
    }).catch((err) => {
      logError(err);
      setError(err);
      toggleErrorModalOpen();
      setLoading(false);
    });
  };

  return (
    <>
      <BulkEnrollmentAlertModal
        enterpriseSlug={enterpriseSlug}
        toggleClose={toggleErrorModalClose}
        isOpen={isErrorModalOpen}
        error={error}
        enterpriseId={enterpriseId}
      />
      <Form.Checkbox
        checked={checked}
        onChange={handleChange}
        data-testid={NOTIFY_CHECKBOX_TEST_ID}
      >
        {intl.formatMessage(messages['bulk.stepper.enrollment-submit.notify.checkbox'])}
      </Form.Checkbox>
      <Button
        disabled={!hasSelectedCoursesAndEmails && !loading}
        onClick={submitBulkEnrollment}
        data-testid={FINAL_BUTTON_TEST_ID}
      >
        {intl.formatMessage(messages['bulk.stepper.enrollment-submit.final.button-text'])}
      </Button>
    </>
  );
};

BulkEnrollmentSubmit.propTypes = {
  intl: intlShape.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  enterpriseSlug: PropTypes.string.isRequired,
  returnToInitialStep: PropTypes.func.isRequired,
};

export default injectIntl(BulkEnrollmentSubmit);
