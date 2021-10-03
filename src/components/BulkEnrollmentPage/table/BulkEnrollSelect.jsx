import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import { CheckboxControl } from '@edx/paragon';
import { checkForSelectedRows } from './helpers';

import {
  addSelectedRowAction, clearSelectionAction, deleteSelectedRowAction, setSelectedRowsAction,
} from '../data/actions';
import { BulkEnrollContext } from '../BulkEnrollmentContext';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollmentTable.messages';

export const SELECT_ONE_TEST_ID = 'selectOne';
export const SELECT_ALL_TEST_ID = 'selectAll';

export const BaseSelectWithContext = injectIntl(({ row, contextKey, intl }) => {
  const { [contextKey]: [selectedRows, dispatch] } = useContext(BulkEnrollContext);
  const isSelected = useMemo(() => selectedRows.some((selection) => selection.id === row.id), [selectedRows]);

  const toggleSelected = isSelected
    ? () => { dispatch(deleteSelectedRowAction(row.id)); }
    : () => { dispatch(addSelectedRowAction(row)); };

  return (
    <div>
      {/* eslint-disable-next-line react/prop-types */}
      <CheckboxControl
        style={{ cursor: 'pointer' }}
        title={intl.formatMessage(messages['bulk.table.select.checkbox'])}
        checked={isSelected}
        onChange={toggleSelected}
        isIndeterminate={false}
        data-testid={SELECT_ONE_TEST_ID}
      />
    </div>
  );
});

BaseSelectWithContext.propTypes = {
  intl: intlShape.isRequired,
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  /* The key to get the required data from BulkEnrollContext */
  contextKey: PropTypes.string.isRequired,
};

export const BaseSelectWithContextHeader = injectIntl(({
  rows, contextKey, intl
}) => {
  const { [contextKey]: [selectedRows, dispatch] } = useContext(BulkEnrollContext);
  const selectedRowIds = selectedRows.map(row => row.id);
  const isAllRowsSelected = checkForSelectedRows(selectedRows.map(row => row.id), rows);
  const anyRowsSelected = rows.some((row) => selectedRowIds.includes(row.id));
  const toggleAllRowsSelectedBulkEn = isAllRowsSelected
    ? () => dispatch(clearSelectionAction())
    : () => dispatch(setSelectedRowsAction(rows));

  return (
    <div>
      <CheckboxControl
        style={{ cursor: 'pointer' }}
        title={intl.formatMessage(messages['bulk.table.select.checkbox.all'])}
        checked={isAllRowsSelected}
        onChange={toggleAllRowsSelectedBulkEn}
        isIndeterminate={anyRowsSelected && !isAllRowsSelected}
        data-testid={SELECT_ALL_TEST_ID}
      />
    </div>
  );
});

BaseSelectWithContextHeader.propTypes = {
  intl: intlShape.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  /* The key to get the required data from BulkEnrollContext */
  contextKey: PropTypes.string.isRequired,
};
