// TODO: Lang support
import React, { useContext, useState } from 'react';
import { StatefulButton } from '@edx/paragon';
import { faCheck, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logError } from '@edx/frontend-platform/logging';
import { saveAs } from 'file-saver';
import { SubscriptionDetailContext } from '../SubscriptionDetailContextProvider';
import LicenseManagerApiService from '../../../data/services/LicenseManagerAPIService';

const DownloadCsvButton = () => {
  const { subscription } = useContext(SubscriptionDetailContext);
  const [buttonState, setButtonState] = useState('default');

  const getCsvFileName = () => {
    const titleNoWhitespace = subscription.title.replace(/\s+/g, '');
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1;
    const day = currentDate.getUTCDate();
    return `${titleNoWhitespace}-${year}-${month}-${day}.csv`;
  };

  const handleClick = () => {
    setButtonState('pending');
    LicenseManagerApiService.fetchSubscriptionLicenseDataCsv(subscription.uuid)
      .then(response => {
        // download CSV
        const blob = new Blob([response.data], {
          type: 'text/csv',
        });
        saveAs(blob, getCsvFileName());
        setButtonState('complete');
      })
      .catch(err => {
        setButtonState('default');
        logError(err);
        // TODO: what should the UX be for error here?
      });
  };

  return (
    <StatefulButton
      state={buttonState}
      variant="outline-primary"
      labels={{
        default: 'Скачать CSV',
        pending: 'Скачивание',
        complete: 'Скачано',
      }}
      icons={{
        default: <FontAwesomeIcon icon={faDownload} />,
        pending: <FontAwesomeIcon icon={faSpinner} />,
        complete: <FontAwesomeIcon icon={faCheck} />,
      }}
      disabledStates={['pending']}
      onClick={handleClick}
    />
  );
};

export default DownloadCsvButton;
