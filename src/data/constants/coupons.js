// TODO: Lang support
const COUPONS_REQUEST = 'COUPONS_REQUEST';
const COUPONS_SUCCESS = 'COUPONS_SUCCESS';
const COUPONS_FAILURE = 'COUPONS_FAILURE';
const CLEAR_COUPONS = 'CLEAR_COUPONS';
const COUPON_REQUEST = 'COUPON_REQUEST';
const COUPON_SUCCESS = 'COUPON_SUCCESS';
const COUPON_FAILURE = 'COUPON_FAILURE';

// Coupon types
const SINGLE_USE = 'Одноразовое использование';
const MULTI_USE = 'Многоразовое использование';
const ONCE_PER_CUSTOMER = 'Один раз на одного клиента';
const MULTI_USE_PER_CUSTOMER = 'Многократное использование для каждого клиента';
const CSV_HEADER_NAME = 'e-mail адреса';

export {
  // Redux action names
  COUPONS_REQUEST,
  COUPONS_SUCCESS,
  COUPONS_FAILURE,
  CLEAR_COUPONS,
  COUPON_REQUEST,
  COUPON_SUCCESS,
  COUPON_FAILURE,

  // Coupon types
  SINGLE_USE,
  ONCE_PER_CUSTOMER,
  MULTI_USE,
  MULTI_USE_PER_CUSTOMER,

  // column name in emails csv file
  CSV_HEADER_NAME,
};
