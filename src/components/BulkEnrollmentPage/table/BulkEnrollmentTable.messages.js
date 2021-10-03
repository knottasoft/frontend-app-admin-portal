import { defineMessages } from 'react-intl';

const messages = defineMessages({
  'bulk.table.selection.status.message': {
    id: 'bulk.table.selection.status.message',
    defaultMessage: '{isAllRowsSelected}{numSelectedRows} selected',
  },
  'bulk.table.selection.status.selected': {
    id: 'bulk.table.selection.status.selected',
    defaultMessage: 'Select {rowsCount}',
  },
  'bulk.table.selection.status.clear': {
    id: 'bulk.table.selection.status.clear',
    defaultMessage: 'Clear selection',
  },
  'bulk.table.select.checkbox': {
    id: 'bulk.table.select.checkbox',
    defaultMessage: 'Toggle row selected',
  },
  'bulk.table.select.checkbox.all': {
    id: 'bulk.table.select.checkbox.all',
    defaultMessage: 'Toggle all rows selected',
  },
});

export default messages;
