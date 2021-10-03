import React, {
  useContext, useState, useMemo, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import {
  Alert, DataTable, TextFilter,
} from '@edx/paragon';
import { camelCaseObject } from '@edx/frontend-platform/utils';
import { logError } from '@edx/frontend-platform/logging';

import { Link } from 'react-router-dom';
import { BulkEnrollContext } from '../BulkEnrollmentContext';
import TableLoadingSkeleton from '../../TableComponent/TableLoadingSkeleton';
import { BaseSelectWithContext, BaseSelectWithContextHeader } from '../table/BulkEnrollSelect';
import BaseSelectionStatus from '../table/BaseSelectionStatus';
import { ROUTE_NAMES } from '../../EnterpriseApp/constants';
import LicenseManagerApiService from '../../../data/services/LicenseManagerAPIService';
import { DEBOUNCE_TIME_MILLIS } from '../../../algoliaUtils';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollmentStepper.messages';

export const ADD_LEARNERS_ERROR_TEXT = 'Произошла ошибка при получении данных электронной почты. Пожалуйста, повторите попытку позже.';
export const TABLE_HEADERS = {
  email: 'Электронная почта',
};

export const LINK_TEXT = 'Управление подпиской';

const AddLearnersSelectionStatus = (props) => {
  const { emails: [selectedEmails, dispatch] } = useContext(BulkEnrollContext);

  return <BaseSelectionStatus selectedRows={selectedEmails} dispatch={dispatch} {...props} />;
};

const SelectWithContext = (props) => <BaseSelectWithContext contextKey="emails" {...props} />;

const SelectWithContextHeader = (props) => <BaseSelectWithContextHeader contextKey="emails" {...props} />;

const selectColumn = {
  id: 'selection',
  Header: SelectWithContextHeader,
  Cell: SelectWithContext,
  disableSortBy: true,
};

const INITIAL_PAGE_INDEX = 0;
export const LEARNERS_PAGE_SIZE = 25;

const useIsMounted = () => {
  const componentIsMounted = useRef(true);
  useEffect(() => () => { componentIsMounted.current = false; }, []);
  return componentIsMounted;
};

const AddLearnersStep = ({
  intl,
  subscriptionUUID,
  enterpriseSlug,
}) => {

  const tableColumns = [
    selectColumn,
    {
      Header: intl.formatMessage(messages['bulk.stepper.table.header.email']),
      accessor: 'userEmail',
      Filter: TextFilter,
    },
  ];

  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ results: [], count: 0, numPages: 1 });
  const { emails: [selectedEmails] } = useContext(BulkEnrollContext);
  const { results, count, numPages } = data;
  const isMounted = useIsMounted();

  const fetchData = (tableInstance = {}) => {
    const pageIndex = tableInstance.pageIndex || INITIAL_PAGE_INDEX;
    let options = { active_only: 1, page_size: LEARNERS_PAGE_SIZE, page: pageIndex + 1 };

    const { filters } = tableInstance;
    const emailFilter = filters.find(item => item.id === 'userEmail');
    if (emailFilter) {
      options = { ...options, search: emailFilter.value };
    }
    LicenseManagerApiService.fetchSubscriptionUsers(
      subscriptionUUID,
      options,
    ).then((response) => {
      if (isMounted.current) {
        setData(camelCaseObject(response.data));
        setErrors('');
      }
    }).catch((err) => {
      logError(err);
      if (isMounted.current) {
        setErrors(err.message);
      }
    }).finally(() => {
      if (isMounted.current) {
        setLoading(false);
      }
    });
  };

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, DEBOUNCE_TIME_MILLIS),
    [subscriptionUUID, enterpriseSlug],
  );
  // Stop the invocation of the debounced function on unmount
  useEffect(() => () => {
    debouncedFetchData.cancel();
  }, []);

  const initialTableOptions = useMemo(() => ({
    getRowId: (row, relativeIndex, parent) => row?.uuid || (parent ? [parent.id, relativeIndex].join('.') : relativeIndex),
  }), []);

  return (
    <>
      <p>
        {intl.formatMessage(messages['bulk.stepper.add-learners.description'])}{' '}
        <Link to={`/${enterpriseSlug}/admin/${ROUTE_NAMES.subscriptionManagement}/${subscriptionUUID}`}>
          {intl.formatMessage(messages['bulk.stepper.add-learners.description.link'])}
        </Link>
      </p>
      <h2>{intl.formatMessage(messages['bulk.stepper.add-learners.title'])}</h2>
      {errors &&
      <Alert variant="danger">
        {intl.formatMessage(messages['bulk.stepper.add-learners.error.text'])}
      </Alert>}
      <DataTable
        isFilterable
        manualFilters
        columns={tableColumns}
        data={results}
        itemCount={count}
        isPaginated
        pageCount={numPages}
        manualPagination
        fetchData={debouncedFetchData}
        SelectionStatusComponent={AddLearnersSelectionStatus}
        initialTableOptions={initialTableOptions}
        selectedFlatRows={selectedEmails}
      >
        {loading && <TableLoadingSkeleton data-testid="skelly" />}
        {!loading
          && (
          <>
            <DataTable.TableControlBar />
            <DataTable.Table />
            <DataTable.TableFooter />
          </>
          )}
      </DataTable>
    </>
  );
};

AddLearnersStep.propTypes = {
  intl: intlShape.isRequired,
  subscriptionUUID: PropTypes.string.isRequired,
  enterpriseSlug: PropTypes.string.isRequired,
};

export default injectIntl(AddLearnersStep);
