// TODO: Lang support
export const TAB_ALL_USERS = 'TAB_ALL_USERS';
export const TAB_LICENSED_USERS = 'TAB_LICENSED_USERS';
export const TAB_PENDING_USERS = 'TAB_PENDING_USERS';
export const TAB_REVOKED_USERS = 'TAB_REVOKED_USERS';

export const PAGE_SIZE = 20;

// Subscription license statuses as defined on the backend
export const ACTIVATED = 'activated';
export const ASSIGNED = 'assigned';
export const REVOKED = 'revoked';
export const ALL_USERS = 'assigned,activated,revoked';

export const licenseStatusByTab = {
  [TAB_ALL_USERS]: ALL_USERS,
  [TAB_LICENSED_USERS]: ACTIVATED,
  [TAB_PENDING_USERS]: ASSIGNED,
  [TAB_REVOKED_USERS]: REVOKED,
};

export const SUBSCRIPTIONS = 'Подписки';
export const SUBSCRIPTION_USERS = 'Пользователи подписки';
export const SUBSCRIPTION_USERS_OVERVIEW = 'Обзор пользователей подписки';

export const NETWORK_ERROR_MESSAGE = 'Произошла ошибка при загрузке данных.';
export const DEFAULT_PAGE = 1;

// used to determine whether to show the revocation cap messaging in the license revoke modal
export const SHOW_REVOCATION_CAP_PERCENT = 80;

// Subscription expiration
// Days until expiration constants
export const SUBSCRIPTION_DAYS_REMAINING_MODERATE = 120;
export const SUBSCRIPTION_DAYS_REMAINING_SEVERE = 60;
export const SUBSCRIPTION_DAYS_REMAINING_EXCEPTIONAL = 30;
// Prefix for cookies that determine if the user has seen the modal for that range of expiration
export const SEEN_SUBSCRIPTION_EXPIRATION_MODAL_COOKIE_PREFIX = 'seen-expiration-modal-';

// Multiple subscription picker
export const DEFAULT_LEAD_TEXT = 'Приглашайте своих обучающихся для доступа к каталогу курсов и управления когортами подписчиков';
