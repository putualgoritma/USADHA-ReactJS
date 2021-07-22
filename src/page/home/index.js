import React, { Fragment, useState, useEffect } from 'react'
import API from '../../services'
import {FaShoppingCart, FaStar} from "react-icons/fa";
import { Carousel} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Footer, Header, Spinner } from '../../component';
import { Source } from '../../services/Config';
import { Rupiah } from '../../helper/Rupiah';
import { banner1, banner2, bannerMobile, bannerMobile2, listProduk, produk, userImg } from '../../assets';
import { facebook, gmail, handphone, instagram, playstore, telepon, twitter, whatsapp, youtube } from '../../assets';


function Home() {
      const history = useHistory()
      const [index, setIndex] = useState(0);
      const [products, setProducts] = useState(null)
      const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
      };
      const [loading, setLoading] = useState(true) 

      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([API.products()])
                  .then((result) => {
                        console.log(result);
                        setProducts(result[0])
                        setLoading(false)
                  }).catch((e) => {
                        console.log(e);
                        setLoading(false)
                  })
           }
            return () => {
                  Source.cancel('home cancel axios')
                  isAmounted = true;
                  console.log('cancel home');
            }
      }, [])
  
      if(loading){
            return (
                  <Spinner/>
            )
      }

      return (
            <Fragment>
                  <Header/>
                  <section className='section-header col-12' id='section-header'>
                        <Carousel activeIndex={index} onSelect={handleSelect}>
                              <Carousel.Item>
                                    <div className='header-custom'>
                                          <div  className='carousel-item-img'>
                                                      <img src={window.innerWidth <= 415 ? bannerMobile : banner1}  alt='img-home'/>
                                          </div>
                                          <div className='col-12 row justify-content-center text-title-banner text-title-banner-2'>
                                                <div className='carousel-item-text text-center'>
                                                      <h3>Original Herbal</h3>
                                                      <h2>Minyak Belog</h2>
                                                      <div className='row justify-content-center text-center mb-3'>
                                                            <p>
                                                                  Lorem Ipsum is simply dummy text of the printing and 
                                                                  typesetting industry. Lorem Ipsum has been the
                                                            </p>
                                                      </div>
                                                      <a href='#section-home-product' className='btn-shop-now text-decoration-none'>Shop Now</a>
                                                </div>
                                          </div>
                                          <Carousel.Caption>
                                          </Carousel.Caption>
                                    </div>
                              </Carousel.Item>
                              <Carousel.Item>
                                    <div className='header-custom'>
                                          <div  className='carousel-item-img'>
                                                      <img src={window.innerWidth <= 415 ? bannerMobile2 : banner2}  alt='img-home'/>
                                          </div>
                                          <div className='col-12 row justify-content-center text-title-banner'>
                                                <div className='carousel-item-text text-center'>
                                                      <h3>Original Herbal</h3>
                                                      <h2>Minyak Belog</h2>
                                                      <div className='row justify-content-center text-center mb-3'>
                                                            <p className='textbanner-2'>
                                                                  Lorem Ipsum is simply dummy text of the printing and 
                                                                  typesetting industry. Lorem Ipsum has been the
                                                            </p>
                                                      </div>
                                                      <a href='#section-home-product' className='btn-shop-now text-decoration-none'>Shop Now</a>
                                                </div>
                                          </div>
                                          <Carousel.Caption>
                                          </Carousel.Caption>
                                    </div>
                              </Carousel.Item>
                        </Carousel>
                  </section>
                  <section className='section-about'  id='section-about'>
                        <div className='wrapper-about' >
                              <div className='row container-fluid'>
                                    <div className = 'col-12 col-lg-7 '>
                                         <div className='img-about px-5 text-center'>
                                                <img src = {produk}  alt='img-home'/>
                                         </div>             
                                    </div>
                                    <div className = 'col-12 col-lg-5 '>
                                         <div className='detail-about'>
                                                <h4>THE PRODUCTS</h4>
                                                <h2>All About Minyak Belog</h2>
                                                <hr/>
                                                <p className='mt-5'>
                                                      Lorem Ipsum is simply dummy text of the printing and 
                                                      standard dummy text ever since the 1500s, to make a type 
                                                      specimen book.
                                                      Lorem Ipsum is simply dummy text of the printing and 
                                                      standard dummy text ever since the 1500s, to make a type 
                                                      specimen book.
                                                </p>
                                                <div>
                                                      <ul className='row justify-content-between mr-5'>
                                                            <li className='col-6'><span>orem Ipsum is simply </span></li>
                                                            <li className='col-6'><span>orem Ipsum is simply </span></li>
                                                      </ul>
                                                      <ul className='row justify-content-between mr-5'>
                                                            <li className='col-6'><span>orem Ipsum is simply </span></li>
                                                            <li className='col-6'><span>orem Ipsum is simply </span></li>
                                                      </ul>
                                                      <button className='btn-view-more'>VIEW MORE</button>
                                                </div>
                                         </div>
                                    </div>
                              </div>
                        </div>
                  </section>
                  <hr style={{backgroundColor:'#F5F4F4', height:2, marginTop:100}}/>
                  <section className='section-home-product' id='section-home-product'>
                              <div className='text-center text-title-home-product'>
                                          <h4>The Latest</h4>
                                          <h3>Minyak Belog Products</h3>
                              </div>
                              <div className='text-center'>
                                    <hr/>
                              </div>
                             <div className='container'>
                                    <div className='align-content-center row m-0'>
                                                {products && products.map((item, index)=> {
                                                      return (
                                                            <div className='col-6 col-md-4 wrapper-product-home row justify-content-center m-0' key = {index} onClick={() => history.push("/product/" + item.id)} >
                                                                  <div className='box-product-home'>
                                                                        <div className='mb-2'>
                                                                              <p className='title-product-home'>{item.name}</p>
                                                                        </div>
                                                                        <img src = {(item.img == null ? listProduk :( process.env.REACT_APP_BASE_URL  + String(item.img).replace('public/', '')))} alt='img-product'/>
                                                                        <div className='text-center'>
                                                                              <div className='row justify-content-center m-0 my-2'>
                                                                                    <FaStar className='star-active'/>
                                                                                    <FaStar className='star-active'/>
                                                                                    <FaStar className='star-active'/>
                                                                                    <FaStar className='star-active'/> 
                                                                                    <FaStar className='star-nonactive'/>
                                                                              </div>
                                                                              <p>{item.description}</p>
                                                                              <p className='harga'>{Rupiah(parseInt(item.price))}</p>
                                                                              <div className='row justify-content-center m-0 mb-3'>
                                                                                    <div className='box-icon-star mr-2'>
                                                                                          <FaShoppingCart className='icon-star' color='white'/>
                                                                                    </div>
                                                                                    <span className = 'add-to-cart'>Add To Cart</span>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      )
                                                })}
                                          </div>
                             </div>
                  </section>
                  <section className='featured' id='featured'>
                        <div className = 'container-fluid py-3'>
                              <div className='header-product-home text-title-home-product text-center mb-4'>
                                    <h4>Featured</h4>
                                    <h3>Testimoni</h3>
                                    <div className='text-center'>
                                          <hr/>
                                    </div>
                              </div>
                              <div className='row justify-content-between'>
                                    <div className='col-12 col-lg-6'>
                                          <div className='box-testi px-5 py-3'>  
                                                <img src={userImg} alt='img-home'/>
                                                <p>
                                                      Lorem Ipsum is simply dummy text of the  Testing online, Lorem Ipsum  is simply dummy text of the  Testing online. Lorem Ipsum is simply dummy text of the  Testing online.Ipsum  is simply dummy text of the  Testing online. Lorem Ipsum is simply dummy text of the  Testing online.
                                                </p>
                                                <h2>John De</h2>
                                                <div className='star-comment row ml-1 mb-3'>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                </div>
                                          </div>
                                    </div>
                                    <div className='col-12 col-lg-6'>
                                          <div className='box-testi px-5 py-3 '>  
                                                <img src={userImg} alt='img-home'/>
                                                <p>
                                                      Lorem Ipsum is simply dummy text of the  Testing online, Lorem Ipsum  is simply dummy text of the  Testing online. Lorem Ipsum is simply dummy text of the  Testing online.Ipsum  is simply dummy text of the  Testing online. Lorem Ipsum is simply dummy text of the  Testing online.
                                                </p>
                                                <h2>John De</h2>
                                                <div className='star-comment row ml-1 mb-3'>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                      <FaStar className='icon-color'/>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>
                  <section className='footer py-5' id='footer-section'>
                        {/* <div className='text-title-home-product header-product-home  text-center mb-4'>
                              <h4 className>Featured</h4>
                              <h3>Contact</h3>
                              <div className='text-center'>
                                    <hr/>
                              </div>
                        </div> */}
                        <div className = 'wrapper-footer'>
                              <div className='row'>
                                    <div className=' col-12 col-md-5 m-0 form-footer mr-3'>
                                          <h4 className='text-center'>Form Contact Us</h4>
                                          <div className="form-group row">
                                                <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
                                                <div className="col-sm-10">
                                                      <input type="text" className="form-control" id="inputName" placeholder="Name" />
                                                </div>
                                          </div>
                                          <div className="form-group row">
                                                <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                                                <div className="col-sm-10">
                                                      <input type="text" className="form-control" id="inputEMail" placeholder="Email" />
                                                </div>
                                          </div>
                                          <div className="form-group row">
                                                <label htmlFor="inputName" className="col-sm-2 col-form-label">Message</label>
                                                <div className="col-sm-10">
                                                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="5"></textarea>
                                                </div>
                                          </div>
                                          <button className='float-right btn-kirim'>Kirim</button>
                                    </div>
                                    <div className = 'col-12 col-md-7 px-1 row'>
                                          <div className = 'col-6'>
                                                <h4  className='title-footer-home'>Customer Service</h4>
                                                <div className='wrapper-sosmed px-3 mb-2'>
                                                      <div className='row align-items-center mb-1'>
                                                            <img src ={telepon} className='mr-1' alt='img-footer'/>
                                                            <span>(+62) 21 402007800</span>
                                                      </div>
                                                      <div className='row align-items-center mb-1'>
                                                            <img src ={whatsapp} className='mr-1' alt='img-footer'/>
                                                            <span>(+62) 21 402007800</span>
                                                      </div>
                                                      <div className='row align-items-center mb-1'>
                                                            <img src ={gmail} className='mr-1' alt='img-footer'/>
                                                            <span>UsadhaBakti@gmail.com</span>
                                                      </div>
                                                </div>
                                                <h4 className='title-footer-home'>Alamat</h4>
                                                <p>
                                                      Jl. Panjang Blok A3 No.1 Kedoya
                                                </p>
                                                <h4 className='title-footer-home'>Ikuti Kami</h4>
                                                <div className='row account-sosmed px-3 '>
                                                      <img src = {instagram}  alt='imge-footer'/>
                                                      <img src = {youtube}  alt='imge-footer'/>
                                                      <img src = {facebook}  alt='imge-footer'/>
                                                      <img src = {twitter}  alt='imge-footer'/>
                                                </div>
                                          </div>
                                          <div className = 'col-6 download-app'>
                                                <h4 className='title-footer-home mb-4'>Download App</h4>
                                              <div>
                                              <img src={handphone} className='mb-2' alt='imge-footer'/>
                                              </div>
                                                <img src={playstore} className='playstore' alt='imge-footer'/>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>
                  <Footer/>
            </Fragment>
      )
}
export default (Home)
