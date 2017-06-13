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
  Home,
  BrowserContainer,
  Browse,
  Search,
  // RecordView,
  // RecordContainer,
  Project,
  About,
  Entry,
} from './components/'

import App from './App'

import {
  URL_BASE,
} from './links'

const urlBase = URL_BASE

var routes = (history) => (
  <Router history={history}>

      <Route path={"/"} component={AppContainer} >
        <IndexRoute component={Home} />

        <Route path="browser" component={BrowserContainer}>
          <Route path={urlBase + "browser"} component={Browse} ></Route>
          <Route path={urlBase + "browser/:page(/:pageLimit)"} component={Browse} ></Route>
        </Route>

        <Route path="search" component={BrowserContainer}>
          <IndexRoute component={Search} />
          <Route path={urlBase + "search(/:query)(/:page)"} component={Search} ></Route>
          <Route path={urlBase + "search(/:query)(/:page)(/:pageLimit)"} component={Search} ></Route>
        </Route>

        <Route path="project" component={BrowserContainer}>
          <IndexRoute component={Project} />
        </Route>

        <Route path="about" component={BrowserContainer}>
          <IndexRoute component={About} />
        </Route>

        <Route path="entry" component={BrowserContainer}>
          <Route path={urlBase + "entry/:entryID"} component={Entry} ></Route>
          {/* <IndexRoute component={Entry} /> */}
        </Route>

      </Route>
  </Router>
)

export default routes
