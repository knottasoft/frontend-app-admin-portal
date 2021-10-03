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

export const REQUIRED_BLACKBOARD_CONFIG_FIELDS = [
  'blackboardBaseUrl',
  'clientId',
  'clientSecret',
];

class BlackboardIntegrationConfigForm extends React.Component {
  state = {
    invalidFields: {},
    submitState: SUBMIT_STATES.DEFAULT,
    active: this.props.config?.active,
    error: undefined,
  }

  /**
   * Creates a new third party provider configuration, then updates this list with the response.
   * Returns if there is an error.
   * @param {FormData} formData
   */
  createBlackboardConfig = async (formData) => {
    const transformedData = snakeCaseFormData(formData);
    transformedData.append('enterprise_customer', this.props.enterpriseId);
    try {
      const response = await LmsApiService.postNewBlackboardConfig(transformedData);
      this.setState({ config: response.data, error: undefined });
      return undefined;
    } catch (error) {
      return handleErrors(error);
    }
  }

  updateBlackboardConfig = async (formData, configUuid) => {
    const transformedData = snakeCaseFormData(formData);
    transformedData.append('enterprise_customer', this.props.enterpriseId);
    try {
      const response = await LmsApiService.updateBlackboardConfig(transformedData, configUuid);
      this.setState({ config: response.data, error: undefined });
      return undefined;
    } catch (error) {
      return handleErrors(error);
    }
  }

  /**
   * attempt to submit the form data and show any error states or invalid fields.
   * @param {FormData} formData
   */
  handleSubmit = async (formData, config) => {
    this.setState({ submitState: SUBMIT_STATES.PENDING });
    const invalidFields = validateLmsConfigForm(formData, REQUIRED_BLACKBOARD_CONFIG_FIELDS);
    if (!isEmpty(invalidFields)) {
      this.setState({
        invalidFields: {
          ...invalidFields,
        },
        submitState: SUBMIT_STATES.DEFAULT,
      });
      return;
    }

    formData.append('enterprise_customer', this.props.enterpriseId);

    let err;
    if (config) {
      err = await this.updateBlackboardConfig(formData, config.id);
    } else {
      err = await this.createBlackboardConfig(formData);
    }
    if (err) {
      this.setState({
        submitState: SUBMIT_STATES.ERROR,
        error: err,
      });
      return;
    }
    this.setState({ submitState: SUBMIT_STATES.COMPLETE });
  }

  render() {
    const {
      invalidFields,
      submitState,
      active,
      error,
    } = this.state;
    const { config } = this.props;

    let errorAlert;
    if (error) {
      errorAlert = (
        <div className="form-group is-invalid align-items-left">
          <StatusAlert
            alertType="danger"
            iconClassName="fa fa-times-circle"
            title="Неудается отправить форму конфигурации:"
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
              for="blackboardBaseUrl"
              invalid={invalidFields.blackboardBaseUrl}
              invalidMessage="Требуется URL-адрес инстанции Blackboard."
              helpText="URL-адрес вашего экземпляра Blackboard. Обязательно укажите протокол (т.е. https/http)."
            >
              <label htmlFor="blackboardBaseUrl">URL-адрес экземпляра Blackboard</label>
              <Input
                type="text"
                id="blackboardBaseUrl"
                name="blackboardBaseUrl"
                defaultValue={config ? config.blackboardBaseUrl : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="clientId"
              invalid={invalidFields.clientId}
              invalidMessage="Требуется идентификатор клиента Blackboard."
              helpText="Он должен совпадать с идентификатором клиента API, указанным в Blackboard."
            >
              <label htmlFor="clientId">Идентификатор клиента Blackboard</label>
              <Input
                type="text"
                id="clientId"
                name="clientId"
                defaultValue={config ? config.clientId : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="clientSecret"
              invalid={invalidFields.clientSecret}
              invalidMessage="Требуется секрет клиента Blackboard."
              helpText="Он должен соответствовать секрету клиента API, указанному в Blackboard."
            >
              <label htmlFor="clientSecret">Секрет клиента Blackboard</label>
              <Input
                type="text"
                id="clientSecret"
                name="clientSecret"
                defaultValue={config ? config.clientSecret : null}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-4">
            <ValidationFormGroup
              for="refreshToken"
              helpText="Токен обновления Blackboard API. Он должен автоматически распространяться после посещения конечной точки oauth complete."
            >
              <label htmlFor="refreshToken">Токен обновления API Blackboard</label>
              <Input
                type="text"
                id="refreshToken"
                name="refreshToken"
                defaultValue={config ? config.refreshToken : null}
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
        <div className="row">
          <div className="col col-3 mt-3">
            {errorAlert}
          </div>
        </div>
      </form>
    );
  }
}

BlackboardIntegrationConfigForm.defaultProps = {
  config: null,
  enterpriseId: null,
};

BlackboardIntegrationConfigForm.propTypes = {
  config: PropTypes.shape({
    active: PropTypes.bool,
    blackboardBaseUrl: PropTypes.string,
    refreshToken: PropTypes.string,
    clientId: PropTypes.string,
    clientSecret: PropTypes.string,
  }),
  enterpriseId: PropTypes.string,
};

export default BlackboardIntegrationConfigForm;
