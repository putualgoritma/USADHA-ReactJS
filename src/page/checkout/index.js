import React, { Fragment, useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import { useHistory, withRouter } from 'react-router';
import { listProduk } from '../../assets';
import { Footer, Header, Spinner } from '../../component';
import { Rupiah } from '../../helper/Rupiah';
import API from '../../services';
import { Source } from '../../services/Config';



const ItemCart =(props) => {
      const [total, setTotal]= useState(props.harga * props.qty)
      return (
            <div>
                  <div className='d-flex flex flex-row '>  <div className='align-items-center w-100'>
                              <h5 className='header-cart-title'>{props.namaProduct}</h5>
                              <div className='d-flex flex flex-row '>
                                    <img src={ (props.img === null ? listProduk : process.env.REACT_APP_BASE_URL +String(props.img).replace('public/', ''))}   className='img-cart mr-2' alt='img' />
                                    <div className='w-100'>
                                          <div className='d-flex h-100 flex flex-column justify-content-between' >
                                                <p>{props.namaProduct}</p>
                                                <div className='' >
                                                      <p>Agen : {props.agen}</p>
                                                      <p>Quantity : {props.qty}</p>
                                                      <span>{Rupiah(parseInt(total))}</span>
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


function Checkout(props) {
      const history = useHistory()
      const [USER, setUSER] = useState(null);
      const [agen, setAgen] = useState(null)
      const [loading, setLoading] = useState(true);
      const [point, setPoint] = useState(0);
      const [CART, setCART] = useState(props.cart)
      const [total, setTotal]= useState(props.harga * props.qty)
      const [TOKEN, setTOKEN] = useState(null)
      const dateRegister = () => {
           var todayTime = new Date();
           var month = todayTime.getMonth() + 1;
           var day = todayTime.getDate();
           var year = todayTime.getFullYear();
           return year + "-" + month + "-" + day;
     }
      const [orders, setOrders] = useState({
            register: dateRegister(),
            customers_id: null,
            memo: "",
            agents_id : props.match.params.id,
            cart: null,
       });
      

      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN(), getCART()]).then((res) => {
                        let userData = res[0];
                        let tokenData = res[1]
                        let cartData = res[2]

                      if(userData && tokenData !==null){
                              setOrders({
                                    ...orders,
                                    customers_id : userData.id,
                                    cart : cartData
                              })
                              Promise.all([API.point(userData.id, tokenData), API.agentShow(props.match.params.id, tokenData)]) 
                              .then((result) => { 
                                    console.log(result);
                                    setPoint(parseInt(result[0].data[0].balance_points))
                                    setAgen(result[1].data)
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

      const getUSER = async () => {
            let data =  await sessionStorage.getItem('USER')
            data = JSON.parse(data)
            setUSER( data)
            return data;
      }
      const getTOKEN =  async () => {
            let data =  await sessionStorage.getItem('TOKEN')
            data = JSON.parse(data)
            setTOKEN( data)
            return data;
      }
      const getCART = async () => {
            let data = await sessionStorage.getItem('CART')
            data = JSON.parse(data)
            if(data){
                  setCART(data)
                  let cart = [];
                  data.map((item, index) => {
                        cart[cart.length] = {
                              products_id : item.id,
                              price : item.harga,
                              quantity : item.qty,
                        } 
                  })

                  let totalHarga = data.reduce((accum, item) => accum +( item.qty * item.harga), 0)
                  setTotal(totalHarga)
                  return cart;
           }
      }
      
      const handleCheckout = () => {
            if(USER.status !== 'active'){
                  alert('mohon lakukan activasi dahulu')
            }else{
                  if(point >= total){
                       if(orders.register !== null && orders.customers_id !== null &&  props.match.params.id && orders.cart){
                              setLoading(true)
                              API.order(orders, TOKEN).then((result) => {
                                   console.log(result)
                                   sessionStorage.removeItem('CART')
                                   history.push(`/landing/checkout sukses/home`)
                                   setLoading(false)
                              }).catch((e) => {
                                    console.log(e.request)
                                    setLoading(false)
                              })
                        }else{
                              alert('data order tidak lengkap ')
                        }
                  }else{
                        alert('point tidak cukup')
                  }
            }
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
                                          <div className='col-12 col-md-8'>
                                          <div className='box-cart-item col-12 p-0 align-content-center align-items-center'>
                                                      <h2 onClick={() => console.log(orders)}>Complate Order</h2>
                                                      <hr/>

                                                      {/* item */}
                                                      {CART && CART.map((item, index) => {
                                                            return (
                                                                  <div  key = {item.id} onClick={() => {setTimeout(function(){ getCART() }, 1000)}}>
                                                                        <ItemCart
                                                                        id = {item.id}
                                                                        cart = {CART}
                                                                        namaProduct = {item.namaProduct}
                                                                        img = {item.img}
                                                                        harga = {parseInt(item.harga)}
                                                                        qty = {item.qty}
                                                                        agen = {agen.name}
                                                                        />
                                                                  </div>
                                                            )
                                                      })}
                                                      {/* batas item */}
                                          </div>
                                          </div>
                                          <div className='col-12 col-md-4 cart-ringkasan'>
                                                <div className='box-ringkasan-belanja'>
                                                      <p className='ringkasan-text p-3 font-weight-bold'> <FaShoppingCart color='#F3C242' size={30} /> Ringkasan Belanja</p>
                                                      <hr/>
                                                      <div className='d-flex flex justify-content-between flex-row px-5 '>
                                                            <span className='mr-2' >Total Harga ({CART && CART.length} barang)</span>
                                                            <span>{Rupiah(total)}</span>
                                                      </div>
                                                      <hr/>
                                                      <div className='d-flex flex justify-content-between flex-row px-5 '>
                                                            <span className='mr-2' >Total Harga</span>
                                                            <span>{Rupiah(total)}</span>
                                                      </div>
                                                      <div className='text-center my-4'>
                                                            <button className='text-center btn-checkout' onClick={() =>handleCheckout()}>
                                                                  Buat Pesanan
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                        </section>
                  <Footer/>
            </Fragment>
      )
}

export default withRouter(Checkout) 
