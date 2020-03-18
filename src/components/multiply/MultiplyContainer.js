import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@tds/core-button';
import Heading from '@tds/core-heading';
import Spinner from '@tds/core-spinner';
import Box from '@tds/core-box';
import Input from '@tds/core-input';
import { useIntl, FormattedMessage } from 'react-intl';
import { isLoading } from 'selectors/multiplySelector';
import { multiplyNumbers } from 'actions/mathActions';
import useInputForm from 'hooks/useInputForm';

const Multiply = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const loading = useSelector(isLoading);

  const inputFields = {
    x: {
      value: '',
      error: '',
      required: true,
      type: 'integer',
    },
    y: {
      value: '',
      error: '',
      required: true,
      type: 'integer',
    },
  };
  const { input, handleChange, validateField, validateForm } = useInputForm(inputFields);

  const handleSubmit = event => {
    if (event) {
      event.preventDefault();
    }
    if (validateForm()) {
      dispatch(multiplyNumbers(input.x.value, input.y.value));
    }
  };

  console.log('Multiply RENDERED');

  return (
    <div>
      <Heading level="h2" tag="h3">
        <FormattedMessage id="multiply.starter_template" />
      </Heading>
      <br />
      <form onSubmit={handleSubmit}>
        <Box vertical={2}>
          <FormattedMessage id="multiply.enter_numbers" />
          <Input
            type="text"
            id="x"
            name="x"
            label={intl.formatMessage({ id: 'multiply.x' })}
            onChange={handleChange}
            value={input.x.value}
            error={input.x.error}
            onBlur={validateField}
          />
          <Input
            type="text"
            id="y"
            name="y"
            label={intl.formatMessage({ id: 'multiply.y' })}
            onChange={handleChange}
            value={input.y.value}
            error={input.y.error}
            onBlur={validateField}
          />
        </Box>
        <Spinner spinning={loading}>
          <Button id="multiplyButton" type="submit" className="btn btn-primary">
            {intl.formatMessage({ id: 'multiply.submit' })}
          </Button>
        </Spinner>
      </form>
    </div>
  );
};

export default Multiply;
