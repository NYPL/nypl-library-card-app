import React from 'react';

const CheckBox = ({
  id,
  className,
  value,
  label,
  type,
  fieldName,
  isRequired,
  errorState,
  handleOnChange,
  checked,
  checkboxText
}) => {
  const renderErrorBox = () => (
    errorState && errorState[fieldName] ?
      <div className="nypl-field-status">{errorState[fieldName]}</div> : null
  );

  const requiredMarkup = isRequired ? <span className="nypl-required-field"> Required</span> : null;
  const errorClass = errorState && errorState[fieldName] ? 'nypl-field-error' : '';
  return (
    <div className={`${className} ${errorClass}`}>
      <label htmlFor={id}>
        <span>{label}</span>
        {requiredMarkup}
      </label>
      <input
        value={value}
        type={type}
        id={id}
        required={isRequired}
        onChange={handleOnChange}
        checked={checked}
      />
      {checkboxText}
      {renderErrorBox()}
    </div>
  );
};

CheckBox.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  errorState: React.PropTypes.object,
  value: React.PropTypes.booleanValue,
  className: React.PropTypes.string,
  isRequired: React.PropTypes.bool,
  handleOnChange: React.PropTypes.func,
};

CheckBox.defaultProps = {
  className: '',
  value: '',
  ph: '',
  isRequired: false,
  errorState: {},
};
export default CheckBox;
