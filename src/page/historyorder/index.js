import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, withRouter } from 'react-router'
import {Header, Footer, Spinner} from '../../component'
import { Rupiah } from '../../helper/Rupiah'
import API from '../../services'
import { Source } from '../../services/Config'

const OrderItem =(props) => {
      const [color, setColor] = useState('#ffffff')
      const history = useHistory()
      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  if(props.status == 'closed'){
                        setColor('#c8c5c5')
                  }else if (props.status == 'pending'){
                        setColor('#FFCCCB')
                  }else if(props.status == 'approved' && props.status_delivery =='process'){
                        setColor('#FFFFCD')
                  }else if (props.status == 'approved' && props.status_delivery =='delivered'){
                        setColor('#CDFFCC')
                  }else if (props.status == 'approved' && props.status_delivery == 'received'){
                        setColor('#00FFFF')
                  }
            }
            return () => {
                  Source.cancel('cancel api')
                  isAmounted = true;
            }
      }, [])

      const handleOrder = async (data) => {   
            let setData =  await  sessionStorage.setItem('HISTORY', JSON.stringify(data));
            history.push('/historyorderdetail')
      }
      return (
            <div className='col-md-8 item-point m-0 p-0' style={{backgroundColor:color}} onClick ={() => handleOrder(props.data)}>
                  <div className='d-block date p-2'>{props.register}</div>
                  <div className='d-block p-2 memo '>{props.memo}</div>
                  <div className='d-flex justify-content-between p-2'>
                        <span>{props.customers}</span>
                        <span>{Rupiah(props.amount)}</span>
                  </div>
            </div>
      )
}


function HistoryOrder() {
      const history = useHistory()
      const [USER, setUSER] = useState(null)
      const [TOKEN, setTOKEN] = useState(null)
      const [loading, setLoading] = useState(true)
      const [orderHistory, setOrderHistory] = useState(null)

      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN()]).then((res) => {
                        let userData = res[0];
                        let tokenData = res[1];
                        if(userData !== null && tokenData !==null){
                              Promise.all([API.historyorder(userData.id, tokenData)]) 
                              .then((result) => { 
                                    console.log('order', result);
                                    setOrderHistory(result[0].data)
                                    setLoading(false) 
                              }).catch((e) => {
                                    console.log(e.request);
                                    setLoading(false)
                              })
                        }else{
                              alert('mohon login terlebih dahulu')
                              history.push('/login')
                        }
                  });
           }
            return () => {
                  Source.cancel('cancel api')
                  isAmounted = true;
            }
      }, [])

      const getUSER =  () => {
            let data =  sessionStorage.getItem('USER')
            data = JSON.parse(data)
            setUSER( data)
            return data;
            
      }
      const getTOKEN =  () => {
            let data =  sessionStorage.getItem('TOKEN')
            data = JSON.parse(data)
            setTOKEN( data)
            return data;
            
      }

        if(loading){
            return (
                  <Spinner/>
            )
      }
      
      return (
            <Fragment>
                  <Header/>
                  <section className='section-topup mb-4'>
                        <div className='wrapper-history-order container'>
                              <div className= 'text-center'>
                                    <h2>History Orders</h2>
                                    <hr className='hr-global'/>
                              </div>
                              <div className='row justify-content-center'>
                                    {orderHistory && orderHistory.map((item, index) => {
                                          return (
                                                <OrderItem 
                                                      key ={index}
                                                      register ={item.register}
                                                      memo = {item.memo}
                                                      customers ={item.customers.name}
                                                      status_delivery ={item.status_delivery}
                                                      amount = {parseInt(item.total)}
                                                      status = {item.status}
                                                      status_delivery ={item.status_delivery}
                                                      data = {item}
                                                />
                                          )
                                    })}
                              </div>
                        </div>
                  </section>
                  <Footer/>
            </Fragment>
      )
}

export default withRouter(HistoryOrder)
