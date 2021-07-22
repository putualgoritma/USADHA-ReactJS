import React, { Fragment, useEffect, useState } from 'react'
import { Footer, Header, Spinner } from '../../component'
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { Background1, listProduk } from '../../assets';
import { Rupiah } from '../../helper/Rupiah';
import { useHistory, withRouter } from 'react-router';


const ItemCart = (props) => {
      const [qty, setQty] =useState(props.qty);
      const [CART, setCART] = useState(props.cart)
      const [total, setTotal]= useState(props.harga * props.qty)
      const [selected, setSelected] =useState(props.selected)
      const handleQty = (type) => {
            if(type === 'MIN'){
                  if(qty > 0){
                        setQty(qty - 1);
                  }
            }else if( type === 'PLUSH'){
                  setQty(qty + 1)
            }
      }

      const handleSelected = (value) => {
            CART.some(function (entry, i){
                  if(entry.id === props.id){
                       CART[i].selected = value;
                  }
                  return 0;
            })
            setSelected(value)
            sessionStorage.setItem('CART', JSON.stringify(CART))
      }

      const cartDelete = () => {
            // let data = CART.find(item => item.id == props.id);
            // console.log(data);
            for (var i = 0; i < CART.length; i++) {
                  if (CART[i].id === props.id) {
                        CART.splice(i, 1);
                  }
            }
            sessionStorage.setItem('CART', JSON.stringify(CART))
            window.location.reload();
      }
      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) {
                  setTotal(props.harga * qty)
                  CART.some(function (entry, i){
                        if(entry.id === props.id){
                             CART[i].qty = qty;
                        }
                        return 0;
                  })
                  sessionStorage.setItem('CART', JSON.stringify(CART))
           }
            return () => {
                  isAmounted = true
            }
      }, [qty])

      

      return (
            <div>
                  <div className='d-flex flex flex-row '>
                        <input type='checkbox' checked = {props.selectedAll ? true : (selected ? true : false)} className='d-inline-block mr-3 checkbox-custom' onChange={(value) => handleSelected(value.target.checked)} />
                        <div className='align-items-center w-100'>
                              <h5 className='header-cart-title'>{props.namaProduct}</h5>
                              <div className='d-flex flex flex-row '>
                                    <img src={(props.img == null ? listProduk : process.env.REACT_APP_BASE_URL + String(props.img).replace('public/', ''))}   className='img-cart mr-2' alt='img' />
                                    <div className='w-100'>
                                          <div className='d-flex h-100 flex flex-column justify-content-between' >
                                                <p>{props.namaProduct}</p>
                                                <div className='d-flex flex flex-row justify-content-between' >
                                                      <span>{Rupiah(parseInt(total))}</span>
                                                      <div className='d-flex align-items-center btn-qty'>
                                                            <FaTrashAlt className=' icon-trash-cart' color='red' onClick={cartDelete}/>
                                                            <button className='btn-qty-cart-min '  onClick={() => handleQty('MIN')}><span>-</span></button>
                                                            <span className='qty-text'>{qty}</span>
                                                            <button className='btn-qty-cart' onClick={() => handleQty('PLUSH')}><span>+</span></button>
                                                      </div>
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

function Cart() {
      const history = useHistory()
      const [CART, setCART] = useState(null)
      const [total, setTotal] = useState(0)
      const [selected, setSelected] = useState(false)
      const [loading, setLoading] =  useState(true)
      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) { 
               getCART()
               setLoading(false)
           }
            return () => {
                  isAmounted = true;
            }
      }, [])
      
      const handleSelected = (value) => {
            CART.map((item, index) => {
                  CART[index].selected = value;
                  return 0;
            })
            setSelected(value)
            // console.log(CART);
      }

      const getCART = async () => {
            let data = await sessionStorage.getItem('CART')
            data = JSON.parse(data)
            setCART(data)
           if(data){
                  let totalHarga = data.reduce((accum, item) => accum +( item.qty * item.harga), 0)
                  setTotal(totalHarga)
           }
      }

      const deleteSelected = async () => {
            let i = 0;
            while (i < CART.length) {
                  if (CART[i].selected === true) {
                    CART.splice(i, 1);
                  } else {
                    ++i;
                  }
             }
            let setdata = await sessionStorage.setItem('CART', JSON.stringify(CART))
            getCART()
            window.location.reload();
            
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
                                          <h2 onClick={() => console.log(CART)}>Keranjang</h2>
                                          <div className='d-flex flex align-items-center mt-3 header-box-cart'>
                                                <input type='checkbox' className='d-inline-block mr-3 checkbox-custom' onChange={(value) => handleSelected(value.target.checked)} />
                                                <span >Pilih Semua</span>
                                                <button className='ml-auto hapus' onClick ={() => deleteSelected()}>Hapus</button>
                                          </div>
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
                                                            selected = {item.selected}
                                                            selectedAll = {selected}
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
                                          <div className='d-flex flex justify-content-between flex-row px-3 '>
                                                <span className='mr-2' >Total Harga ({CART && CART.length} barang)</span>
                                                <span className='font-weight-bold'>{Rupiah(total)}</span>
                                          </div>
                                          <hr/>
                                          <div className='d-flex flex justify-content-between flex-row px-3 '>
                                                <span className='mr-2' >Total Harga</span>
                                                <span className='font-weight-bold'>{Rupiah(total)}</span>
                                          </div>
                                          <div className='text-center my-4'>
                                                <button className='text-center btn-checkout' onClick={CART && CART.length > 0 ? () => history.push("/agen") : () => alert('keranjang kosong')}>
                                                      CheckOut
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

export default withRouter (Cart)
