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
  checked,
  instructionText,
}) => {
  const renderErrorBox = () => (
     errorState && errorState[fieldName] ?
      <div className="nypl-field-status">{errorState[fieldName]}</div> : null
  );
  const requiredMarkup = isRequired ? <span className="nypl-required-field"> Required</span> : null;
  const errorClass = errorState && errorState[fieldName] ? 'nypl-field-error' : '';
  
  const renderInstructionText = (text) => {
    if (!text) {
      return null;
    }

    return <span>{text}</span>;
  };

  const checkPh = (ph) ? (ph) : null;

  return (
    <div className={`${className} ${errorClass}`}>
      <label htmlFor={id}>
        {
          type === 'checkbox' ?
            <span className={"visuallyHidden"}>{label}</span> :
            <span>{label}</span>
        }
        {requiredMarkup}
      </label>
      <input
        value={value}
        placeholder={checkPh}
        type={type}
        id={id}
        required={isRequired}
        aria-required={ type === 'checkbox' ? null : isRequired }
        onChange={handleOnChange}
        checked={checked}
      />
      {renderInstructionText(instructionText)}
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
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]) ,
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
