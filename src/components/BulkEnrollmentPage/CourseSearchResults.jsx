import React, {
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';
import { DataTable } from '@edx/paragon';
import { SearchContext, SearchPagination } from '@edx/frontend-enterprise-catalog-search';

import StatusAlert from '../StatusAlert';
import { CourseNameCell, FormattedDateCell } from './table/CourseSearchResultsCells';
import { BulkEnrollContext } from './BulkEnrollmentContext';

import BaseSelectionStatus from './table/BaseSelectionStatus';
import { BaseSelectWithContext, BaseSelectWithContextHeader } from './table/BulkEnrollSelect';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollment.messages';

const ERROR_MESSAGE = 'Произошла ошибка при извлечении данных';
export const NO_DATA_MESSAGE = 'Результаты курсов отсутствуют';
export const ENROLL_TEXT = 'Зачисление обучающихся';
export const TABLE_HEADERS = {
  courseName: 'Название курса',
  courseStartDate: 'Дата начала курса',
  partnerName: 'Партнер',
  enroll: '',
};

const AddCoursesSelectionStatus = (props) => {
  const { courses: [selectedCourses, dispatch] } = useContext(BulkEnrollContext);

  return <BaseSelectionStatus selectedRows={selectedCourses} dispatch={dispatch} {...props} />;
};

const SelectWithContext = (props) => <BaseSelectWithContext contextKey="courses" {...props} />;

const SelectWithContextHeader = (props) => <BaseSelectWithContextHeader contextKey="courses" {...props} />;

const selectColumn = {
  id: 'selection',
  Header: SelectWithContextHeader,
  Cell: SelectWithContext,
  disableSortBy: true,
};

export const BaseCourseSearchResults = (props) => {
  const {
    intl,
    searchResults,
    // algolia recommends this prop instead of searching
    isSearchStalled,
    searchState,
    error,
    enterpriseSlug,
  } = props;

  const { refinementsFromQueryParams } = useContext(SearchContext);
  const columns = useMemo(() => [
    selectColumn,
    {
      Header: intl.formatMessage(messages['bulk.course-search.result.table.header.courseName']),
      accessor: 'title',
      // eslint-disable-next-line react/prop-types
      Cell: ({ value, row }) => <CourseNameCell value={value} row={row} enterpriseSlug={enterpriseSlug} />,
    },
    {
      Header: intl.formatMessage(messages['bulk.course-search.result.table.header.partnerName']),
      accessor: 'partners[0].name',
    },
    {
      Header: intl.formatMessage(messages['bulk.course-search.result.table.header.courseStartDate']),
      accessor: 'advertised_course_run.start',
      Cell: FormattedDateCell,
    },
  ], []);

  const page = useMemo(
    () => {
      if (refinementsFromQueryParams.page) {
        return refinementsFromQueryParams.page;
      }
      return searchState && searchState.page;
    },
    [searchState?.page, refinementsFromQueryParams],
  );

  const { courses: [selectedCourses] } = useContext(BulkEnrollContext);

  if (isSearchStalled) {
    return (
      <>
        <div className="sr-only">{intl.formatMessage(messages['bulk.course-search.result.skeleton'])}</div>
        <Skeleton className="mt-3" height={50} count={25} />
      </>
    );
  }

  if (!isSearchStalled && error) {
    return (
      <StatusAlert
        alertType="danger"
        iconClassName="fa fa-times-circle"
        message={
          intl.formatMessage(messages['bulk.course-search.result.message.error'], {errorMessage: error.message})
        }
      />
    );
  }
  if (!isSearchStalled && searchResults?.nbHits === 0) {
    return (
      <StatusAlert
        alertType="warning"
        iconClassName="fa fa-exclamation-circle"
        message={intl.formatMessage(messages['bulk.course-search.result.message.nodata'])}
      />
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={searchResults?.hits || []}
        itemCount={searchResults?.nbHits}
        SelectionStatusComponent={AddCoursesSelectionStatus}
        pageCount={searchResults?.nbPages || 1}
        pageSize={searchResults?.hitsPerPage || 0}
        selectedFlatRows={selectedCourses}
        initialTableOptions={{
          getRowId: (row) => row.key,
        }}
      >
        <DataTable.TableControlBar />
        <DataTable.Table />
        <DataTable.TableFooter>
          <DataTable.RowStatus />
          <SearchPagination defaultRefinement={page} />
        </DataTable.TableFooter>
      </DataTable>
    </>
  );
};

BaseCourseSearchResults.defaultProps = {
  searchResults: { nbHits: 0, hits: [] },
  error: null,
};

BaseCourseSearchResults.propTypes = {
  intl: intlShape.isRequired,
  // from Algolia
  searchResults: PropTypes.shape({
    nbHits: PropTypes.number,
    hits: PropTypes.arrayOf(PropTypes.shape({})),
    nbPages: PropTypes.number,
    hitsPerPage: PropTypes.number,
    page: PropTypes.number,
  }),
  isSearchStalled: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  searchState: PropTypes.shape({
    page: PropTypes.number,
  }).isRequired,
  // from parent
  enterpriseSlug: PropTypes.string.isRequired,
};

export default connectStateResults(injectIntl(BaseCourseSearchResults));
