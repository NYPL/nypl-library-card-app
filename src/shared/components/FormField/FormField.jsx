import React from 'react';

const FormField = ({
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
  instructionText,
  maxLength,
  onBlur = () => {},
}) => {
  const requiredMarkup = isRequired ? <span className="nypl-required-field"> Required</span> : null;
  const renderInstructionText = (text) => {
    if (!text) {
      return null;
    }

    return (
      <span
        className="nypl-field-status"
        id={`${id}-status`}
        aria-live="assertive"
        aria-atomic="true"
      >
        {text}
      </span>
    );
  };
  const renderErrorBox = () => (
    <div className="nypl-field-status">{errorState[fieldName]}</div>
  );

  let underInputSuggestion = renderInstructionText(instructionText);
  let errorClass = '';

  if (errorState && errorState[fieldName]) {
    errorClass = 'nypl-field-error';
    underInputSuggestion = renderErrorBox();
  }

  return (
    <div className={`${className} ${errorClass}`}>
      <label htmlFor={id} id={`${id}-label`}>
        {
          type === 'checkbox' ?
            <span className={"visuallyHidden"}>{label}</span> :
            <span>{label}</span>
        }
        {requiredMarkup}
      </label>
      <input
        value={value}
        type={type}
        id={id}
        aria-required={type === 'checkbox' ? null : isRequired}
        aria-labelledby={(instructionText) ? `${id}-label ${id}-status` : null}
        onChange={handleOnChange}
        checked={checked}
        maxLength={maxLength || null}
        onBlur={onBlur}
      />
      {underInputSuggestion}
    </div>
  );
};

FormField.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  errorState: React.PropTypes.object,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  className: React.PropTypes.string,
  isRequired: React.PropTypes.bool,
  handleOnChange: React.PropTypes.func,
  checked: React.PropTypes.bool,
  instructionText: React.PropTypes.string,
  maxLength: React.PropTypes.number,
  onBlur: React.PropTypes.func,
};

FormField.defaultProps = {
  className: '',
  value: '',
  isRequired: false,
  errorState: {},
};
export default FormField;
