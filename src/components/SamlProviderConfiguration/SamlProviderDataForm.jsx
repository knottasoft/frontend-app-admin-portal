// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  ValidationFormGroup, Input, StatefulButton, Icon, Button,
} from '@edx/paragon';
import StatusAlert from '../StatusAlert';
import SUBMIT_STATES from '../../data/constants/formSubmissions';

export const REQUIRED_DATA_FIELDS = [
  'entityId',
  'ssoUrl',
  'publicKey',
];

class SamlProviderDataForm extends React.Component {
  state = {
    invalidFields: {},
    submitState: SUBMIT_STATES.DEFAULT,
    error: undefined,
  }

  /**
   * Validates this form. If the form is invalid, it will return the fields
   * that were invalid. Otherwise, it will return an empty object.
   * @param {FormData} formData
   * @param {[String]} requiredFields
   */
  validateProviderDataForm = (formData, requiredFields) => {
    const invalidFields = requiredFields
      .filter(field => !formData.get(field))
      .reduce((prevFields, currField) => ({ ...prevFields, [currField]: true }), {});
    return invalidFields;
  }

  /**
   * attempt to submit the form data and show any error states or invalid fields.
   * @param {FormData} formData
   */
  handleSubmit = async (formData) => {
    this.setState({ submitState: SUBMIT_STATES.PENDING });
    let requiredFields = [];
    requiredFields = [...REQUIRED_DATA_FIELDS];

    // validate the form
    const invalidFields = this.validateProviderDataForm(formData, requiredFields);
    if (!isEmpty(invalidFields)) {
      this.setState((state) => ({
        invalidFields: {
          ...state.invalidFields,
          ...invalidFields,
        },
        submitState: SUBMIT_STATES.default,
      }));
      return;
    }

    const err = await this.props.createProviderData(formData);
    if (err) {
      this.setState({ submitState: SUBMIT_STATES.ERROR, error: err });
    }
  }

  handleDelete = async (providerDataId) => {
    const err = await this.props.deleteProviderData(providerDataId);
    if (err) {
      this.setState({ error: err });
    }
  }

  render() {
    const { pData, entityId, deleteEnabled } = this.props;
    const {
      invalidFields,
      submitState,
      error,
    } = this.state;
    let errorAlert;
    if (error) {
      errorAlert = (
        <div className="form-group is-invalid align-items-left">
          <StatusAlert
            alertType="danger"
            iconClassName="fa fa-times-circle"
            title="Не удается отправить форму данных:"
            message={error}
          />
        </div>
      );
    }
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          this.handleSubmit(formData, pData);
        }}
        onChange={() => this.setState({ submitState: SUBMIT_STATES.DEFAULT })}
      >
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="entityId"
              helpText="Идентификатор сущности провайдера обычно представляет собой url и предоставляется SAMLProvider. Пример: https://idp.testshib.org/idp/shibboleth"
              invalid={invalidFields.entityId}
              invalidMessage="Требуется идентификатор сущности."
            >
              <label htmlFor="entityId">Идентификатор сущности.<span className="required">*</span></label>
              <Input
                type="text"
                id="entityId"
                name="entityId"
                defaultValue={pData ? pData.entityId : entityId}
                disabled={!(pData === undefined)}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="ssoUrl"
              helpText="URL-адрес SSO (Single Sign On) провайдера. Пример: https://samltest.id/idp/profile/SAML2/Redirect/SSO"
              invalid={invalidFields.ssoUrl}
              invalidMessage="Требуется URL-адрес SSO."
            >
              <label htmlFor="ssoUrl">URL-АДРЕС SSO<span className="required">*</span></label>
              <Input
                type="text"
                id="ssoUrl"
                name="ssoUrl"
                defaultValue={pData ? pData.ssoUrl : ''}
                disabled={!(pData === undefined)}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="publicKey"
              helpText="Публичный ключ (может также называться сертификатом подписи) вашего провайдера."
              invalid={invalidFields.publicKey}
              invalidMessage="Требуется Публичный ключ."
            >
              <label htmlFor="publicKey">Публичный ключ<span className="required">*</span></label>
              <Input
                type="textarea"
                id="publicKey"
                name="publicKey"
                defaultValue={pData ? pData.publicKey : ''}
                disabled={!(pData === undefined)}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          {!pData && (
            <div className="col-col2">
              <StatefulButton
                state={submitState}
                type="submit"
                id="submitButton"
                labels={{
                  default: 'Отправить',
                  pending: 'Сохранение...',
                  complete: 'Завершено',
                  error: 'Ошибка',
                }}
                icons={{
                  default: <Icon className="fa fa-download" />,
                  pending: <Icon className="fa fa-spinner fa-spin" />,
                  complete: <Icon className="fa fa-check" />,
                  error: <Icon className="fa fa-times" />,
                }}
                disabledStates={[SUBMIT_STATES.PENDING]}
                className="ml-3 col"
                variant="primary"
              />
            </div>
          )}
          {pData && deleteEnabled && (
            <div className="col col-2">
              <Button
                className="btn-outline-danger  mr-3"
                onClick={() => this.handleDelete(pData.id)}
              >
                <Icon className="fa fa-times danger" /> Удалить
              </Button>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col col-3 mt-3">
            {errorAlert}
          </div>
        </div>
      </form>
    );
  }
}

SamlProviderDataForm.defaultProps = {
  createProviderData: undefined,
  deleteProviderData: undefined,
  pData: undefined,
  entityId: undefined,
};

SamlProviderDataForm.propTypes = {
  createProviderData: PropTypes.func,
  deleteProviderData: PropTypes.func,
  deleteEnabled: PropTypes.bool.isRequired,
  entityId: PropTypes.string,
  pData: PropTypes.shape({
    entityId: PropTypes.string,
    ssoUrl: PropTypes.string,
    publicKey: PropTypes.string,
    id: PropTypes.number,
  }),
};

export default SamlProviderDataForm;
