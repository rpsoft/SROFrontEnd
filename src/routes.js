import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'

/**
 * React-router components.
 *
 * React router help to render component related to the path or url.
 *
 * Please have a look to:
 * https://github.com/reactjs/react-router
 *
 */

// Please add new core components to /components/index.js

import {
  // Core components
  AppContainer,
  BrowseRecords,
  RecordView,
  RecordContainer,
} from './components/'

import App from './App'

import {
  URL_BASE,
} from './links'

const urlBase = URL_BASE

var routes = (history) => (
  <Router history={history}>
    <Route path={"/"} component={AppContainer} >
      <IndexRoute component={BrowseRecords} />

      <Route path="browser" component={BrowseRecords} />
{/*
      <Route path="categories" component={CategoriesContainer} >
        <Route path={urlBase + "categories/list/:categoryId"} component={CategoriesView} />
        <Route path={urlBase + "categories/list/:categoryId/:subcategoryId"} component={CategoriesView} />
      </Route>
 */}
      <Route path="records" component={RecordContainer} >
        {/* <Route path={urlBase + "record/create"} component={RecordCreate} /> */}
        <Route path={urlBase + "record/:recordId(/:recordName)"} component={RecordView} />
      </Route>

    </Route>
  </Router>
)

export default routes
