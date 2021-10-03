import React from 'react';
import PropTypes from 'prop-types';

import NumberCard from '../NumberCard';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './Admin.messages.js';

class AdminCards extends React.Component {
  constructor(props) {
    super(props);

    const {intl} = this.props;

    this.cards = {
      numberOfUsers: {
        ref: React.createRef(),
        description: intl.formatMessage(messages['admin.cards.numberOfUsers.description']),
        iconClassName: 'fa fa-users',
        actions: [{
          label: intl.formatMessage(messages['admin.cards.numberOfUsers.action.label']),
          slug: 'registered-unenrolled-learners',
        }],
      },
      enrolledLearners: {
        ref: React.createRef(),
        description: intl.formatMessage(messages['admin.cards.enrolledLearners.description']),
        iconClassName: 'fa fa-check',
        actions: [{
          label: intl.formatMessage(messages['admin.cards.enrolledLearners.action1.label']),
          slug: 'enrolled-learners',
        }, {
          label: this.props.intl.formatMessage(messages['admin.cards.enrolledLearners.action2.label']),
          slug: 'enrolled-learners-inactive-courses',
        }],
      },
      activeLearners: {
        ref: React.createRef(),
        description: intl.formatMessage(messages['admin.cards.activeLearners.description']),
        iconClassName: 'fa fa-eye',
        actions: [{
          label: intl.formatMessage(messages['admin.cards.activeLearners.action1.label']),
          slug: 'learners-active-week',
        }, {
          label: intl.formatMessage(messages['admin.cards.activeLearners.action2.label']),
          slug: 'learners-inactive-week',
        }, {
          label: intl.formatMessage(messages['admin.cards.activeLearners.action3.label']),
          slug: 'learners-inactive-month',
        }],
      },
      courseCompletions: {
        ref: React.createRef(),
        description: intl.formatMessage(messages['admin.cards.courseCompletions.description']),
        iconClassName: 'fa fa-trophy',
        actions: [{
          label: intl.formatMessage(messages['admin.cards.courseCompletions.action1.label']),
          slug: 'completed-learners',
        }, {
          label: intl.formatMessage(messages['admin.cards.courseCompletions.action2.label']),
          slug: 'completed-learners-week',
        }],
      },
    };
  }

  renderCard({ title, cardKey }) {
    const card = this.cards[cardKey];

    return (
      <div
        className="col-xs-12 col-md-6 col-xl-3 mb-3 d-flex"
        key={cardKey}
      >
        <NumberCard
          id={cardKey}
          title={title}
          description={card.description}
          iconClassName={card.iconClassName}
          detailActions={card.actions}
        />
      </div>
    );
  }

  render() {
    const {
      activeLearners,
      numberOfUsers,
      courseCompletions,
      enrolledLearners,
    } = this.props;

    const data = {
      activeLearners: activeLearners.past_week,
      numberOfUsers,
      courseCompletions,
      enrolledLearners,
    };

    return Object.keys(this.cards).map(cardKey => (
      this.renderCard({
        title: data[cardKey],
        cardKey,
      })
    ));
  }
}

AdminCards.propTypes = {
  intl: intlShape.isRequired,
  activeLearners: PropTypes.shape({
    past_week: PropTypes.number.isRequired,
    past_month: PropTypes.number.isRequired,
  }).isRequired,
  numberOfUsers: PropTypes.number.isRequired,
  courseCompletions: PropTypes.number.isRequired,
  enrolledLearners: PropTypes.number.isRequired,
};

export default injectIntl(AdminCards);
