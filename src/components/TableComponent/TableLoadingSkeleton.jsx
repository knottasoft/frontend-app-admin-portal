// TODO: Lang support
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const TableLoadingSkeleton = (props) => (
  <div {...props}>
    <div className="sr-only">Загрузка...</div>
    <Skeleton height={25} count={25} />
  </div>
);

export default TableLoadingSkeleton;
