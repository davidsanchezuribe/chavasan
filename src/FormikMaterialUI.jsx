import React from 'react';
import PropTypes from 'prop-types';

import {
  FormControl, InputLabel, OutlinedInput,
  FormHelperText, InputAdornment, FormControlLabel,
  Checkbox, RadioGroup, Radio, FormLabel, Switch,
} from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

export function InputTextFMUI({ ...props }) {
  const {
    name, labelFMUI, type, disabled,
  } = props;
  const [field, meta] = useField(props);
  let error = '';
  if (meta.error !== undefined && meta.touched) {
    error = meta.error;
  }
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel error={error !== ''} htmlFor={`id${name}`}>
        {labelFMUI}
      </InputLabel>
      <OutlinedInput
        error={error !== ''}
        {...field}
        id={`id${name}`}
        label={labelFMUI}
        type={type}
        endAdornment={<InputAdornment position="end">*</InputAdornment>}
        disabled={disabled}
      />
      <FormHelperText error id={`id${name}`}>
        {error}
      </FormHelperText>
    </FormControl>
  );
}

InputTextFMUI.propTypes = {
  name: PropTypes.string.isRequired,
  labelFMUI: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

InputTextFMUI.defaultProps = {
  type: 'text',
  disabled: false,
};

export function CheckBoxFMUI({ ...props }) {
  const { labelFMUI } = props;
  const [field] = useField(props);
  return (
    <FormControlLabel
      control={(
        <Checkbox
          {...field}
          checked={field.value}
          color="primary"
        />
        )}
      label={labelFMUI}
    />
  );
}

CheckBoxFMUI.propTypes = {
  name: PropTypes.string.isRequired,
  labelFMUI: PropTypes.string.isRequired,
};

export function SwitchFMUI({ ...props }) {
  const { labelFMUI, disabled } = props;
  const [field] = useField(props);
  return (
    <FormControlLabel
      control={(
        <Switch
          {...field}
          checked={field.value}
          color="primary"
          disabled={disabled}
        />
        )}
      label={<span style={{ fontSize: 24 }}>{labelFMUI}</span>}
      labelPlacement="bottom"
    />
  );
}

SwitchFMUI.propTypes = {
  name: PropTypes.string.isRequired,
  labelFMUI: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

SwitchFMUI.defaultProps = {
  disabled: false,
};

export function RadioGroupFMUI({ ...props }) {
  const { setFieldValue } = useFormikContext();
  const { maxValue, labelFMUI } = props;
  const [field] = useField(props);

  const radioList = [];
  for (let i = 1; i <= maxValue; i += 1) {
    radioList.push(<FormControlLabel
      key={`r${i}`}
      value={i}
      label={i}
      control={<Radio color="primary" />}
      labelPlacement="end"
    />);
  }
  /*

*/
  return (
    <FormControl>
      <FormLabel>
        {labelFMUI}
      </FormLabel>
      <RadioGroup
        {...field}
        onChange={(event) => setFieldValue(field.name,
          Number(event.target.value))}
        row
      >
        {radioList}
      </RadioGroup>
    </FormControl>
  );
}

RadioGroupFMUI.propTypes = {
  name: PropTypes.string.isRequired,
  labelFMUI: PropTypes.string.isRequired,
  maxValue: PropTypes.number.isRequired,
};
