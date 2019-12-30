import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Footer from '../components/Footer';
import Header from '../components/Header';

const LoadablePage = page => loadable(() => import(`${page}`));

const App = () => (
  <React.Fragment>
    <div className="content">
      <Header />
      <Switch>
        <Route
          exact
          path={`${process.env.SUBDIRECTORY}`}
          component={LoadablePage('./HomePage')}
        />
        <Route
          path={`${process.env.SUBDIRECTORY}/prices`}
          component={LoadablePage('./PricesPage')}
        />
        <Route
          path={`${process.env.SUBDIRECTORY}/stocks/:symbol`}
          component={LoadablePage('./StockPage')}
        />
        <Route component={LoadablePage('./NotFoundPage')} />
      </Switch>
    </div>
    <Footer />
  </React.Fragment>
);

export default App;
