import React from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import { SearchData, SearchHeader } from '@edx/frontend-enterprise-catalog-search';

import { configuration } from '../../../config';

import CourseSearchResults from '../CourseSearchResults';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './BulkEnrollmentStepper.messages';

const searchClient = algoliasearch(
  configuration.ALGOLIA.APP_ID,
  configuration.ALGOLIA.SEARCH_API_KEY,
);

const AddCoursesStep = ({
  enterpriseId, enterpriseSlug, subscription, intl
}) => (
  <>
    <p>{intl.formatMessage(messages['bulk.stepper.add-courses.description'])}</p>
    <h2>{intl.formatMessage(messages['bulk.stepper.add-courses.title'])}</h2>
    <SearchData>
      <InstantSearch
        indexName={configuration.ALGOLIA.INDEX_NAME}
        searchClient={searchClient}
      >
        <Configure
          filters={`enterprise_catalog_uuids:${subscription.enterpriseCatalogUuid}`}
          hitsPerPage={25}
        />
        <SearchHeader variant="default" />
        <CourseSearchResults
          enterpriseId={enterpriseId}
          enterpriseSlug={enterpriseSlug}
          subscriptionUUID={subscription.uuid}
        />
      </InstantSearch>
    </SearchData>
  </>
);

AddCoursesStep.propTypes = {
  intl: intlShape.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  enterpriseSlug: PropTypes.string.isRequired,
  subscription: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    enterpriseCatalogUuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default injectIntl(AddCoursesStep);
