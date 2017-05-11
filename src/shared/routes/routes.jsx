import React from 'react';
import { Route } from 'react-router';
import ApplicationContainer from './../components/Application/ApplicationContainer';
import BarcodeContainer from './../components/BarcodeContainer/BarcodeContainer';

export default (
  <Route path="/library-card/new" component={ApplicationContainer} >
    <Route path="/library-card/new/barcode" component={BarcodeContainer} />
  </Route>
);
