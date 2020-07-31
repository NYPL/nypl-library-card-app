import React from "react";
import { FormResults } from "../interfaces";

const Confirmation: React.FC<{ formResults: FormResults }> = ({
  formResults,
}) => {
  const { barcode, username, pin, temporary, patronId, message } = formResults;
  return (
    <div className="nypl-full-width-wrapper">
      <p className="name-message">Thank you for submitting your application.</p>
      <h2>What To Do Next</h2>
      <p>Information</p>
      <ul>
        <li>barcode: {barcode}</li>
        <li>username: {username}</li>
        <li>pin: {pin}</li>
        <li>temporary: {`${temporary}`}</li>
        <li>id: {patronId}</li>
        <li>message: {message}</li>
      </ul>
    </div>
  );
};

export default Confirmation;
