import React, { Component} from 'react'
import {
      BrowserRouter as Router,
      Route,
      Switch,
    } from "react-router-dom";
import { Spinner } from '../../component';
import { Login, Register, MainApp } from '../../page';

class Routes extends Component {
      render() {
            return (
                  <Router>
                        <Switch>
                              {/* <Route path='/login'>
                                    <Login/>
                              </Route>
                              <Route path='/register'>
                                    <Register/>
                              </Route> */}
                              <Route path='/spinner'>
                                    <Spinner/>
                              </Route>
                              <Route path='/'>
                                    <MainApp/>
                              </Route>
                        </Switch>
                  </Router>
            )
      }
}

export default Routes
