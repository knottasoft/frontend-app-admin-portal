// TODO: Lang support
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@edx/paragon';

class DownloadCsvButton extends React.Component {
  componentWillUnmount() {
    this.props.clearCsv();
  }

  render() {
    const {
      fetchMethod,
      fetchCsv,
      csvLoading,
      disabled,
      buttonLabel,
    } = this.props;
    const downloadButtonIconClasses = csvLoading ? ['fa-spinner', 'fa-spin'] : ['fa-download'];
    return (
      <Button
        variant="outline-primary"
        className="download-btn d-sm-inline float-md-right"
        disabled={disabled || csvLoading}
        onClick={() => fetchCsv(fetchMethod)}
      >
        <>
          <Icon className={`fa mr-2 ${downloadButtonIconClasses.join(' ')}`} />
          {buttonLabel}
        </>
      </Button>
    );
  }
}

DownloadCsvButton.defaultProps = {
  csvLoading: false,
  fetchMethod: () => {},
  disabled: false,
  buttonLabel: 'Скачать полный отчет (CSV)',
};

DownloadCsvButton.propTypes = {
  fetchCsv: PropTypes.func.isRequired,
  fetchMethod: PropTypes.func,
  csvLoading: PropTypes.bool,
  clearCsv: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  buttonLabel: PropTypes.string,
};

export default DownloadCsvButton;
