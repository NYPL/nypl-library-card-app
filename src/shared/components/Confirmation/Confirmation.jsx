import React from 'react';

const Confirmation = ({ apiObject, className, name }) => {
  // TODO: Remove hard coding when API is ready. For demo only.
  apiObject = {};
  apiObject.response = {};
  apiObject.response.id = "245XXXX";

  const getIdText = () => (
    apiObject && apiObject.response && apiObject.response.id ?
      `Use your temporary ID, ${apiObject.response.id}, to place books and other materials 
      on hold. To pick up your materials,` :
      'To pick up your card,'
  );

  return (
    <div className={className}>
      <p className="name-message">{name}, thank you for submitting your application.</p>
      <h2>What To Do Next</h2>
      <p>{getIdText()} please bring valid identification to your local library.</p>
      <h3>Gather Your Identification</h3>
      <h4>Adults</h4>
      <p>Please use any one of the following:</p>
      <ul>
        <li>Current driver&apos;s license</li>
        <li>Current photo learner&apos;s permit</li>
        <li>Current non-driver&apos;s identification</li>
        <li>IDNYC</li>
      </ul>
      <a href="https://www.nypl.org/help/library-card/terms-conditions">Additional forms of ID</a>
      <h4>Young Adults (ages 13-17)</h4>
      <p>You can show the same ID as adults, or any one of the following, provided name and address are included:</p>
      <ul>
        <li>Current school photo ID</li>
        <li>Current report or program card</li>
        <li>Working papers</li>
      </ul>
      <a href="https://www.nypl.org/help/library-card/terms-conditions">Additional forms of ID</a>
      <h3>Get Your Card</h3>
      <h4>NYC Residents</h4>
      <p>
        Please bring address verification to pick up your card at a
        <a href="http://www.nypl.org/locations">library</a> near you. If you are an educator, please ask a librarian about special card privileges.
      </p>
      <h4>NY State Residents</h4>
      <p>
        Please allow up to one month for processing and delivery of your card by mail. Once you receive your card, e-mail your ID to <a href="mailto:patronaccounts@nypl.org">patronaccounts@nypl.org</a>, or fax it to (212) 621-0278.
      </p>
    </div>
  );
};

Confirmation.propTypes = {
  className: React.PropTypes.string,
  apiObject: React.PropTypes.object,
  name: React.PropTypes.string,
}

Confirmation.defaultProps = {
  className: 'nypl-full-width-wrapper',
};

export default Confirmation;
