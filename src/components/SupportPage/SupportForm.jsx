// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Button, Icon } from '@edx/paragon';

import RenderField from '../RenderField';
import StatusAlert from '../StatusAlert';
import TextAreaAutoSize from '../TextAreaAutoSize';

import { isRequired, isValidEmail, maxLength512 } from '../../utils';

class SupportForm extends React.Component {
  renderErrorMessage() {
    const { error: { message } } = this.props;

    return (
      <StatusAlert
        className="mt-3"
        alertType="danger"
        iconClassName="fa fa-times-circle"
        title="Не удалось отправить ваш запрос команде ЦОПП СК"
        message={`Попробуйте обновить экран (${message})`}
      />
    );
  }

  renderSuccessMessage() {
    return (
      <StatusAlert
        className="mt-3"
        alertType="success"
        iconClassName="fa fa-check-circle"
        title="Запрос получен"
        message="Команда ЦОПП СК свяжется с вами в ближайшее время."
        dismissible
      />
    );
  }

  render() {
    const {
      handleSubmit,
      submitting,
      invalid,
      submitSucceeded,
      submitFailed,
      error,
    } = this.props;

    return (
      <>
        {submitFailed && error && this.renderErrorMessage()}
        {submitSucceeded && this.renderSuccessMessage()}
        <div className="support-form row">
          <div className="col-12 col-md-6 col-lg-4">
            <form onSubmit={handleSubmit}>
              <Field
                name="emailAddress"
                type="email"
                component={RenderField}
                label={(
                  <>
                    Адрес электронной почты
                    <span className="required">*</span>
                  </>
                )}
                validate={[isRequired, isValidEmail]}
                required
                data-hj-suppress
              />
              <Field
                name="enterpriseName"
                type="text"
                component={RenderField}
                label={(
                  <>
                    Компания
                    <span className="required">*</span>
                  </>
                )}
                validate={[isRequired]}
                required
                disabled
                data-hj-suppress
              />
              <Field
                name="subject"
                type="text"
                component={RenderField}
                label={(
                  <>
                    Тема
                    <span className="required">*</span>
                  </>
                )}
                validate={[isRequired]}
                required
                data-hj-suppress
              />
              <Field
                name="notes"
                type="text"
                component={TextAreaAutoSize}
                label={(
                  <>
                    Комментарии
                    <span className="required">*</span>
                  </>
                )}
                validate={[isRequired, maxLength512]}
                required
                data-hj-suppress
              />
              <Button
                type="submit"
                disabled={invalid || submitting}
                className="btn-primary"
              >
                <>
                  {submitting && <Icon className="fa fa-spinner fa-spin mr-2" />}
                  Связаться с поддержкой
                </>
              </Button>
            </form>
          </div>
        </div>
      </>
    );
  }
}

SupportForm.defaultProps = {
  error: null,
};

SupportForm.propTypes = {
  // props From redux-form
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitSucceeded: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error),

  // custom props
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  initialValues: PropTypes.shape({
    emailAddress: PropTypes.string.isRequired,
    enterpriseName: PropTypes.string.isRequired,
  }).isRequired,
};

export default reduxForm({ form: 'support-form' })(SupportForm);
