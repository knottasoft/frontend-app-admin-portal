// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, SubmissionError } from 'redux-form';
import {
  Alert, Button, Icon, Modal,
} from '@edx/paragon';

import StatusAlert from '../StatusAlert';
import { ACTIVATED, SHOW_REVOCATION_CAP_PERCENT } from '../subscriptions/data/constants';
import './LicenseRevokeModal.scss';

class LicenseRevokeModal extends React.Component {
  constructor(props) {
    super(props);

    this.errorMessageRef = React.createRef();

    this.handleModalSubmit = this.handleModalSubmit.bind(this);
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

  handleModalSubmit() {
    const {
      user,
      sendLicenseRevoke,
      subscriptionPlan,
    } = this.props;
    const options = { user_email: user.userEmail };

    return sendLicenseRevoke(subscriptionPlan.uuid, options)
      .then(response => this.props.onSuccess(response))
      .catch((error) => {
        throw new SubmissionError({
          _error: [error.message],
        });
      });
    /* eslint-enable no-underscore-dangle */
  }

  shouldRenderRevocationCapAlert() {
    const {
      subscriptionPlan,
      licenseStatus,
    } = this.props;

    if (licenseStatus !== ACTIVATED) {
      return false;
    }

    const { isRevocationCapEnabled, revocations } = subscriptionPlan;
    if (!isRevocationCapEnabled || !revocations) {
      return false;
    }

    // only show the revocation cap messaging if the number of applied revocations exceeds X% of
    // the number of revocations remaining for the subscription plan.
    const revocationCapLimit = revocations.remaining * (SHOW_REVOCATION_CAP_PERCENT / 100);
    return revocations.applied > revocationCapLimit;
  }

  renderBody() {
    const {
      user,
      submitFailed,
      subscriptionPlan,
    } = this.props;

    const { revocations } = subscriptionPlan;

    return (
      <>
        {this.shouldRenderRevocationCapAlert() && (
          <Alert variant="warning">
            <p className="m-0">
              Вы уже отозвали {revocations.applied} лицензий. В вашем
              плане осталось {revocations.remaining} лицензий.
            </p>
          </Alert>
        )}
        <div className="license-details">
          <>
            {submitFailed && this.renderErrorMessage()}
            <p>
              Отзыв лицензии приведет к удалению доступа к каталогу подписок для
              <strong data-hj-suppress>{user.userEmail}</strong>. Они все еще будут иметь
              доступ к своим курсам в треке аудита и своим сертификатам.
            </p>
            <p>
              Это действие нельзя отменить. Чтобы снова разрешить доступ, вы можете назначить
              <strong data-hj-suppress>{user.userEmail}</strong> на другую лицензию, но им необходимо
              будет заново зарегистрироваться на любой курс после назначения новой лицензии.
            </p>
          </>
        </div>
      </>
    );
  }

  renderErrorMessage() {
    const modalErrors = {
      revoke: 'Неудается отозвать лицензию',
    };
    const { error } = this.props;

    return (
      <div
        ref={this.errorMessageRef}
        tabIndex="-1"
      >
        <StatusAlert
          alertType="danger"
          iconClassName="fa fa-times-circle"
          title={modalErrors.revoke}
          message={error.length > 1 ? (
            <ul className="m-0 pl-4">
              {error.map(message => <li key={message}>{message}</li>)}
            </ul>
          ) : error[0]}
        />
      </div>
    );
  }

  renderTitle() {
    return 'Вы уверены, что хотите отозвать эту лицензию?';
  }

  render() {
    const {
      onClose,
      submitting,
      handleSubmit,
    } = this.props;

    return (
      <Modal
        dialogClassName="license-revoke"
        renderHeaderCloseButton={false}
        title={this.renderTitle()}
        body={this.renderBody()}
        buttons={[
          <Button
            key="revoke-submit-btn"
            disabled={submitting}
            className="license-revoke-save-btn"
            onClick={handleSubmit(this.handleModalSubmit)}
          >
            <>
              {submitting && <Icon className="fa fa-spinner fa-spin mr-2" />}
              OK
            </>
          </Button>,
        ]}
        closeText="Отменить"
        onClose={onClose}
        open
      />
    );
  }
}

LicenseRevokeModal.defaultProps = {
  error: null,
};

LicenseRevokeModal.propTypes = {
  // props From redux-form
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitSucceeded: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  error: PropTypes.arrayOf(PropTypes.string),

  // custom props
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  sendLicenseRevoke: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userEmail: PropTypes.string.isRequired,
  }).isRequired,
  subscriptionPlan: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    isRevocationCapEnabled: PropTypes.bool.isRequired,
    revocations: PropTypes.shape({
      applied: PropTypes.number,
      remaining: PropTypes.number,
    }),
  }).isRequired,
  licenseStatus: PropTypes.string.isRequired,
};

export default reduxForm({
  form: 'license-revoke-modal-form',
})(LicenseRevokeModal);
