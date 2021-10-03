// TODO: Lang support
import React from 'react';
import { Field } from 'redux-form';

import TextAreaAutoSize from '../TextAreaAutoSize';
import FileInput from '../FileInput';
import { normalizeFileUpload } from '../../utils';

const BulkAssignFields = () => (
  <>
    <h3 className="mb-2">Добавить обучающихся</h3>
    <div className="pl-4 field-group">
      <Field
        name="email-addresses"
        component={TextAreaAutoSize}
        label="Адреса электронной почты"
        description="Чтобы добавить более одного пользователя, введите один адрес электронной почты в каждой строке."
        descriptionTestId="email-addresses-help-text"
        data-hj-suppress
      />
      <p className="pb-2">
        ИЛИ
      </p>
      <Field
        id="csv-email-addresses"
        name="csv-email-addresses"
        component={FileInput}
        label="Загрузить адреса электронной почты"
        description="Файл должен представлять собой CSV, содержащий один столбец адресов электронной почты."
        descriptionTestId="csv-email-addresses-help-text"
        accept=".csv"
        normalize={normalizeFileUpload}
        data-hj-suppress
      />
    </div>
  </>
);

export default BulkAssignFields;
