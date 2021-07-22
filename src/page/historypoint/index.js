import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Footer, Header, Spinner } from '../../component'
import { Rupiah } from '../../helper/Rupiah'
import API from '../../services'
import { Source } from '../../services/Config'

const ItemHistoryPoint = (props) => {
      const history = useHistory();

      return (
            <div className='col-md-8 item-point my-2 m-0 p-0'>
                  <div className='d-block date p-2'>{props.register}</div>
                  <div className='d-block p-2 memo'>{props.memo}</div>
                  <div className='d-flex justify-content-between p-2' style={{color : props.type ==='C' ? 'red' : 'green'}}>
                        <span>{props.type ==='C' ? 'Kredit' : 'Debet'}</span>
                        <span>{Rupiah(props.amount)}</span>
                  </div>
            </div>
      )
}

function HistoryPoint() {
      const history = useHistory()
      const [USER, setUSER] = useState(null)
      const [TOKEN, setTOKEN] = useState(null)
      const [loading, setLoading] = useState(true)
      const [pointHistory, setPointHistory] = useState(null)
      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN()]).then((res) => {
                        let userData = res[0];
                        let tokenData = res[1];
                        if(userData !== null && tokenData !==null){
                              Promise.all([API.historypoint(userData.id, tokenData)]) 
                              .then((result) => { 
                                    console.log(result);
                                    setPointHistory(result[0].data)
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
                        <div className='wrapper-history-point container'>
                              <div className='text-center'>
                                    <h2>History Point</h2>
                                    <hr className='hr-global'/>
                              </div>
                              <div className='row justify-content-center'>
                                    {pointHistory && pointHistory.map((item, index) => {
                                          return (
                                                <ItemHistoryPoint
                                                      key = {index}
                                                      register = {item.orders.register}
                                                      memo = {item.memo}
                                                      type = {item.type}
                                                      amount = {parseInt(item.amount)}
                                                      order = {item.orders}
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

export default HistoryPoint
