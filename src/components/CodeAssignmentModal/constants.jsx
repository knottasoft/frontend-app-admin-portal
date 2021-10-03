import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { MODAL_TYPES } from '../EmailTemplateForm/constants';
import { EMAIL_TEMPLATE_FIELDS } from '../EmailTemplateForm';
import CheckboxWithTooltip from '../ReduxFormCheckbox/CheckboxWithTooltip';

export const ASSIGNMENT_ERROR_TITLES = {
  [MODAL_TYPES.assign]: 'Невозможно присвоить коды',
  [MODAL_TYPES.save]: 'Не удается сохранить шаблон',
};
export const EMAIL_TEMPLATE_NUDGE_EMAIL_ID = 'enable-nudge-emails';

export const ASSIGNMENT_MODAL_FIELDS = {
  ...EMAIL_TEMPLATE_FIELDS,
  [EMAIL_TEMPLATE_NUDGE_EMAIL_ID]: {
    name: EMAIL_TEMPLATE_NUDGE_EMAIL_ID,
    id: EMAIL_TEMPLATE_NUDGE_EMAIL_ID,
    component: CheckboxWithTooltip,
    className: 'auto-reminder-wrapper',
    icon: faInfoCircle,
    altText: 'Дополнительная информация',
    tooltipText: 'Платформа напомнит учащимся о необходимости погасить код через 3, 10 и 19 дней после его присвоения.',
    label: 'Автоматизировать напоминания',
    defaultChecked: true,
  },
};

export const NOTIFY_LEARNERS_CHECKBOX_TEST_ID = 'notify-learners-checkbox';
export const SUBMIT_BUTTON_TEST_ID = 'submit-button';
