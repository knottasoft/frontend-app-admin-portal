// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  ValidationFormGroup, Input, StatefulButton, Icon,
} from '@edx/paragon';
import { snakeCaseFormData } from '../../utils';
import StatusAlert from '../StatusAlert';
import LmsApiService from '../../data/services/LmsApiService';
import SUBMIT_STATES from '../../data/constants/formSubmissions';
import { handleErrors, validateLmsConfigForm } from './common';

export const REQUIRED_CANVAS_CONFIG_FIELDS = [
  'clientId',
  'clientSecret',
  'canvasAccountId',
  'canvasBaseUrl',
];

class CanvasIntegrationConfigForm extends React.Component {
  state = {
    invalidFields: {},
    submitState: SUBMIT_STATES.DEFAULT,
    active: this.props.config?.active,
    error: undefined,
  };

  createCanvasConfig = async (formData) => {
    const transformedData = snakeCaseFormData(formData);
    try {
      const response = await LmsApiService.postNewCanvasConfig(transformedData);
      this.setState({
        config: response.data,
        error: undefined,
      });
      return undefined;
    } catch (error) {
      return handleErrors(error);
    }
  }

  updateCanvasConfig = async (formData, uuid) => {
    const transformedData = snakeCaseFormData(formData);
    try {
      const response = await LmsApiService.updateCanvasConfig(transformedData, uuid);
      this.setState({
        config: response.data,
        error: undefined,
      });
      return undefined;
    } catch (error) {
      return handleErrors(error);
    }
  }

  handleSubmit = async (formData, config) => {
    await this.setState({ submitState: SUBMIT_STATES.PENDING, error: null, invalidFields: {} });
    const invalidFields = validateLmsConfigForm(formData, REQUIRED_CANVAS_CONFIG_FIELDS);
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
      err = await this.updateCanvasConfig(formData, config.id);
    } else {
      err = await this.createCanvasConfig(formData);
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
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="clientId"
              invalid={invalidFields.clientId}
              invalidMessage="Требуется. Идентификатор клиента не должен быть пустым"
            >
              <label htmlFor="clientId">Идентификатор клиента API</label>
              <Input
                type="text"
                id="clientId"
                name="clientId"
                className="ml-3"
                defaultValue={config ? config.clientId : ''}
                onChange={() => this.setState(prevState => ({ clientId: !prevState.clientId }))}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="clientSecret"
              invalid={invalidFields.clientSecret}
              invalidMessage="Требуется. Секрет клиента не должен быть пустым"
            >
              <label htmlFor="clientSecret">Секрет клиента API</label>
              <Input
                type="text"
                id="clientSecret"
                name="clientSecret"
                className="ml-3"
                defaultValue={config ? config.clientSecret : ''}
                onChange={() => this.setState(prevState => ({ clientSecret: !prevState.clientSecret }))}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="canvasAccountId"
              invalid={invalidFields.canvasAccountId}
              invalidMessage="Требуется. Canvas Account Id не должен быть пустым"
            >
              <label htmlFor="canvasAccountId">Идентификатор учетной записи Canvas</label>
              <Input
                type="number"
                id="canvasAccountId"
                name="canvasAccountId"
                className="ml-3"
                defaultValue={config ? config.canvasAccountId : null}
                onChange={() => this.setState(prevState => ({ canvasAccountId: !prevState.canvasAccountId }))}
                data-hj-suppress
              />
            </ValidationFormGroup>
          </div>
        </div>
        <div className="row">
          <div className="col col-6">
            <ValidationFormGroup
              for="canvasBaseUrl"
              invalid={invalidFields.canvasBaseUrl}
              invalidMessage="Требуется. Адрес Canvas Base URL не должен быть пустым"
            >
              <label htmlFor="canvasBaseUrl">Базовый URL Canvas</label>
              <Input
                type="text"
                id="canvasBaseUrl"
                name="canvasBaseUrl"
                className="ml-3"
                defaultValue={config ? config.canvasBaseUrl : null}
                onChange={() => this.setState(prevState => ({ canvasBaseUrl: !prevState.canvasBaseUrl }))}
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
                pending: 'Сохранение',
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

CanvasIntegrationConfigForm.defaultProps = {
  config: null,
  enterpriseId: null,
};

CanvasIntegrationConfigForm.propTypes = {
  config: PropTypes.shape({
    clientId: PropTypes.string,
    clientSecret: PropTypes.string,
    canvasAccountId: PropTypes.number,
    canvasBaseUrl: PropTypes.string,
    active: PropTypes.bool,
  }),
  enterpriseId: PropTypes.string,
};

export default CanvasIntegrationConfigForm;
