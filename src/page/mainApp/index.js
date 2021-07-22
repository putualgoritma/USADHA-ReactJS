import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Register from '../register'
import Agen from '../agen'
import Cart from '../cart'
import Checkout from '../checkout'
import Home from '../home'
import Login from '../login'
import Product from '../product'
import Topup from '../topup'
import Transfer from '../transfer'
import Withdraw from '../withdraw'
import Profile from '../profile'
import Landing from '../../component/landingPage/index'
import HistoryPoint from '../historypoint'
import HistoryOrder from '../historyorder'
import HistoryOrderDetail from '../../component/historyOrderDetail'
import RegisterDownline from '../registerdownline'
const MainApp =()=> {
      return (
            <div className='main-app-wrapper'>
                  {/* <Header/> */}
                  <div className='content-wrapper'>
                        <Router>
                              <Switch>
                                    <Route path='/registerdownline'>
                                          <RegisterDownline/>
                                    </Route>
                                    <Route path='/historyorderdetail'>
                                          <HistoryOrderDetail/>
                                    </Route>
                                    <Route path='/historyorder'>
                                          <HistoryOrder/>
                                    </Route>
                                    <Route path='/historypoint'>
                                          <HistoryPoint/>
                                    </Route>
                                    <Route path='/profile'>
                                          <Profile/>
                                    </Route>
                                    <Route path='/withdraw'>
                                          <Withdraw/>
                                    </Route>
                                    <Route path='/checkout/:id'>
                                          <Checkout/>
                                    </Route>
                                    <Route path='/agen'>
                                          <Agen/>
                                    </Route>
                                    <Route path='/cart'>
                                          <Cart/>
                                    </Route>
                                    <Route path='/transfer'>
                                          <Transfer/>
                                    </Route>
                                    <Route path='/topup'>
                                          <Topup/>
                                    </Route>
                                    <Route path='/landing/:info/:route'>
                                          <Landing/>
                                    </Route>
                                    <Route path='/product/:id'>
                                          <Product/>
                                    </Route>
                                    <Route path='/login'>
                                          <Login/>
                                    </Route>
                                    <Route path='/register'>
                                          <Register/>
                                    </Route>
                                    <Route path='/home'>
                                          <Home/>
                                    </Route>
                                    <Route path='/'>
                                          <Home/>
                                    </Route>
                              </Switch>
                        </Router>
                  </div>
                  {/* <Footer/> */}
            </div>
      )
}

export default MainApp
