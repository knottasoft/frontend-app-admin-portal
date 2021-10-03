// TODO: Lang support
import React from 'react';
import { Field } from 'redux-form';

import RenderField from '../RenderField';

const IndividualAssignFields = () => (
  <>
    <h3>Добавить обучающегося</h3>
    <Field
      name="email-address"
      type="email"
      component={RenderField}
      label={(
        <>
          Адрес электронной почты
          <span className="required">*</span>
        </>
      )}
      required
      data-hj-suppress
    />
  </>
);

export default IndividualAssignFields;
