import React, { Fragment, useEffect, useState } from 'react'
import { Background1 } from '../../assets'
import { useHistory, withRouter } from "react-router-dom";
import API from '../../services';
import { Footer, Header, Spinner } from '../../component';
import { Source } from '../../services/Config';
import { Rupiah } from '../../helper/Rupiah';
import { FaStar } from 'react-icons/fa';

function Product(props) {
      const history = useHistory()
      const [loading, setLoading] =  useState(true)
      const [product, setProduct] = useState(null)
      const [USER, setUSER] = useState(null)
      const [CART, setCART] = useState(null)
      var cartData = []

      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) {
                  Promise.all([API.productDetail(props.match.params.id)])
                  .then(response => {
                        getUSER()
                        getCART()
                        setProduct(response[0].data)
                        setLoading(false)
                  }).catch((e) => {
                        setLoading(false)
                  })
           }
            return () => {
                  Source.cancel('cancel axios')
                  isAmounted = true
            }
      }, [])

      const getCART = async () => {
            let data = await sessionStorage.getItem('CART')
            data = JSON.parse(data)
            setCART(data)
      }

      const getUSER = async() => {
            let data = await sessionStorage.getItem('USER')
            data = JSON.parse(data)
            setUSER(data)
      }

      const handleCart = () => {
            if(CART !== null){
                  cartData = CART
            }
            let penanda = false; 
            let message = '';
            let data ={
                  id: product.id,
                  // id_user: USER.id,
                  namaProduct: product.name,
                  harga: product.price,
                  selected: false,
                  qty: 1,
                  img : product.img,
                  note: '',
                  status: 'pending',
            }
            cartData.some(function (entry, i){
                  if(entry.id === product.id){
                        penanda= true
                  }
            })

            if(!penanda){
                  cartData.push(data)
                  message = 'produk di tambahkan';
                  sessionStorage.setItem('CART', JSON.stringify(cartData))
                  history.push(`/landing/${message}/home`)
            }else{
                  alert('produk sudah ada di keranjang')
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
                  <section className='product-detail container'>
                        <div className='detail-about text-center'>
                              <h4>Product</h4>
                              <h2>Detail</h2>
                              <div className='row justify-content-center'>
                                    <hr/>
                              </div>
                        </div>

                        <div className='wrapper-product-detail row'>
                              <div className = 'col-12 col-md-6 mt-2'>
                                    <div className = 'box-product-detail-img text-center '>
                                          <img src={(product.img == null ? Background1 : process.env.REACT_APP_BASE_URL + String(product.img).replace('public/', ''))} />
                                    </div>
                              </div>
                              <div className = 'col-12 col-md-6 mt-2'>
                                    <div className = 'box-product-detail-desc '>
                                    <h4>{product.name}</h4>
                                    <div className='star-comment row ml-1 mb-3 align-content-center align-items-center  '>
                                                <FaStar className='icon-color'/>
                                                <FaStar className='icon-color'/>
                                                <FaStar className='icon-color'/>
                                                <FaStar className='icon-color'/>
                                                <FaStar className='icon-color'/>
                                                <span className = 'ml-3'>{Rupiah(parseInt(product.price))}</span>
                                          </div>
                                          <p className='product-detail-desc-text'>
                                                {product.description}
                                          </p>
                                          <div className='row px-3 justify-content'> 
                                                {/* <div className='co-6 mr-3'>
                                                      <div className='box-product-qty'>
                                                            <button className='btn-product-detail' onClick = {() => handleQty( 'MIN')}>-</button>
                                                            <span className='mx-3'>{qty}</span>
                                                            <button className='btn-product-detail' onClick = {() => handleQty( 'PLUSH')}>+</button>
                                                      </div>
                                                </div> */}
                                                <div className='co-12'>
                                                      <button className='btn-product-detail btn-add-cart-product' onClick={() => handleCart()}>Add To Cart</button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>
                  {/* <hr></hr> */}
                  <Footer/>
            </Fragment>
      )
}

export default withRouter(Product)
