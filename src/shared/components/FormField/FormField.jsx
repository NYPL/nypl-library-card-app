import React from 'react';

const FormField = ({
  id,
  className,
  value,
  ph,
  label,
  type,
  fieldName,
  isRequired,
  errorState,
  handleOnChange,
}) => {
  const renderErrorBox = () => (
    isRequired && errorState && errorState[fieldName] ?
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
        placeholder={ph}
        type={type}
        id={id}
        required={isRequired}
        aria-required={isRequired}
        onChange={handleOnChange}
      />
      {renderErrorBox()}
    </div>
  );
};

FormField.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  errorState: React.PropTypes.object,
  value: React.PropTypes.string,
  className: React.PropTypes.string,
  ph: React.PropTypes.string,
  isRequired: React.PropTypes.bool,
  handleOnChange: React.PropTypes.func,
};

FormField.defaultProps = {
  className: '',
  value: '',
  ph: '',
  isRequired: false,
  errorState: {},
};
export default FormField;
