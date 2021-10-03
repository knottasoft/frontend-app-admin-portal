// TODO: Lang support
import {
  MAX_EMAIL_ADDRESS_ALLOWED, EMAIL_ADDRESS_CSV_FORM_DATA, EMAIL_ADDRESS_TEXT_FORM_DATA,
} from '../../data/constants/addUsers';

export const getTooManyAssignmentsMessage = ({
  isCsv = false,
  emails,
  numCodes,
  selected,
}) => {
  let message = `У вас ${numCodes}`;

  message += ` ${numCodes > 1 ? 'кодов' : 'код'}`;
  message += ` ${selected ? 'выбрано' : 'осталось'}`;
  message += `, но ${isCsv ? 'ваш файл имеет' : 'вы ввели'}`;
  message += ` ${emails.length} электронных адресов. Пожалуйста, попробуйте еще раз.`;

  return message;
};

export const getInvalidEmailMessage = (invalidEmailIndices, emails) => {
  const firstInvalidIndex = [...invalidEmailIndices].shift();
  const invalidEmail = emails[firstInvalidIndex];
  const message = `Адрес электронной почты ${invalidEmail} в строке ${firstInvalidIndex + 1} недействителен. Пожалуйста, попробуйте еще раз.`;
  return message;
};

export const NO_EMAIL_ADDRESS_ERROR = 'Не указаны адреса электронной почты. Либо введите адреса электронной почты вручную, либо загрузите файл CSV.';
export const BOTH_TEXT_AREA_AND_CSV_ERROR = 'Вы загрузили CSV и вручную ввели адреса электронной почты. Пожалуйста, используйте только одно из этих полей.';
export const MAX_EMAILS_ADDRESS_ALLOWED_ERROR = 'Вы загрузили более 500 адресов электронной почты. Пожалуйста, загрузите 500 или меньше.';

export const getErrors = ({
  invalidTextAreaEmails = [], textAreaEmails = [], validTextAreaEmails = [],
  unassignedCodes, numberOfSelectedCodes, shouldValidateSelectedCodes,
  invalidCsvEmails = [], csvEmails = [], validCsvEmails = [],
}) => {
  const errors = {
    _error: [],
  };

  /* eslint-disable no-underscore-dangle */
  if (validTextAreaEmails.length === 0 && validCsvEmails.length === 0) {
    errors._error.push(NO_EMAIL_ADDRESS_ERROR);
    return errors;
  }

  if (validTextAreaEmails.length > 0 && validCsvEmails.length > 0) {
    errors._error.push(BOTH_TEXT_AREA_AND_CSV_ERROR);
    return errors;
  }

  if (validTextAreaEmails.length > MAX_EMAIL_ADDRESS_ALLOWED) {
    errors._error.push(MAX_EMAILS_ADDRESS_ALLOWED_ERROR);
    return errors;
  }

  if (validTextAreaEmails.length > 0) {
    if (invalidTextAreaEmails.length > 0) {
      const invalidEmailMessage = getInvalidEmailMessage(invalidTextAreaEmails, textAreaEmails);
      errors[EMAIL_ADDRESS_TEXT_FORM_DATA] = invalidEmailMessage;
      errors._error.push(invalidEmailMessage);
    } else if (validTextAreaEmails.length > unassignedCodes) {
      const message = getTooManyAssignmentsMessage({
        emails: validTextAreaEmails,
        numCodes: unassignedCodes,
      });
      errors[EMAIL_ADDRESS_TEXT_FORM_DATA] = message;
      errors._error.push(message);
    } else if (
      numberOfSelectedCodes && shouldValidateSelectedCodes
      && validTextAreaEmails.length > numberOfSelectedCodes
    ) {
      const message = getTooManyAssignmentsMessage({
        emails: validTextAreaEmails,
        numCodes: numberOfSelectedCodes,
        selected: true,
      });
      errors[EMAIL_ADDRESS_TEXT_FORM_DATA] = message;
      errors._error.push(message);
    }
    return errors;
  }

  if (invalidCsvEmails.length > 0) {
    const invalidEmailMessage = getInvalidEmailMessage(invalidCsvEmails, csvEmails);
    errors[EMAIL_ADDRESS_CSV_FORM_DATA] = invalidEmailMessage;
    errors._error.push(invalidEmailMessage);
  } else if (validCsvEmails.length > unassignedCodes) {
    const message = getTooManyAssignmentsMessage({
      isCsv: true,
      emails: validCsvEmails,
      numCodes: unassignedCodes,
    });
    errors[EMAIL_ADDRESS_CSV_FORM_DATA] = message;
    errors._error.push(message);
  } else if (
    numberOfSelectedCodes && shouldValidateSelectedCodes
    && validCsvEmails.length > numberOfSelectedCodes
  ) {
    const message = getTooManyAssignmentsMessage({
      isCsv: true,
      emails: validCsvEmails,
      numCodes: numberOfSelectedCodes,
      selected: true,
    });
    errors[EMAIL_ADDRESS_CSV_FORM_DATA] = message;
    errors._error.push(message);
  }

  return errors;
};
