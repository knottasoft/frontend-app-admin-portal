// TODO: Lang support
import React, { useState } from 'react';
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

export const REQUIRED_DEGREED_CONFIG_FIELDS = [
  'degreedBaseUrl',
  'degreedUserId',
  'degreedUserPassword',
  'secret',
  'degreedCompanyId',
  'key',
];

function configFormReducer(state, action) {
  switch (action.type) {
    case 'PENDING': {
      return { ...state, error: null, submitState: SUBMIT_STATES.PENDING };
    }
    case 'ERROR': {
      return { ...state, error: action.value, submitState: SUBMIT_STATES.ERROR };
    }
    case 'INVALID': {
      return {
        ...state,
        submitState: SUBMIT_STATES.ERROR,
        invalidFields: action.value,
        error: 'Форма не может быть отправлена, так как есть поля с недопустимыми значениями. Пожалуйста, исправьте их ниже.',
      };
    }
    case 'COMPLETE': {
      return {
        ...state,
        invalidFields: {},
        error: null,
        submitState: SUBMIT_STATES.COMPLETE,
      };
    }
    case 'SET_CONFIG': {
      return {
        ...state,
        config: action.value,
      };
    }
    case 'BASE_SUBMIT': {
      return {
        ...state,
        submitState: SUBMIT_STATES.DEFAULT,
      };
    }
    default: {
      return { state };
    }
  }
}

function DegreedIntegrationConfigForm({ enterpriseId, config }) {
  const [state, dispatch] = React.useReducer(
    configFormReducer,
    {
      submitState: SUBMIT_STATES.default,
      error: null,
      config: null,
      invalidFields: {},
    },
  );
  const [active, setActive] = useState(config?.active);

  /**
   * Creates a new third party provider configuration, then updates this list with the response.
   * Returns if there is an error.
   * @param {FormData} formData
   */
  const createDegreedConfig = async formData => {
    const transformedData = snakeCaseFormData(formData);
    transformedData.append('enterprise_customer', enterpriseId);
    try {
      const response = await LmsApiService.postNewDegreedConfig(transformedData);
      return dispatch({
        type: 'SET_CONFIG',
        value: response.data,
      });
    } catch (error) {
      return handleErrors(error);
    }
  };

  const updateDegreedConfig = async (formData, configId) => {
    const transformedData = snakeCaseFormData(formData);
    transformedData.append('enterprise_customer', enterpriseId);
    try {
      const response = await LmsApiService.updateDegreedConfig(transformedData, configId);
      return dispatch({
        type: 'SET_CONFIG',
        value: response.data,
      });
    } catch (error) {
      return handleErrors(error);
    }
  };

  /**
  * attempt to submit the form data and show any error states or invalid fields.
  * @param {FormData} formData
  */
  const handleSubmit = async (formData, existingConfig) => {
    dispatch({
      type: 'PENDING',
    });
    // validate the form
    const invalidFields = validateLmsConfigForm(formData, REQUIRED_DEGREED_CONFIG_FIELDS);
    if (!isEmpty(invalidFields)) {
      dispatch({
        type: 'INVALID',
        value: invalidFields,
      });
      return;
    }

    if (existingConfig) {
      const err = await updateDegreedConfig(formData, existingConfig.id);
      if (err) {
        dispatch({
          type: 'ERROR',
          value: err,
        });
      } else {
        dispatch({
          type: 'COMPLETE',
        });
      }
    } else {
      // ...or create a new configuration
      const err = await createDegreedConfig(formData);

      if (err) {
        dispatch({
          type: 'ERROR',
          value: err,
        });
      } else {
        dispatch({
          type: 'COMPLETE',
        });
      }
    }
  };

  let errorAlert;
  if (state.error) {
    errorAlert = (
      <div className="form-group is-invalid align-items-left">
        <StatusAlert
          alertType="danger"
          iconClassName="fa fa-times-circle"
          title="Неудается отправить форму конфигурации:"
          message={state.error}
          dismissible
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleSubmit(formData, state.config || config);
      }}
      onChange={() => dispatch({ type: 'BASE_SUBMIT' })}
    >
      <div className="row">
        <div className="col col-3 mt-3">
          {errorAlert}
        </div>
      </div>
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
              onChange={() => setActive(prevActive => (!prevActive))}
            />
          </ValidationFormGroup>
        </div>
      </div>
      <div className="row">
        <div className="col col-4">
          <ValidationFormGroup
            for="degreedCompanyId"
            invalid={state.invalidFields.degreedCompanyId}
            invalidMessage="Требуется код организации Degreed."
            helpText="Код организации, предоставленный вам компанией Degreed."
          >
            <label htmlFor="degreedCompanyId">Код организации Degreed</label>
            <Input
              type="text"
              id="degreedCompanyId"
              name="degreedCompanyId"
              defaultValue={config ? config.degreedCompanyId : null}
              data-hj-suppress
            />
          </ValidationFormGroup>
        </div>
      </div>
      <div className="row">
        <div className="col col-4">
          <ValidationFormGroup
            for="degreedBaseUrl"
            invalid={state.invalidFields.degreedBaseUrl}
            invalidMessage="Требуется URL-адрес экземпляра Degreed"
            helpText="URL-адрес вашего экземпляра Degreed. Обязательно укажите протокол (т.е. https/http)."
          >
            <label htmlFor="degreedBaseUrl">URL-адрес экземпляра Degreed</label>
            <Input
              type="text"
              id="degreedBaseUrl"
              name="degreedBaseUrl"
              defaultValue={config ? config.degreedBaseUrl : null}
              data-hj-suppress
            />
          </ValidationFormGroup>
        </div>
      </div>
      <div className="row">
        <div className="col col-4">
          <ValidationFormGroup
            for="key"
            invalid={state.invalidFields.key}
            invalidMessage="Требуется идентификатор клиента API Degreed."
            helpText="Идентификатор клиента API, используемый для выполнения вызовов в Degreed от имени клиента."
          >
            <label htmlFor="key">Идентификатор клиента API</label>
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
            invalid={state.invalidFields.secret}
            invalidMessage="Требуется наличие секрет клиента API Degreed"
            helpText="Секрет клиента API, используемый для совершения вызовов в Degreed от имени клиента."
          >
            <label htmlFor="secret">Секрет клиента API</label>
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
            for="degreedUserId"
            invalid={state.invalidFields.degreedUserId}
            invalidMessage="Идентификатор пользователя Degreed требуется для доступа к Degreed через Oauth."
            helpText="Идентификатор пользователя Degreed, предоставленный поставщику контента компанией Degreed."
          >
            <label htmlFor="degreedUserId">Идентификатор пользователя Degreed</label>
            <Input
              type="text"
              id="degreedUserId"
              name="degreedUserId"
              defaultValue={config ? config.degreedUserId : null}
              data-hj-suppress
            />
          </ValidationFormGroup>
        </div>
      </div>
      <div className="row">
        <div className="col col-4">
          <ValidationFormGroup
            for="degreedUserPassword"
            invalid={state.invalidFields.degreedUserPassword}
            invalidMessage="Пароль пользователя Degreed требуется для доступа к Degreed через Oauth."
            helpText="Пароль пользователя Degreed, предоставленный поставщику контента компанией Degreed."
          >
            <label htmlFor="degreedUserPassword">Пароль пользователя Degreed</label>
            <Input
              type="password"
              id="degreedUserPassword"
              name="degreedUserPassword"
              defaultValue={config ? config.degreedUserPassword : null}
              data-hj-suppress
            />
          </ValidationFormGroup>
        </div>
      </div>

      <div className="row">
        <div className="col col-2">
          <StatefulButton
            state={state.submitState}
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
    </form>
  );
}

DegreedIntegrationConfigForm.defaultProps = {
  config: null,
};

DegreedIntegrationConfigForm.propTypes = {
  enterpriseId: PropTypes.string.isRequired,
  config: PropTypes.shape({
    active: PropTypes.bool,
    degreedBaseUrl: PropTypes.string,
    degreedCompanyId: PropTypes.string,
    degreedUserId: PropTypes.string,
    degreedUserPassword: PropTypes.string,
    key: PropTypes.string,
    secret: PropTypes.string,
  }),
};

export default DegreedIntegrationConfigForm;
