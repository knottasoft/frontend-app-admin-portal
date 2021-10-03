// TODO: Lang support
import React from 'react';
import Helmet from 'react-helmet';
import { MailtoLink } from '@edx/paragon';

const ForbiddenPage = () => (
  <main role="main">
    <div className="container-fluid mt-3">
      <Helmet>
        <title>Доступ запрещен</title>
      </Helmet>
      <div className="text-center py-5">
        <h1>403</h1>
        <p className="lead">У вас нет доступа к этой странице.</p>
        <p>
          Для получения помощи, пожалуйста, свяжитесь с командой поддержки по адресу
          {' '}
          <MailtoLink to="customersuccess@edx.org">support@copp26.ru</MailtoLink>.
        </p>
      </div>
    </div>
  </main>
);

export default ForbiddenPage;
