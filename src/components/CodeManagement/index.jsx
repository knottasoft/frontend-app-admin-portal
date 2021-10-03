// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import qs from 'query-string';
import { Button, Icon, Pagination } from '@edx/paragon';

import Hero from '../Hero';
import Coupon from '../Coupon';
import LoadingMessage from '../LoadingMessage';
import StatusAlert from '../StatusAlert';
import SearchBar from '../SearchBar';
import CodeSearchResults from '../CodeSearchResults';

import { updateUrl } from '../../utils';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './CodeManagement.messages';

class CodeManagement extends React.Component {
  constructor(props) {
    super(props);

    this.couponRefs = [];
    this.state = {
      hasRequestedCodes: false,
      searchQuery: '',
    };

    this.handleRefreshData = this.handleRefreshData.bind(this);
  }

  componentDidMount() {
    const { enterpriseId, location, history } = this.props;
    const queryParams = qs.parse(location.search);

    if (enterpriseId) {
      this.paginateCouponOrders(queryParams.overview_page || 1);
    }

    if (location.state && location.state.hasRequestedCodes) {
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        hasRequestedCodes: location.state.hasRequestedCodes,
      });

      history.replace({
        ...location.pathname,
        state: {},
      });
    }

    // To fetch active email templates for assign, remind, and revoke
    // There can only exist one active email template against each action
    // Which is why we are passing active query param
  }

  componentDidUpdate(prevProps) {
    const {
      coupons,
      enterpriseId,
      location,
    } = this.props;

    const queryParams = qs.parse(location.search);
    const prevQueryParams = qs.parse(prevProps.location.search);
    const couponId = queryParams.coupon_id;

    if (enterpriseId && enterpriseId !== prevProps.enterpriseId) {
      this.paginateCouponOrders(queryParams.overview_page);
    }

    if (queryParams.overview_page !== prevQueryParams.overview_page) {
      this.paginateCouponOrders(queryParams.overview_page);
    }

    // If the specified coupon id doesn't exist in the coupons returned by the API,
    // remove the coupon id from the URL.
    if (couponId && coupons && coupons !== prevProps.coupons) {
      const couponWithIdExists = coupons.results.find((
        coupon => coupon.id === parseInt(couponId, 10)
      ));

      if (!couponWithIdExists) {
        this.removeQueryParams(['coupon_id', 'page']);
      }
    }

    if (queryParams !== prevQueryParams) {
      this.setCouponOpacity(couponId);
    }
  }

  componentWillUnmount() {
    this.props.clearCouponOrders();
  }

  getCouponRefs() {
    return this.couponRefs.filter(coupon => coupon);
  }

  setCouponOpacity(couponId) {
    const couponRefs = this.getCouponRefs();

    if (couponId) {
      couponRefs.forEach((coupon) => {
        const { data: { id } } = coupon.props;
        if (id !== parseInt(couponId, 10)) {
          coupon.setCouponOpacity(true);
        }
      });
    } else {
      couponRefs.forEach((coupon) => {
        coupon.setCouponOpacity(false);
      });
    }
  }

  removeQueryParams(keys) {
    const { location } = this.props;
    const queryParams = qs.parse(location.search);

    keys.forEach((key) => {
      queryParams[key] = undefined;
    });

    updateUrl(queryParams);
  }

  paginateCouponOrders(pageNumber) {
    const page = pageNumber ? parseInt(pageNumber, 10) : 1;
    this.props.fetchCouponOrders({ page });
  }

  handleRefreshData() {
    this.paginateCouponOrders(1);
    this.removeQueryParams(['coupon_id', 'page', 'overview_page']);
    this.setState({ searchQuery: '' });
  }

  handleCouponExpand(selectedIndex) {
    const { location } = this.props;
    const queryParams = qs.parse(location.search);
    const coupons = this.getCouponRefs();
    const selectedCoupon = coupons[selectedIndex];
    const couponId = selectedCoupon.props.data.id;

    queryParams.coupon_id = couponId;

    updateUrl(queryParams);
    this.setCouponOpacity(couponId);
    this.setState({ searchQuery: '' });
  }

  handleCouponCollapse() {
    this.setCouponOpacity();
    this.removeQueryParams(['coupon_id', 'page']);
  }

  hasCouponData(coupons) {
    if (!coupons) {
      return false;
    }
    const { results } = coupons;
    return results && results.length > 0;
  }

  renderLoadingMessage() {
    return <LoadingMessage className="coupons mt-3" />;
  }

  renderErrorMessage() {
    const { intl } = this.props;
    return (
      <StatusAlert
        className="mt-3"
        alertType="danger"
        iconClassName="fa fa-times-circle"
        title={intl.formatMessage(messages['code.management.alert.error.title'])}
        message={intl.formatMessage(messages['code.management.alert.error.message'], {message: this.props.error.message})}
      />
    );
  }

  renderCoupons() {
    const { coupons, location, intl } = this.props;
    const queryParams = qs.parse(location.search);

    return (
      <>
        {coupons.results.map((coupon, index) => (
          <Coupon
            ref={(node) => { this.couponRefs[index] = node; }}
            key={coupon.id}
            data={coupon}
            isExpanded={coupon.id === parseInt(queryParams.coupon_id, 10)}
            onExpand={() => this.handleCouponExpand(index)}
            onCollapse={() => this.handleCouponCollapse()}
          />
        ))}
        <div className="d-flex mt-4 justify-content-center">
          <Pagination
            onPageSelect={page => updateUrl({
              coupon_id: undefined,
              page: undefined,
              overview_page: page !== 1 ? page : undefined,
            })}
            pageCount={coupons.num_pages}
            currentPage={coupons.current_page}
            paginationLabel={intl.formatMessage(messages['code.management.coupon.pagination.label'])}
          />
        </div>
      </>
    );
  }

  renderRequestCodesSuccessMessage() {
    const { intl } = this.props;

    return (
      <StatusAlert
        className="mt-3"
        alertType="success"
        iconClassName="fa fa-check-circle"
        title={intl.formatMessage(messages['code.management.alert.request-codes.title'])}
        message={intl.formatMessage(messages['code.management.alert.request-codes.message'])}
        dismissible
      />
    );
  }

  renderEmptyDataMessage() {
    const { intl } = this.props;

    return (
      <StatusAlert
        alertType="warning"
        iconClassName="fa fa-exclamation-circle"
        message={intl.formatMessage(messages['code.management.alert.no-results.message'])}
      />
    );
  }

  render() {
    const {
      coupons,
      error,
      loading,
      match,
      intl,
    } = this.props;
    const { hasRequestedCodes, searchQuery } = this.state;
    const hasSearchQuery = !!searchQuery;
    return (
      <>
        <Helmet>
          <title>{intl.formatMessage(messages['code.management.helmet'])}</title>
        </Helmet>
        <main role="main">
          <Hero title={intl.formatMessage(messages['code.management.hero'])} />
          <div className="container-fluid">
            {hasRequestedCodes && this.renderRequestCodesSuccessMessage()}
            <div className="row mt-4 mb-3 no-gutters">
              <div className="col-12 col-xl-3 mb-3 mb-xl-0">
                <h2>{intl.formatMessage(messages['code.management.overview.title'])}</h2>
              </div>
              <div className="col-12 col-xl-4 mb-3 mb-xl-0">
                <SearchBar
                  placeholder={intl.formatMessage(messages['code.management.overview.search.placeholder'])}
                  onSearch={(query) => {
                    this.setState({ searchQuery: query });
                    this.removeQueryParams(['coupon_id', 'page']);
                  }}
                  onClear={() => {
                    this.setState({ searchQuery: '' });
                    this.removeQueryParams(['page']);
                  }}
                  value={searchQuery}
                  inputProps={{ 'data-hj-suppress': true }}
                />
              </div>
              <div className="col-12 col-xl-5 mb-3 mb-xl-0 text-xl-right">
                <Button
                  variant="link"
                  className="mr-2"
                  onClick={this.handleRefreshData}
                  disabled={loading}
                >
                  <>
                    <Icon className="fa fa-refresh mr-2" />
                    {intl.formatMessage(messages['code.management.overview.button.refresh'])}
                  </>
                </Button>
                <Link
                  className="request-codes-btn btn btn-primary"
                  to={`${match.path}/request`}
                >
                  <>
                    <Icon className="fa fa-plus mr-2" />
                    {intl.formatMessage(messages['code.management.overview.link.request-more'])}
                  </>
                </Link>
              </div>
            </div>
            <div className="row">
              <div
                className={classNames(
                  'col',
                  {
                    'mt-2 mb-4': hasSearchQuery,
                  },
                )}
              >
                <CodeSearchResults
                  isOpen={hasSearchQuery}
                  searchQuery={searchQuery}
                  onClose={() => {
                    this.setState({ searchQuery: '' });
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                {error && this.renderErrorMessage()}
                {loading && this.renderLoadingMessage()}
                {!loading && !error && !this.hasCouponData(coupons)
                  && this.renderEmptyDataMessage()}
                {!loading && !error && this.hasCouponData(coupons) && this.renderCoupons()}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

CodeManagement.defaultProps = {
  enterpriseId: null,
  coupons: null,
  loading: false,
  error: null,
};

CodeManagement.propTypes = {
  intl: intlShape.isRequired,
  fetchCouponOrders: PropTypes.func.isRequired,
  clearCouponOrders: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
    state: PropTypes.shape({
      hasRequestedCodes: PropTypes.bool,
    }),
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  enterpriseId: PropTypes.string,
  coupons: PropTypes.shape({
    results: PropTypes.arrayOf(PropTypes.shape({})),
    num_pages: PropTypes.number,
    current_page: PropTypes.number,
  }),
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
};

export default injectIntl(CodeManagement);
