// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, OverlayTrigger, Tooltip,
} from '@edx/paragon';
import { Field } from 'redux-form';

import RenderField from '../RenderField';
import './TemplateSourceFields.scss';

import {
  EMAIL_TEMPLATE_SOURCE_NEW_EMAIL,
  EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE,
} from '../../data/constants/emailTemplate';
import ReduxFormSelect from '../ReduxFormSelect';

export const TEMPLATE_SOURCE_BUTTON_ARIA_LABEL = 'Нажмите кнопку , чтобы выбрать источник шаблона';
export const TEMLATE_SOURCE_FIELDS_TEST_ID = 'template-source-fields';
const TEMPLATE_NAME_LABEL = 'Имя шаблона';

class TemplateSourceFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateOptions: [],
    };
    this.updateState = this.updateState.bind(this);
    this.makeOptions = this.makeOptions.bind(this);
    this.changeFromEmailTemplate = this.changeFromEmailTemplate.bind(this);
  }

  componentDidMount() {
    const {
      fetchEmailTemplates, emailTemplateType,
    } = this.props;
    fetchEmailTemplates({
      email_type: emailTemplateType,
      page_size: 1000,
    });
  }

  componentDidUpdate(prevProps) {
    const { allEmailTemplates, emailTemplateSource } = this.props;
    if (allEmailTemplates !== prevProps.allEmailTemplates
        && emailTemplateSource === EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE) {
      this.makeOptions(this.props);
      const emailTemplate = this.props.allEmailTemplates.filter(
        item => item.email_type === prevProps.emailTemplateType,
      );
      this.dispatchUpdatedTemplate(emailTemplate);
    }
  }

  componentWillUnmount() {
    const { setEmailTemplateSource } = this.props;
    // set the email template source to default
    setEmailTemplateSource(EMAIL_TEMPLATE_SOURCE_NEW_EMAIL);
  }

  updateState(emailTemplateSource) {
    const {
      setEmailTemplateSource, allEmailTemplates, setEmailAddress, emailTemplateType, currentEmail,
    } = this.props;
    if (emailTemplateType === 'assign') {
      setEmailAddress(currentEmail, emailTemplateType);
    }
    setEmailTemplateSource(emailTemplateSource);
    if (emailTemplateSource === EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE) {
      this.makeOptions(this.props);
      this.dispatchUpdatedTemplate(allEmailTemplates);
    }
  }

  makeOptions(props) {
    if (props.allEmailTemplates.length > 0) {
      const templateOptions = [];
      props.allEmailTemplates.forEach((emailTemplate) => {
        if (emailTemplate.email_type === props.emailTemplateType) {
          templateOptions.push({ value: emailTemplate.name, label: emailTemplate.name });
        }
      });
      this.setState({ templateOptions });
    }
  }

  dispatchUpdatedTemplate(emailTemplate) {
    const { currentFromTemplate, emailTemplateType, currentEmail } = this.props;
    if (emailTemplate.length > 0) {
      const firstEmailTemplate = emailTemplate[0];

      if (emailTemplateType === 'assign') {
        firstEmailTemplate.email_address = currentEmail;
      }
      currentFromTemplate(emailTemplateType, firstEmailTemplate);
    }
  }

  changeFromEmailTemplate(e) {
    const emailTemplate = this.props.allEmailTemplates.filter(item => item.name === e.target.value);
    this.dispatchUpdatedTemplate(emailTemplate);
  }

  render() {
    const { emailTemplateSource, disabled } = this.props;
    const newEmail = EMAIL_TEMPLATE_SOURCE_NEW_EMAIL;
    const fromTemplate = EMAIL_TEMPLATE_SOURCE_FROM_TEMPLATE;

    return (
      <>
        <div
          className="d-flex mb-3 template-source-fields"
          role="group"
          aria-label={TEMPLATE_SOURCE_BUTTON_ARIA_LABEL}
          data-testid={TEMLATE_SOURCE_FIELDS_TEST_ID}
        >
          <OverlayTrigger
            key="btn-new-email-tooltip"
            placement="top"
            overlay={(
              <Tooltip id="tooltip-top">
                Создайте новое сообщение о присвоении кода. Если вы хотите сохранить сообщение в качестве шаблона
                для дальнейшего использования, нажмите "Сохранить шаблон" перед "Присвоить код".
              </Tooltip>
            )}
          >
            <span className="template-source-btn-wrapper">
              <Button
                variant={emailTemplateSource === newEmail ? 'primary' : 'outline-primary'}
                id="btn-new-email-template"
                key="btn-new-email-template"
                className="rounded-left"
                style={{
                  pointerEvents: emailTemplateSource === newEmail ? 'none' : 'auto',
                }}
                aria-pressed={emailTemplateSource === newEmail ? 'true' : 'false'}
                onClick={() => this.updateState(newEmail)}
              >Новая электронная почта
              </Button>
            </span>
          </OverlayTrigger>

          <OverlayTrigger
            key="btn-from-template-tooltip"
            placement="top"
            overlay={(
              <Tooltip id="tooltip-top">
                Упростите назначение кода, загрузив сюда все созданные вами шаблоны.
                Просто щелкните выпадающий список Имя шаблона.
              </Tooltip>
            )}
          >
            <span className="template-source-btn-wrapper">
              <Button
                variant={emailTemplateSource !== newEmail ? 'primary' : 'outline-primary'}
                id="btn-old-email-template"
                key="btn-old-email-template"
                className="rounded-right"
                style={{
                  pointerEvents: emailTemplateSource === fromTemplate ? 'none' : 'auto',
                }}
                aria-pressed={emailTemplateSource === fromTemplate ? 'true' : 'false'}
                onClick={() => this.updateState(fromTemplate)}
              >Из шаблона
              </Button>
            </span>
          </OverlayTrigger>
        </div>
        {emailTemplateSource === newEmail ? (
          <Field
            id="templateNameInput"
            name="template-name"
            type="text"
            component={RenderField}
            label={TEMPLATE_NAME_LABEL}
            required
            disabled={disabled}
            data-hj-suppress
          />
        ) : (
          <Field
            name="template-name-select"
            component={ReduxFormSelect}
            options={this.state.templateOptions}
            onChange={this.changeFromEmailTemplate}
            disabled={disabled}
            label={TEMPLATE_NAME_LABEL}
            data-hj-suppress
          />
        )}
      </>
    );
  }
}

TemplateSourceFields.defaultProps = {
  allEmailTemplates: [],
  disabled: false,
  currentEmail: '',
};

TemplateSourceFields.propTypes = {
  emailTemplateSource: PropTypes.string.isRequired,
  emailTemplateType: PropTypes.string.isRequired,
  currentEmail: PropTypes.string,
  setEmailTemplateSource: PropTypes.func.isRequired,
  setEmailAddress: PropTypes.func.isRequired,
  currentFromTemplate: PropTypes.func.isRequired,
  fetchEmailTemplates: PropTypes.func.isRequired,
  allEmailTemplates: PropTypes.arrayOf(PropTypes.shape({})),
  disabled: PropTypes.bool,
};

export default TemplateSourceFields;
