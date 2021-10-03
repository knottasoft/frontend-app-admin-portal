import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, DataTableContext } from '@edx/paragon';
import { checkForSelectedRows } from './helpers';

import {
  clearSelectionAction,
  setSelectedRowsAction,
} from '../data/actions';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollmentTable.messages';

// This selection status component uses the BulkEnrollContext to show selection status rather than the data table state.
const BaseSelectionStatus = ({
  intl,
  className,
  selectedRows,
  dispatch,
}) => {
  const {
    itemCount, rows,
  } = useContext(DataTableContext);
  const isAllRowsSelected = selectedRows.length === itemCount;
  const selectedRowIds = selectedRows.map((row) => row.id);
  const areAllDisplayedRowsSelected = checkForSelectedRows(selectedRowIds, rows);

  const numSelectedRows = selectedRows.length;

  return (
    <div className={className}>

      <span>{ intl.formatMessage(messages['bulk.table.selection.status.message'],
            { isAllRowsSelected: isAllRowsSelected ? 'All ' : '', numSelectedRows: numSelectedRows }) }
      </span>
      {/*<span>{isAllRowsSelected && 'All '}{numSelectedRows} selected </span>*/}
      {!areAllDisplayedRowsSelected && (
        <Button
          variant="link"
          size="inline"
          onClick={() => { dispatch(setSelectedRowsAction(rows)); }}
        >
          { intl.formatMessage(messages['bulk.table.selection.status.selected'], {rowsCount:rows.length} )}
        </Button>
      )}
      {numSelectedRows > 0 && (
        <Button
          variant="link"
          size="inline"
          onClick={() => { dispatch(clearSelectionAction()); }}
        >
          {intl.formatMessage(messages['bulk.table.selection.status.clear'])}
        </Button>
      )}
    </div>
  );
};

BaseSelectionStatus.defaultProps = {
  className: undefined,
};

BaseSelectionStatus.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string,
  selectedRows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(BaseSelectionStatus);
