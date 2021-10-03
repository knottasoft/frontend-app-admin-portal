// TODO: Lang support
/* eslint-disable import/prefer-default-export */

export const COUPON_FILTER_TYPES = {
  unassigned: 'unassigned',
  unredeemed: 'unredeemed',
  partiallyRedeemed: 'partially-redeemed',
  redeemed: 'redeemed',
};

export const COUPON_FILTERS = {
  unassigned: {
    label: 'Нераспределены',
    value: COUPON_FILTER_TYPES.unassigned,
  },
  unredeemed: {
    label: 'Непогашены',
    value: COUPON_FILTER_TYPES.unredeemed,
  },
  partiallyRedeemed: {
    label: 'Частично погашены',
    value: COUPON_FILTER_TYPES.partiallyRedeemed,
  },
  redeemed: {
    label: 'Погашены',
    value: COUPON_FILTER_TYPES.redeemed,
  },
};

export const ACTIONS = {
  remind: {
    label: 'Напомнить',
    value: 'remind',
  },
  assign: {
    label: 'Присвоить',
    value: 'assign',
  },
  revoke: {
    label: 'Отозвать',
    value: 'revoke',
  },
};

export const FILTER_OPTIONS = [{
  label: COUPON_FILTERS.unassigned.label,
  value: COUPON_FILTERS.unassigned.value,
}, {
  label: COUPON_FILTERS.unredeemed.label,
  value: COUPON_FILTERS.unredeemed.value,
}, {
  label: COUPON_FILTERS.partiallyRedeemed.label,
  value: COUPON_FILTERS.partiallyRedeemed.value,
}, {
  label: COUPON_FILTERS.redeemed.label,
  value: COUPON_FILTERS.redeemed.value,
}];

export const BULK_ACTION_SELECT_OPTIONS = [{
  label: ACTIONS.assign.label,
  value: ACTIONS.assign.value,
}, {
  label: ACTIONS.remind.label,
  value: ACTIONS.remind.value,
}, {
  label: ACTIONS.revoke.label,
  value: ACTIONS.revoke.value,
}];

export const BULK_ACTION = {
  label: 'Массовое действие',
  name: 'bulk-actions',
  controlId: 'bulkActions',
};

export const DETAILS_TEXT = {
  expanded: 'Подробное описание',
  unexpanded: 'Подробнее',
  expandedScreenReader: 'Close details',
  unexpandedScreenReader: 'Show details',
};

export const COLUMNS = {
  redemptions: {
    label: 'Погашения',
    key: 'redemptions',
  },
  code: {
    label: 'Код',
    key: 'code',
  },
  assignmentsRemaining: {
    label: 'Оставшиеся назначения',
    key: 'assignments_remaining',
  },
  actions: {
    label: 'Действия',
    key: 'actions',
  },
  lastReminderDate: {
    label: 'Дата последнего напоминания',
    key: 'last_reminder_date',
  },
  assignmentDate: {
    label: 'Дата присвоения',
    key: 'assignment_date',
  },
  assignedTo: {
    label: 'Присвоено',
    key: 'assigned_to',
  },
  redeemedBy: {
    label: 'Погашено',
    key: 'assigned_to',
  },
};

const COMMON_COLUMNS = [
  COLUMNS.redemptions,
  COLUMNS.code,
];

const REDEMTION_COLUMNS = [
  ...COMMON_COLUMNS,
  COLUMNS.assignmentDate,
  COLUMNS.lastReminderDate,
  COLUMNS.actions,
];

export const DEFAULT_TABLE_COLUMNS = {
  [COUPON_FILTERS.unassigned.value]: [
    ...COMMON_COLUMNS,
    COLUMNS.assignmentsRemaining,
    COLUMNS.actions,
  ],
  [COUPON_FILTERS.unredeemed.value]: [
    COLUMNS.assignedTo,
    ...REDEMTION_COLUMNS,
  ],
  [COUPON_FILTERS.partiallyRedeemed.value]: [
    COLUMNS.assignedTo,
    ...REDEMTION_COLUMNS,
  ],
  [COUPON_FILTERS.redeemed.value]: [
    COLUMNS.redeemedBy,
    ...COMMON_COLUMNS,
    COLUMNS.assignmentDate,
    COLUMNS.lastReminderDate,
  ],
};

export const SUCCESS_MESSAGES = {
  assign: 'Успешно присвоенный код(ы)',
  remind: 'Запрос на напоминание обработан.',
  revoke: 'Успешно отозванный код(ы)',
};
