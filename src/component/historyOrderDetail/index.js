import { Alert } from 'bootstrap';
import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, withRouter } from 'react-router';
import { Footer, Spinner } from '..';
import { listProduk } from '../../assets';
import { Rupiah } from '../../helper/Rupiah';
import API from '../../services';
import Header from '../header';


const ItemHistory =(props) => {
      return (
            <div>
                  <div className='d-flex flex flex-row '>  <div className='align-items-center w-100'>
                              <h5 className='header-cart-title'>Pesanan {props.pesanan }</h5>
                              <div className='d-flex flex flex-row '>
                              <img src={ (props.dataOrder.img === null ? listProduk : process.env.REACT_APP_BASE_URL +String(props.dataOrder.img).replace('public/', ''))}   className='img-cart mr-2' alt='img' />
                                    <div className='w-100'>
                                          <div className='d-flex h-100 flex flex-column justify-content-between' >
                                                <p className='font-weight-bold'>{props.dataOrder.name}</p>
                                                <div className='' >
                                                      <p>tgl : {props.data.register}</p>
                                                      <p>Agen : {props.data.agents.name}</p>
                                                      <p>Quantity : {props.dataOrder.pivot.quantity}</p>
                                                      <span className='font-weight-bold'>{Rupiah(parseInt(props.dataOrder.price * props.dataOrder.pivot.quantity))}</span>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <hr/>
            </div>
      )
}


function HistoryOrderDetail() {
      const history = useHistory()
      const [HISTORY, setHISTORY] = useState(null);
      const [TOKEN, setTOKEN] = useState(null);
      const [loading, setLoading ] = useState(true);
      var status = null
      var status_delivery = null

      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getTOKEN(),getHistory()]).then((res) => {
                        let tokenData = res[0]
                        let historyData = res[1]

                      if(tokenData !==null && historyData !== null ){
                        //     console.log(historyData);
                              status = historyData.status;
                              status_delivery = historyData.status_delivery;
                              setLoading(false)
                      }else{
                        alert('mohon login terlebih dahulu')
                        history.push('/login')
                      }
                  });
           }
            return () => {
                  isAmounted = true;
            }
      }, [])


      const handleBatal = () => {
            setLoading(true)
            API.historyordercancel(HISTORY.id, TOKEN).then((result) => {
                  // console.log(result);
                  history.push(`/landing/${result.message}/historyorder`)
            }).catch((e) => {
                  console.log(e.request);
                  alert('pesanan gagal di batalkan')
                  setLoading(false)
            })
      }

      const handleTerima = () => {
            setLoading(true)
            API.historyorderupdate(HISTORY.id, TOKEN).then((result) => {
                  // console.log(result);
                  history.push(`/landing/${result.message}/historyorder`)
            }).catch((e) => {
                  console.log(e.request);
                  alert('pesanan gagal di konfirmasi, coba ulang!')
                  setLoading(false)
            })
      }

      const getHistory = async () => {
            let data =  await sessionStorage.getItem('HISTORY')
            data = JSON.parse(data)
            setHISTORY(data)
            return data;
      }
      const getTOKEN =  async () => {
            let data =  await sessionStorage.getItem('TOKEN')
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
                        <section className='section-cart'>
                              <div className='wrapper-cart container col-12 m-0 row justify-content-center'>
                                          <div className='col-12 col-md-12'>
                                                <div className='box-cart-item col-12 p-0 align-content-center align-items-center'>
                                                            <h2 >Histor Order</h2>
                                                            <hr/>

                                                            {/* item */}
                                                            {HISTORY && HISTORY.products.map((item, index) => {
                                                                  return (
                                                                        <ItemHistory
                                                                              key ={index}
                                                                              dataOrder = {item}
                                                                              data = {HISTORY}
                                                                              pesanan = {index + 1}

                                                                        />
                                                                  )
                                                            })}
                                                            {/* batas item */}
                                                </div>
                                                <div className='text-center'>
                                                      {/* {HISTORY.status_delivery} */}
                                                      {HISTORY.status === 'pending' && 
                                                            <button className='text-center btn-history-detail'  style={{backgroundColor :'red'}} 
                                                                  onClick={() => {if(window.confirm('Batalkan Pesanan?')){handleBatal()}}}
                                                            >
                                                                  Batalkan Pesanan
                                                            </button>
                                                      }
                                                      {((History && (HISTORY.status_delivery==='process' && HISTORY.status==='approved') || (HISTORY.status_delivery==='received' && HISTORY.status==='approved')  || HISTORY.status === 'closed')) && 
                                                            <button className='text-center btn-history-detail' style={{backgroundColor :' #f5a52d'}} onClick={() => history.goBack()}>
                                                                  Kembali
                                                            </button>
                                                      }
                                                      {(HISTORY.status === 'approved' && HISTORY.status_delivery === 'delivered') && 
                                                            <button className='text-center btn-history-detail'  style={{backgroundColor :'#67b410'}}
                                                                  onClick={() => {if(window.confirm('Pesanan sudah diterima ?')){handleTerima()}}}
                                                            >
                                                                  Terima 
                                                            </button >
                                                      }
                                                </div>
                                          </div>
                                    </div>
                        </section>
                  <Footer/>
            </Fragment>
      )
}

export default withRouter(HistoryOrderDetail)
