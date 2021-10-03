// TODO: Lang support
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, ValidationFormGroup } from '@edx/paragon';
import isEmpty from 'lodash/isEmpty';
import isEmail from 'validator/lib/isEmail';

const EmailDeliveryMethodForm = ({ invalidFields, config, handleBlur }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="row">
      <div className="col">
        <ValidationFormGroup
          for="email"
          helpText="Электронная почта (адреса), по одному в строке, куда следует отправить отчет"
          invalidMessage="Требуется. Одна электронная почта на строку. Электронные адреса должны быть правильно отформатированы (email@domain.com)."
          invalid={invalidFields.emailRaw}
        >
          <label htmlFor="email">Электронная почта(ы)</label>
          <Input
            type="textarea"
            id="email"
            name="emailRaw"
            defaultValue={config ? config.email.join('\n') : undefined}
            onBlur={e => handleBlur(e, () => {
              const rows = e.target.value.split('\n');
              const emails = rows.filter(email => !isEmail(email));
              return !isEmpty(emails);
            })}
            data-hj-suppress
          />
        </ValidationFormGroup>
        {config && (
          <div className="form-group">
            <label htmlFor="changePassword">Изменить пароль</label>
            <Input
              type="checkbox"
              id="changePassword"
              className="ml-3"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
          </div>
        )}
        <ValidationFormGroup
          for="encryptedPassword"
          helpText="Этот пароль будет использоваться для защиты zip-файла. Он будет зашифрован при сохранении в базе данных."
          invalid={invalidFields.encryptedPassword}
          invalidMessage="Требуется. Пароль не должен быть пустым"
        >
          <label htmlFor="encryptedPassword">Пароль</label>
          <Input
            type="password"
            id="encryptedPassword"
            name="encryptedPassword"
            disabled={config && !checked}
            onBlur={e => handleBlur(e)}
            data-hj-suppress
          />
        </ValidationFormGroup>
      </div>
    </div>
  );
};

EmailDeliveryMethodForm.defaultProps = {
  invalidFields: {},
  config: undefined,
};

EmailDeliveryMethodForm.propTypes = {
  //  this can be dynamic, and could be empty. Based on the input fields of the form.
  invalidFields: PropTypes.objectOf(PropTypes.bool),
  handleBlur: PropTypes.func.isRequired,
  config: PropTypes.shape({
    active: PropTypes.bool,
    dataType: PropTypes.string,
    dayOfMonth: PropTypes.number,
    dayOfWeek: PropTypes.number,
    deliveryMethod: PropTypes.string,
    email: PropTypes.arrayOf(PropTypes.string),
    frequency: PropTypes.string,
    hourOfDay: PropTypes.number,
    reportType: PropTypes.string,
    sftpFilePath: PropTypes.string,
    sftpHostname: PropTypes.string,
    sftpPort: PropTypes.number,
    sftpUsername: PropTypes.string,
    pgpEncryptionKey: PropTypes.string,
  }),
};

export default EmailDeliveryMethodForm;
