import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GuestArrived from './GuestArrived'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

const IndexComponent = () => (
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/guest-arrived" component={GuestArrived}/>
    </div>
  </Router>
)

ReactDOM.render(
  <IndexComponent />,
  document.getElementById('root')
);
