// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Icon, Modal } from '@edx/paragon';

import { camelCaseObject } from '@edx/frontend-platform/utils';
import emailTemplate from './emailTemplate';
import TextAreaAutoSize from '../TextAreaAutoSize';
import StatusAlert from '../StatusAlert';
import FileInput from '../FileInput';
import { returnValidatedEmails, validateEmailAddrTemplateForm } from '../../data/validation/email';
import { normalizeFileUpload } from '../../utils';

class InviteLearnersModal extends React.Component {
  constructor(props) {
    super(props);

    this.errorMessageRef = React.createRef();
    this.modalRef = React.createRef();

    this.handleModalSubmit = this.handleModalSubmit.bind(this);
  }

  componentDidMount() {
    const { current: { firstFocusableElement } } = this.modalRef;
    const { contactEmail } = this.props;

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
    this.props.initialize({
      'email-template-greeting': emailTemplate.greeting,
      'email-template-body': emailTemplate.body,
      'email-template-closing': emailTemplate.closing(contactEmail),
    });
  }

  componentDidUpdate(prevProps) {
    const {
      submitFailed,
      submitSucceeded,
      onClose,
      error,
    } = this.props;

    const errorMessageRef = this.errorMessageRef && this.errorMessageRef.current;

    if (submitSucceeded && submitSucceeded !== prevProps.submitSucceeded) {
      onClose();
    }

    if (submitFailed && error !== prevProps.error && errorMessageRef) {
      // When there is an new error, focus on the error message status alert
      errorMessageRef.focus();
    }
  }

  handleModalSubmit(formData) {
    const {
      addLicensesForUsers,
      subscriptionUUID,
    } = this.props;

    const emailTemplateKey = 'email-template-body';
    // Validate form data
    validateEmailAddrTemplateForm(formData, emailTemplateKey);

    const options = {
      template: formData[emailTemplateKey],
      greeting: formData['email-template-greeting'],
      closing: formData['email-template-closing'],
    };

    options.user_emails = returnValidatedEmails(formData);

    /* eslint-disable no-underscore-dangle */
    return addLicensesForUsers(options, subscriptionUUID)
      .then((response) => {
        const result = camelCaseObject(response.data);
        this.props.onSuccess(result);
      })
      .catch((error) => {
        throw new SubmissionError({
          _error: [error.message],
        });
      });
    /* eslint-enable no-underscore-dangle */
  }

  renderBody() {
    const {
      submitFailed, availableSubscriptionCount,
    } = this.props;

    return (
      <>
        {submitFailed && this.renderErrorMessage()}
        <form onSubmit={e => e.preventDefault()}>
          <p>Unassigned licenses: {availableSubscriptionCount}</p>
          <div className="mt-4">
            <h3>Add Users</h3>
            <Field
              name="email-addresses"
              component={TextAreaAutoSize}
              label="Адрес электронной почты"
              description="Чтобы добавить более одного пользователя, введите один адрес электронной почты в каждой строке."
              data-hj-suppress
            />
            <p className="pb-2">
              OR
            </p>
            <Field
              id="csv-email-addresses"
              name="csv-email-addresses"
              component={FileInput}
              label="Загрузить адреса электронной почты"
              description="Файл должен представлять собой CSV, содержащий один столбец адресов электронной почты."
              accept=".csv"
              normalize={normalizeFileUpload}
              data-hj-suppress
            />
            <h3>Email Template</h3>
            <Field
              name="email-template-greeting"
              component={TextAreaAutoSize}
              label="Настроить приветствие"
              data-hj-suppress
            />
            <Field
              name="email-template-body"
              component={TextAreaAutoSize}
              label="Body"
              disabled
            />
            <Field
              name="email-template-closing"
              component={TextAreaAutoSize}
              label="Настроить завершение"
              data-hj-suppress
            />
          </div>
        </form>
      </>
    );
  }

  renderErrorMessage() {
    const { error } = this.props;

    return (
      <div
        ref={this.errorMessageRef}
        tabIndex="-1"
      >
        <StatusAlert
          alertType="danger"
          iconClassName="fa fa-times-circle"
          title="Неудается оформить подписку на пользователей"
          message={error.length > 1 ? (
            <ul className="m-0 pl-4">
              {error.map(message => <li key={message}>{message}</li>)}
            </ul>
          ) : (
            error[0]
          )}
        />
      </div>
    );
  }

  render() {
    const {
      onClose,
      submitting,
      handleSubmit,
    } = this.props;

    return (
      <>
        <Modal
          ref={this.modalRef}
          dialogClassName="add-users"
          title="Пригласить обучающихся"
          body={this.renderBody()}
          buttons={[
            <Button
              key="subscribe-users-submit-btn"
              disabled={submitting}
              className="subscribe-users-save-btn"
              onClick={handleSubmit(this.handleModalSubmit)}
            >
              <>
                {submitting && <Icon className="fa fa-spinner fa-spin mr-2" />}
                Пригласить обучающихся
              </>
            </Button>,
          ]}
          closeText="Отменить"
          onClose={onClose}
          open
        />
      </>
    );
  }
}

InviteLearnersModal.defaultProps = {
  error: null,
  contactEmail: null,
};

InviteLearnersModal.propTypes = {
  // props From redux-form
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitSucceeded: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),
  initialize: PropTypes.func.isRequired,

  // custom props
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  addLicensesForUsers: PropTypes.func.isRequired,
  subscriptionUUID: PropTypes.string.isRequired,

  availableSubscriptionCount: PropTypes.number.isRequired,
  contactEmail: PropTypes.string,
};

export default reduxForm({
  form: 'license-assignment-modal-form',
})(InviteLearnersModal);
