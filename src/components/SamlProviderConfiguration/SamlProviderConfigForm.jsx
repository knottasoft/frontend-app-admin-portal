// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  ValidationFormGroup, Input, StatefulButton, Icon, Button,
} from '@edx/paragon';
import StatusAlert from '../StatusAlert';
import SamlConfiguration from '../SamlConfiguration';
import SUBMIT_STATES from '../../data/constants/formSubmissions';

export const REQUIRED_CONFIG_FIELDS = [
  'entityId',
  'metadataSource',
];

class SamlProviderConfigForm extends React.Component {
  state = {
    invalidFields: {},
    submitState: SUBMIT_STATES.DEFAULT,
    enabled: this.props.config?.enabled,
    syncLearnerProfileData: this.props.config?.syncLearnerProfileData,
    error: undefined,
  }

  /**
   * Validates this form. If the form is invalid, it will return the fields
   * that were invalid. Otherwise, it will return an empty object.
   * @param {FormData} formData
   * @param {[String]} requiredFields
   */
  validateProviderConfigForm = (formData, requiredFields) => {
    const invalidFields = requiredFields
      .filter(field => !formData.get(field))
      .reduce((prevFields, currField) => ({ ...prevFields, [currField]: true }), {});
    return invalidFields;
  }

  /**
   * attempt to submit the form data and show any error states or invalid fields.
   * @param {FormData} formData
   */
  handleSubmit = async (formData, config) => {
    this.setState({ submitState: SUBMIT_STATES.PENDING, error: undefined });
    let requiredFields = [];
    requiredFields = [...REQUIRED_CONFIG_FIELDS];
    // validate the form
    const invalidFields = this.validateProviderConfigForm(formData, requiredFields);
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

    if (config) {
      const err = await this.props.updateProviderConfig(formData, config.id);
      if (err) {
        this.setState({
          submitState: SUBMIT_STATES.ERROR,
          error: err,
        });
      }
    } else {
      // ...or create a new configuration
      const err = await this.props.createProviderConfig(formData);
      if (err) {
        this.setState({
          submitState: SUBMIT_STATES.ERROR,
          error: err,
        });
      }
    }
  }

  render() {
    const { config, deleteEnabled } = this.props;
    const {
      invalidFields,
      submitState,
      enabled,
      syncLearnerProfileData,
      error,
    } = this.state;
    let errorAlert;
    if (error) {
      errorAlert = (
        <div className="form-group is-invalid align-items-left">
          <StatusAlert
            alertType="danger"
            iconClassName="fa fa-times-circle"
            title="Не удается отправить форму конфигурации:"
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
          this.handleSubmit(formData, config);
        }}
        onChange={() => this.setState({ submitState: SUBMIT_STATES.DEFAULT })}
      >
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="enabled"
            >
              <label htmlFor="enabled">Включено</label>
              <Input
                type="checkbox"
                id="enabled"
                name="enabled"
                className="ml-3"
                checked={enabled}
                onChange={() => this.setState(prevState => ({ enabled: !prevState.enabled }))}
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="maxSession"
              helpText="Если этот параметр установлен, то у пользователей, входящих в систему с помощью данного провайдера SSO, длина сеанса будет ограничена не более чем этим значением. Если установлено значение 0 (ноль), то сессия истечет после того, как пользователь закроет браузер. Если оставить значение пустым, будет использоваться стандартная длина сессии платформы Django."
            >
              <label htmlFor="maxSession">Максимальная продолжительность сеанса (секунды)</label>
              <Input
                type="number"
                id="maxSessionLength"
                name="maxSessionLength"
                defaultValue={config ? config.maxSessionLength : undefined}
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="syncLearnerProfileData"
              helpText="Синхронизировать данные профиля пользователя, полученные от поставщика идентификационных данных, с учетной записью пользователя edX при каждом входе в систему SSO. Пользователь будет уведомлен, если адрес электронной почты, связанный с его учетной записью, будет изменен в рамках этой синхронизации."
            >
              <label htmlFor="syncLearnerProfileData">Синхронизация данных профиля учащегося</label>
              <Input
                type="checkbox"
                id="syncLearnerProfileData"
                name="syncLearnerProfileData"
                className="ml-3"
                checked={syncLearnerProfileData}
                value={syncLearnerProfileData}
                onChange={() => this.setState(prevState => (
                  { syncLearnerProfileData: !prevState.syncLearnerProfileData }
                ))}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="entityId"
              helpText="Идентификатор сущности провайдера обычно представляет собой url и предоставляется SAMLProvider. Пример: https://idp.testshib.org/idp/shibbolet"
              invalid={invalidFields.entityId}
              invalidMessage="Требуется идентификатор сущности."
            >
              <label htmlFor="entityId">ID сущности<span className="required">*</span></label>
              <Input
                type="text"
                id="entityId"
                name="entityId"
                defaultValue={config ? config.entityId : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="metadataSource"
              helpText="URL-адрес XML-метаданных этого провайдера. Это должен быть HTTPS URL. Пример: https://www.testshib.org/metadata/testshib-providers.xml"
              invalid={invalidFields.metadataSource}
              invalidMessage="Требуется Источник метаданных."
            >
              <label htmlFor="metadataSource">Источник метаданных<span className="required">*</span></label>
              <Input
                type="text"
                id="metadataSource"
                name="metadataSource"
                defaultValue={config ? config.metadataSource : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="attrUserPermanentId"
              helpText="URN атрибута SAML, который мы можем использовать в качестве уникального, постоянного идентификатора пользователя. Оставьте пустым для значения по умолчанию."
            >
              <label htmlFor="attrUserPermanentId">Атрибут "ID пользователя"</label>
              <Input
                type="text"
                id="attrUserPermanentId"
                name="attrUserPermanentId"
                defaultValue={config ? config.attrUserPermanentId : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="attrFullName"
              helpText="URN атрибута SAML, содержащего полное имя пользователя. Оставьте пустым по умолчанию."
            >
              <label htmlFor="attrFullName">Атрибут "Полное имя"</label>
              <Input
                type="text"
                id="attrFullName"
                name="attrFullName"
                defaultValue={config ? config.attrFullName : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="attrFirstName"
              helpText="URN атрибута SAML, содержащего имя пользователя. Оставьте пустым по умолчанию."
            >
              <label htmlFor="attrFirstName">Атрибут "Имя"</label>
              <Input
                type="text"
                id="attrFirstName"
                name="attrFirstName"
                defaultValue={config ? config.attrFirstName : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="attrLastName"
              helpText="URN атрибута SAML, содержащего фамилию пользователя. Оставьте пустым по умолчанию."
            >
              <label htmlFor="attrLastName">Атрибут "Фамилия"</label>
              <Input
                type="text"
                id="attrLastName"
                name="attrLastName"
                defaultValue={config ? config.attrLastName : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="attrEmail"
              helpText="URN атрибута SAML, содержащего адрес электронной почты пользователя. Оставьте пустым по умолчанию."
            >
              <label htmlFor="attrEmail">Атрибут "Электронная почта"</label>
              <Input
                type="text"
                id="attrEmail"
                name="attrEmail"
                defaultValue={config ? config.attrEmail : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="country"
              helpText="URN атрибута SAML, содержащего страну пользователя"
            >
              <label htmlFor="country">Страна</label>
              <Input
                type="text"
                id="country"
                name="country"
                defaultValue={config ? config.country : ''}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <SamlConfiguration
            currentConfig={config ? config.samlConfiguration : undefined}
          />
        </div>

        <div className="row">
          <div className="col col-2">
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
              variant="primary"
              className="ml-3 col"
            />
          </div>
          <div className="col col-2">
            {config && deleteEnabled && (
              <Button
                variant="outline-danger"
                className=" mr-3"
                onClick={() => this.props.deleteProviderConfig(config.id)}
              >
                <Icon className="fa fa-times danger" /> Удалить
              </Button>
            )}
          </div>
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

SamlProviderConfigForm.defaultProps = {
  config: undefined,
  updateProviderConfig: undefined,
  createProviderConfig: undefined,
  deleteProviderConfig: undefined,
};

SamlProviderConfigForm.propTypes = {
  updateProviderConfig: PropTypes.func,
  createProviderConfig: PropTypes.func,
  deleteProviderConfig: PropTypes.func,
  deleteEnabled: PropTypes.bool.isRequired,
  config: PropTypes.shape({
    enabled: PropTypes.bool,
    entityId: PropTypes.string,
    metadataSource: PropTypes.string,
    uuid: PropTypes.string,
    syncLearnerProfileData: PropTypes.bool,
    attrUserPermanentId: PropTypes.string,
    attrFullName: PropTypes.string,
    attrFirstName: PropTypes.string,
    attrLastName: PropTypes.string,
    attrEmail: PropTypes.string,
    maxSessionLength: PropTypes.number,
    id: PropTypes.number,
    country: PropTypes.string,
    samlConfiguration: PropTypes.number,
  }),
};

export default SamlProviderConfigForm;
