import React from 'react';

const ErrorBox = ({ msg, className }) => (
  <div className={className}>
    <h2>{msg}</h2>
  </div>
);

ErrorBox.propTypes = {
  className: React.PropTypes.string,
  msg: React.PropTypes.string.isRequired,
};

ErrorBox.defaultProps = {
  className: 'errorBox',
};

export default ErrorBox;
