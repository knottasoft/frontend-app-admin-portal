// TODO: Lang support
import { getSubscriptionContactText } from '../../utils';

const emailTemplate = {
  greeting: 'Мы заметили, что вы еще не успели начать учиться на платформе ЦОПП СК!  Начать обучение и просмотреть каталог курсов очень просто.',
  body: `{ENTERPRISE_NAME} сотрудничает с ЦОПП СК, чтобы предоставить всем желающим доступ к высококачественным онлайн-курсам. Начните подписку и просмотрите курсы практически по всем предметам, включая аналитику данных, цифровые медиа, бизнес и лидерство, коммуникации, компьютерные науки и многое другое.

Начните учиться: {LICENSE_ACTIVATION_LINK}
  `,
  closing: getSubscriptionContactText,
};

export default emailTemplate;
