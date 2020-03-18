import React from 'react';
import { useSelector } from 'react-redux';
import Text from '@tds/core-text';
import { FormattedMessage } from 'react-intl';
import { getResponse } from 'selectors/multiplySelector';

const MultiplyResults = () => {
  const response = useSelector(getResponse);
  return (
    <div>
      {response && (
        <div id="submitResultsNumberInfo">
          <Text bold>
            <FormattedMessage id="multiply.result" />
          </Text>
          {response && <span id="multiplyResults">{response.result}</span>}
        </div>
      )}
    </div>
  );
};

export default MultiplyResults;
