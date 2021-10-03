// TODO: Lang support
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, ValidationFormGroup } from '@edx/paragon';

const SFTPDeliveryMethodForm = ({ invalidFields, config, handleBlur }) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <div className="row">
        <div className="col">
          <ValidationFormGroup
            for="sftpHostname"
            helpText="Хост, который должен получить отчет."
            invalidMessage="Требуется. Имя хоста не может быть пустым"
            invalid={invalidFields.sftpHostname}
          >
            <label htmlFor="sftpHostname">Имя хоста SFTP</label>
            <Input
              type="text"
              id="sftpHostname"
              name="sftpHostname"
              defaultValue={config ? config.sftpHostname : undefined}
              onBlur={e => handleBlur(e)}
              data-hj-suppress
            />
          </ValidationFormGroup>
        </div>
        <div className="col col-2">
          <ValidationFormGroup
            for="sftpPort"
            helpText="Порт подключения sftp-хоста."
            invalid={invalidFields.sftpPort}
            invalidMessage="Требуется. Должен быть действительным портом"
          >
            <label htmlFor="sftpPort">SFTP порт</label>
            <Input
              type="number"
              id="sftpPort"
              name="sftpPort"
              defaultValue={config ? config.sftpPort : 22}
              onBlur={e => handleBlur(e)}
            />
          </ValidationFormGroup>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ValidationFormGroup
            for="sftpUsername"
            helpText="имя пользователя для безопасного доступа к хосту"
            invalidMessage="Требуется. Имя пользователя не может быть пустым"
            invalid={invalidFields.sftpUsername}
          >
            <label htmlFor="sftpUsername">Имя пользователя SFTP</label>
            <Input
              type="text"
              id="sftpUsername"
              name="sftpUsername"
              defaultValue={config ? config.sftpUsername : undefined}
              onBlur={e => handleBlur(e)}
              data-hj-suppress
            />
          </ValidationFormGroup>
          {config && (
            <div className="form-group">
              <label htmlFor="changePassword">Сменить пароль</label>
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
            for="encryptedSftpPassword"
            helpText="Пароль, используемый для безопасного доступа к хосту. Пароль будет зашифрован при хранении в базе данных"
            invalid={invalidFields.encryptedSftpPassword}
            invalidMessage="Требуется. Пароль не должен быть пустым"
          >
            <label htmlFor="encryptedSftpPassword">Пароль SFTP</label>
            <Input
              type="password"
              id="encryptedSftpPassword"
              name="encryptedSftpPassword"
              onBlur={e => handleBlur(e)}
              disabled={config && !checked}
              data-hj-suppress
            />
          </ValidationFormGroup>
          <ValidationFormGroup
            for="sftpFilePath"
            helpText="Путь на хосте для доставки отчета."
            invalid={invalidFields.sftpFilePath}
            invalidMessage="Required"
          >
            <label htmlFor="sftpFilePath">Путь к файлу SFTP</label>
            <Input
              type="text"
              id="sftpFilePath"
              name="sftpFilePath"
              defaultValue={config ? config.sftpFilePath : undefined}
              onBlur={e => handleBlur(e)}
              data-hj-suppress
            />
          </ValidationFormGroup>
        </div>
      </div>
    </>
  );
};

SFTPDeliveryMethodForm.defaultProps = {
  invalidFields: {},
  config: undefined,
};

SFTPDeliveryMethodForm.propTypes = {
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

export default SFTPDeliveryMethodForm;
