import React from 'react';
import { Delete } from '@edx/paragon/icons';
import {
  Card, IconButton, Icon,
} from '@edx/paragon';
import PropTypes from 'prop-types';

import { deleteSelectedRowAction } from '../data/actions';

const ReviewItem = ({ row, accessor, dispatch }) => {
  const onClick = () => {
    dispatch(deleteSelectedRowAction(row.id));
  };

  return (
    <li>
      <Card>
        <Card.Body>
          <Card.Text className="list-item">
            <span className="list-item-text">{row.values[accessor]}</span>
            <IconButton
              src={Delete}
              iconAs={Icon}
              style={{ cursor: 'pointer' }}
              data-testid="delete-button"
              alt="Remove selection"
              onClick={onClick}
            />
          </Card.Text>
        </Card.Body>
      </Card>
    </li>
  );
};

ReviewItem.propTypes = {
  /* Selected row from a DataTable instance */
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape({}).isRequired,
  }).isRequired,
  /* The accessor for the text that will be displayed for this row. Should be on the object row.values */
  accessor: PropTypes.string.isRequired,
  /* For dispatching actions on the rows. Will dispatch the deleteSelectedRowAction */
  dispatch: PropTypes.func.isRequired,
};

export default ReviewItem;
