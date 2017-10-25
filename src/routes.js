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
  StaticPage,
  BrowserContainer,
  Browse,
  BrowseNames,
  BrowseFilter,
  Search,
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
        <IndexRoute component={StaticPage} />

        <Route path="browser" component={BrowserContainer}>
          <Route path={urlBase + "browser"} component={Browse} ></Route>
          <Route path={urlBase + "browser/names(/:letter)"} component={BrowseNames} ></Route>
          <Route path={urlBase + "browser/date"} component={BrowseFilter} ></Route>
          <Route path={urlBase + "browser/volume"} component={BrowseFilter} ></Route>
          {/* <Route path={urlBase + "browser/names/:letter"} component={BrowseNames} ></Route> */}
          <Route path={urlBase + "browser/:page(/:pageLimit)"} component={Browse} ></Route>
          <Route path={urlBase + "browser/:page(/:pageLimit)(/:sortField)"} component={Browse} ></Route>
          <Route path={urlBase + "browser/:page(/:pageLimit)(/:sortField)(/:direction)"} component={Browse} ></Route>
        </Route>

        <Route path="search" component={BrowserContainer}>
          <IndexRoute component={Search} />
          <Route path={urlBase + "search"} component={Search} ></Route>
          <Route path={urlBase + "search(/:page)(/:pageLimit)"} component={Search} ></Route>
          <Route path={urlBase + "search(/:page)(/:pageLimit)(/:sortField)"} component={Search} ></Route>
          <Route path={urlBase + "search(/:page)(/:pageLimit)(/:sortField)(/:direction)"} component={Search} ></Route>
        </Route>

        <Route path="project" component={BrowserContainer}>
          <IndexRoute component={StaticPage} />
        </Route>

        <Route path="about" component={BrowserContainer}>
          <IndexRoute component={StaticPage} />
        </Route>

        <Route path="help" component={BrowserContainer}>
          <IndexRoute component={StaticPage} />
        </Route>

        <Route path="entry" component={BrowserContainer}>
          <Route path={urlBase + "entry/:entryID"} component={Entry} ></Route>
          {/* <IndexRoute component={Entry} /> */}
        </Route>

      </Route>
  </Router>
)

export default routes
