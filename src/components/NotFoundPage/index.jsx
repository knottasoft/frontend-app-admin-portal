// TODO: Lang support
import React from 'react';
import Helmet from 'react-helmet';

const NotFoundPage = () => (
  <main role="main">
    <div className="container-fluid mt-3">
      <NotFound />
    </div>
  </main>
);

export const NotFound = () => (
  <>
    <Helmet>
      <title>Страница не найдена</title>
    </Helmet>
    <div className="text-center py-5">
      <h1>404</h1>
      <p className="lead">Ой, извините, мы не можем найти эту страницу!</p>
      <p>Либо что-то пошло не так, либо страница больше не существует.</p>
    </div>
  </>
);

export default NotFoundPage;
