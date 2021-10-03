// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  ValidationFormGroup, Input, StatefulButton, Icon,
} from '@edx/paragon';
import { snakeCaseFormData } from '../../utils';
import LmsApiService from '../../data/services/LmsApiService';
import StatusAlert from '../StatusAlert';
import SUBMIT_STATES from '../../data/constants/formSubmissions';
import { handleErrors, validateLmsConfigForm } from './common';

export const REQUIRED_SUCCESS_FACTOR_CONFIG_FIELDS = [
  'sapsfBaseUrl',
  'sapsfCompanyId',
  'sapsfUserId',
  'key',
  'secret',
  'userType',
];

class SuccessFactorsIntegrationConfigForm extends React.Component {
  state = {
    invalidFields: {},
    submitState: SUBMIT_STATES.DEFAULT,
    active: this.props.config?.active,
    error: null,
    transmitTotalHours: this.props.config?.transmitTotalHours,
  }

  /**
   * Creates a new third party provider configuration, then updates this list with the response.
   * Returns if there is an error.
   * @param {FormData} formData
   */
  createSuccessFactorsConfig = async (formData) => {
    const transformedData = snakeCaseFormData(formData);
    transformedData.append('enterprise_customer', this.props.enterpriseId);
    try {
      const response = await LmsApiService.postNewSuccessFactorsConfig(transformedData);
      return this.setState({ config: response.data });
    } catch (error) {
      return handleErrors(error);
    }
  }

  updateSuccessFactorsConfig = async (formData, configId) => {
    const transformedData = snakeCaseFormData(formData);
    transformedData.append('enterprise_customer', this.props.enterpriseId);
    try {
      const response = await LmsApiService.updateSuccessFactorsConfig(transformedData, configId);
      return this.setState({ config: response.data });
    } catch (error) {
      return handleErrors(error);
    }
  }

  /**
   * attempt to submit the form data and show any error states or invalid fields.
   * @param {FormData} formData
   */
  handleSubmit = async (formData, config) => {
    this.setState({ submitState: SUBMIT_STATES.PENDING, error: null, invalidFields: {} });
    const requiredFields = [...REQUIRED_SUCCESS_FACTOR_CONFIG_FIELDS];

    // validate the form
    const invalidFields = validateLmsConfigForm(formData, requiredFields);
    if (!isEmpty(invalidFields)) {
      this.setState({
        invalidFields: {
          ...invalidFields,
        },
        submitState: SUBMIT_STATES.default,
      });
      return;
    }

    if (config) {
      const err = await this.updateSuccessFactorsConfig(formData, config.id);
      if (err) {
        this.setState({
          submitState: SUBMIT_STATES.ERROR,
          error: err,
        });
      } else {
        this.setState({ submitState: SUBMIT_STATES.COMPLETE });
      }
    } else {
      // ...or create a new configuration
      const err = await this.createSuccessFactorsConfig(formData);
      if (err) {
        this.setState({
          submitState: SUBMIT_STATES.ERROR,
          error: err,
        });
      } else {
        this.setState({ submitState: SUBMIT_STATES.COMPLETE });
      }
    }
  }

  render() {
    const {
      invalidFields,
      submitState,
      active,
      error,
      transmitTotalHours,
    } = this.state;
    const { config } = this.props;

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          this.handleSubmit(formData, this.state.config ? this.state.config : config);
        }}
        onChange={() => this.setState({ submitState: SUBMIT_STATES.DEFAULT })}
      >
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="active"
            >
              <label htmlFor="active">Активно</label>
              <Input
                type="checkbox"
                id="active"
                name="active"
                className="ml-3"
                checked={active}
                onChange={() => this.setState(prevState => ({ active: !prevState.active }))}
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="sapsfBaseUrl"
              invalid={invalidFields.sapsfBaseUrl}
              invalidMessage="Требуется URL-адрес экземпляра SAP Success Factors."
              helpText="URL-адрес вашего экземпляра SAP Success Factors. Обязательно укажите протокол (т. е. https/http)."
            >
              <label htmlFor="sapsfBaseUrl">URL экземпляра SAP Success Factors</label>
              <Input
                type="text"
                id="sapsfBaseUrl"
                name="sapsfBaseUrl"
                defaultValue={config ? config.sapsfBaseUrl : null}
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="sapsfCompanyId"
              invalid={invalidFields.sapsfCompanyId}
              invalidMessage="Поле Идентификатор компании SAP Success Factors является обязательным."
              helpText="Это должно соответствовать идентификатору компании, который содержится в SAP Success Factors."
            >
              <label htmlFor="sapsfCompanyId">Идентификатор компании SAP Success Factors</label>
              <Input
                type="text"
                id="sapsfCompanyId"
                name="sapsfCompanyId"
                defaultValue={config ? config.sapsfCompanyId : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="key"
              invalid={invalidFields.key}
              invalidMessage="Требуется идентификатор клиента Success Factors."
              helpText="Идентификатор клиента Oauth."
            >
              <label htmlFor="key">Идентификатор клиента</label>
              <Input
                type="text"
                id="key"
                name="key"
                defaultValue={config ? config.key : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="secret"
              invalid={invalidFields.key}
              invalidMessage="Требуется Секрет клиента Success Factors."
              helpText="Секрет клиента OAuth."
            >
              <label htmlFor="secret">Секрет клиента</label>
              <Input
                type="password"
                id="secret"
                name="secret"
                defaultValue={config ? config.secret : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="sapsfUserId"
              invalid={invalidFields.sapsfUserId}
              invalidMessage="Требуется идентификатор пользователя Success Factors."
              helpText="Идентификатор пользователя Success Factors"
            >
              <label htmlFor="secret">Идентификатор пользователя SAP Success Factors</label>
              <Input
                type="text"
                id="sapsfUserId"
                name="sapsfUserId"
                defaultValue={config ? config.sapsfUserId : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="userType"
              invalid={invalidFields.userType}
              invalidMessage="Тип пользователя Success Factors является обязательным."
              helpText="Тип пользователя SAP (администратор или пользователь)."
            >
              <label htmlFor="userType">Тип пользователя SAP Success Factors</label>
              <Input
                type="select"
                id="userType"
                name="userType"
                defaultValue={config ? config.userType : null}
                options={[
                  { value: 'admin', label: 'Админ' },
                  { value: 'user', label: 'Пользователь' },
                  { value: null, label: 'пусто', hidden: true },
                ]}
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="transmitTotalHours"
              helpText="Включить totalHours в передаваемые данные о завершении работы"
            >
              <label htmlFor="transmitTotalHours">Передать общее количество часов?</label>
              <Input
                type="checkbox"
                id="transmitTotalHours"
                name="transmitTotalHours"
                className="ml-3"
                checked={transmitTotalHours}
                onChange={() => this.setState(prevState => ({ transmitTotalHours: !prevState.transmitTotalHours }))}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="additionalLocales"
              helpText="Список дополнительных локалей, используемых в SAP (например, 'Dutch' или 'English Canadian'), разделенный запятой. Дополнительные примеры см. в документации SAP."
            >
              <label htmlFor="additionalLocales">Дополнительные локализации</label>
              <Input
                type="text"
                id="additionalLocales"
                name="additionalLocales"
                defaultValue={config ? config.additionalLocales : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
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
        </div>
        {error && (
          <div className="row">
            <div className="col col-3 mt-3">
              <div className="form-group is-invalid align-items-left">
                <StatusAlert
                  alertType="danger"
                  iconClassName="fa fa-times-circle"
                  title="Неудается отправить форму конфигурации:"
                  message={error}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    );
  }
}

SuccessFactorsIntegrationConfigForm.defaultProps = {
  config: null,
};

SuccessFactorsIntegrationConfigForm.propTypes = {
  config: PropTypes.shape({
    active: PropTypes.bool,
    sapsfBaseUrl: PropTypes.string,
    sapsfCompanyId: PropTypes.string,
    sapsfUserId: PropTypes.string,
    key: PropTypes.string,
    secret: PropTypes.string,
    userType: PropTypes.string,
    transmitTotalHours: PropTypes.bool,
    additionalLocales: PropTypes.string,
  }),
  enterpriseId: PropTypes.string.isRequired,
};

export default SuccessFactorsIntegrationConfigForm;
