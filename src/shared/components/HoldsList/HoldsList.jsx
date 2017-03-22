import React from 'react';
import ErrorBox from '../ErrorBox/ErrorBox';
// Importing functions only, reduces codebase
// See: http://stackoverflow.com/questions/35250500/correct-way-to-import-lodash
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import moment from 'moment';

const HoldsList = ({
  className,
  id,
  holds,
}) => {
  const renderTableField = (str, type) => {
    let output = 'N/A';
    if (!isString(str) || isEmpty(str.trim())) {
      return output;
    }

    switch (type) {
      case 'date':
        output = moment(str).format('MMM D, YYYY');
        break;
      case 'status':
        output = str.replace(/\./g, '').toLowerCase();
        break;
      case 'status-code':
        output = str.replace(/\./g, '').replace(/\s+/g, '-').toLowerCase();
        break;
      default:
        output = str;
    }

    return output;
  };

  const renderTableHeadings = () => (
    <thead>
      <tr>
        <th scope="col" title="Date Requested">Date Requested</th>
        <th scope="col" title="Item Information">Item</th>
        <th scope="col" title="Location">Location</th>
        <th scope="col" title="Status">Status</th>
        <th scope="col" title="Estimated Time of Arrival">ETA</th>
        <th></th>
      </tr>
    </thead>
  );

  const renderHoldItems = (list) => {
    const items = map(list, (item, index) => {
      const baseClass = 'item';
      return (
        <tr className={`{$baseClass}-${index + 1} ${className}-row ${baseClass}`} key={index}>
          <td className="requestDate">
            {renderTableField(item.placed, 'date')}
          </td>
          <td className="info">
            {renderTableField(item.record)}
          </td>
          <td className="location">
            {renderTableField(item.pickupLocation.name)}
          </td>
          <td className={`status ${renderTableField(item.status.name, 'status-code')}`}>
            {renderTableField(item.status.name, 'status')}
          </td>
          <td className="eta">
            {renderTableField(item.estimatedReadyDate, 'date')}
          </td>
          <td className="viewHoldLink">
            <a href="#">View or manage hold</a>
          </td>
        </tr>
      );
    });

    return <tbody>{items}</tbody>;
  };

  const renderHoldsTable = (list) => {
    if (!isArray(list) || isEmpty(list)) {
      return <ErrorBox msg="No records found." />;
    }

    return (
      <section className={className} id={id}>
        <table
          className={`${className}-table responsiveTable`}
          summary="A list of all your holds"
        >
          {renderTableHeadings()}
          {renderHoldItems(list)}
        </table>
      </section>
    );
  };

  return renderHoldsTable(holds);
};

HoldsList.propTypes = {
  className: React.PropTypes.string,
  id: React.PropTypes.string,
  holds: React.PropTypes.array,
};

HoldsList.defaultProps = {
  className: 'holdsList',
};

export default HoldsList;
