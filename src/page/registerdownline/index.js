import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, withRouter } from 'react-router'
import { listProduk, profile } from '../../assets'
import { Footer, Header, Spinner } from '../../component'
import { Rupiah } from '../../helper/Rupiah'
import API from '../../services'
import { Source } from '../../services/Config'

const ItemRegisterDonwline = (props) => {
      return (
            <div >
                  <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" onChange={props.onChangeEmail} />
                  </div>
                  <div className="mb-3">
                        <label htmlFor="exampleFormControlInput2" className="form-label">Name</label>
                        <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="Your name" onChange={props.onChangeName}/>
                  </div>
                  <div className="mb-3">
                        <label htmlFor="exampleFormControlInput3" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleFormControlInput3" placeholder="******" onChange={props.onChangePassword} />
                  </div>
                  <div className="mb-3">
                        <label htmlFor="exampleFormControlInput4" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="exampleFormControlInput4" placeholder="******" onChange={props.onChangeConfirm} />
                  </div>
                  <div className="mb-3">
                        <label htmlFor="exampleFormControlInput5" className="form-label">Phone number</label>
                        <input type="number" className="form-control" id="exampleFormControlInput5" placeholder="082xxxxx" onChange={props.onChangePhone} />
                  </div>
                  <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea6" className="form-label">Address</label>
                        <textarea className="form-control" id="exampleFormControlTextarea6" rows="3" onChange={props.onChangeAddress} ></textarea>
                  </div>
                  <div className='row container m-0 p-0 justify-content-center'>
                        <button type='submit' className='btn-login' onClick={props.onHandlePage}>
                              Selanjutnya
                        </button>
                  </div>
            </div>
      )
}


const ItemPackage = (props) => {
      return (
            <div className='col-6 col-md-4 p-3' onClick={() => {props.select(); props.harga()}}>
                  <div className='box-paket p-3'style={{backgroundColor : props.color}} >
                        <span className='font-weight-bold'>{props.name}</span>
                        <div className='text-center'>
                        <img src={(props.img == null ? listProduk : process.env.REACT_APP_BASE_URL + String(props.img).replace('public/', ''))} />
                        </div>
                        <p>{props.price}</p>
                  </div>
            </div>
      )
}

const ItemAgen = (props) => {
      return (
            <div className='col-6 col-md-4' onClick={props.select}>
                  <div className='box-item-agent p-3' style={{backgroundColor : props.color}} >
                  <div className='text-center'>
                        <img src={profile} alt='foto-agent'/>
                  </div>
                        <p>{props.name}</p>
                        <p>{props.email}</p>
                        <p>{props.phone}</p>
                  </div>
            </div>
      )
}

function RegisterDownline() {
      const dateRegister = () => {
            var todayTime = new Date();
            var month = todayTime.getMonth() + 1;
            var day = todayTime.getDate();
            var year = todayTime.getFullYear();
            return year + "-" + month + "-" + day;
      }
      const history = useHistory()
      const [USER, setUSER] = useState(null);
      const [TOKEN, setTOKEN] = useState(null);
      const [paket, setPaket] = useState(null)
      const [point, setPoint] = useState(0)
      const [agen, setAgen] = useState(null)
      const [price, setPrice] = useState(0)
      // const [selectPackage, setSelectPackage] = useState(null)
      const [loading, setLoading] = useState(true)
      const [confirm, setConfirm] = useState(null)
      const [pageRegister, setPageRegister] =  useState(true)
      const [pagePackage, setPagePackage] =  useState(false)
      const [pageAgen, setPageAgen] = useState(false)
      const [form, setForm] = useState({
            register : dateRegister(),
            password : null,
            name : null,
            phone : null,
            email : null,
            address : null,
            ref_id : null,
            package_id : null,
            agents_id : null
      })



      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN()]).then((res) => {
                        let userData = res[0];
                        let tokenData = res[1]

                      if(userData && tokenData !==null){
                              setForm({...form, ref_id : userData.id})
                              Promise.all([API.point(userData.id, tokenData), API.agents(), API.paketMembers(tokenData)]) 
                              .then((result) => { 
                                    console.log(result);
                                    setPoint(parseInt(result[0].data[0].balance_points))
                                    setAgen(result[1].data)
                                    setPaket(result[2].data)
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


      const handleRegisterDownline = () => {
            if(point >= price){
                  if(form.agents_id !==null){
                        setLoading(true)
                        API.registerdownline(form, TOKEN).then((result) => {
                              console.log(result);
                              history.push(`landing/Register Downline Berhasil/registerdownline`)
                        }).catch((e) => {
                              console.log(e.request);
                              setLoading(false)
                              let mes = JSON.parse(e.request.response)
                              alert(mes.message)
                              window.location.reload()
                        })
                  }
            }
      }


      const onChangeForm = (name, value) => {
            setForm(
                  { 
                        ...form,
                        [name] : value
                  }
            )
      }

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

      const handlePagePackage = () => {
            if(form.name !== null && form.address !==null && form.email !==null && form.password !==null && form.phone !==null){
                  if(form.password === confirm){
                        setPageRegister(false)
                        setPagePackage(true)
                  }else{
                        alert('password anda tidak sama')
                  }
            }else{
                  alert('mohon lengkapi data')
            }
      }

      const hanldePageAgen = () => {
            if(form.package_id !== null){
                  setPageRegister(false)
                  setPagePackage(false)
                  setPageAgen(true)
            }else{
                  alert('Pilih Paket terlebih dahulu')
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
                  <section className = 'section-register-downline'>
                        <div className='wrapper-register-downline'>
                              <div className = 'header-resgiter-downline text-center'>
                                    <h2 onClick={() =>console.log(price)} >Register Downline</h2>
                                    <hr className='hr-global'/>
                              </div>
                              <div className='body-register-downline container d-flex justify-content-center'>
                                          {pageRegister && 
                                           <div className='col-12 d-flex justify-content-center'>
                                                <div className='col-12 col-md-7'>
                                                <ItemRegisterDonwline
                                                      onChangePassword = {(value) => onChangeForm('password', value.target.value)}
                                                      onChangeName = {(value) => onChangeForm('name', value.target.value)}
                                                      onChangePhone = {(value) => onChangeForm('phone', value.target.value)}
                                                      onChangeEmail = {(value) => onChangeForm('email', value.target.value)}
                                                      onChangeAddress = {(value) => onChangeForm('address', value.target.value)}
                                                      onChangeConfirm ={(value) => setConfirm(value.target.value)}
                                                      onHandlePage = {handlePagePackage}
                                                />
                                                </div>
                                          </div>
                                          }

                                          {pagePackage && 
                                                <div className='section-activasi m-0 mb-4'>
                                                      <div className='row'>
                                                            {paket && paket.map((item, index) => {
                                                                  return (
                                                                              <ItemPackage
                                                                                    key ={index}
                                                                                    name = {item.name}
                                                                                    img = {item.img}
                                                                                    price = {Rupiah(parseInt(item.price))}
                                                                                    select = {() => onChangeForm('package_id',item.id)}
                                                                                    harga = {() => setPrice(parseInt(item.price))}
                                                                                    color = {form.package_id === item.id ? ' #ffffeb' : ''}
                                                                              />
                                                                  )
                                                            })}
                                                      </div>
                                                      <div className='row container m-0 p-3 justify-content-center'>
                                                            <button type='submit' onClick={() => {setPageRegister(true); setPagePackage(false)}} className='btn-login mt-2 mx-1' style={{backgroundColor:'#f5a52d'}}>Kembali</button>
                                                            <button type='submit' onClick={() => hanldePageAgen()} className='btn-login mt-2 mx-1' >Pilih Paket</button>
                                                      </div>
                                                </div>
                                          }
                                          {pageAgen && 
                                                <div className='section-activasi agen-downline mb-4 mt-3 '>
                                                      <div className='row'>
                                                            {agen.map((item, index) => {
                                                                  return (
                                                                        <ItemAgen
                                                                              key ={index}
                                                                              name ={item.name}
                                                                              email = {item.email}
                                                                              phone = {item.phone}
                                                                              select = {() => onChangeForm('agents_id', item.id)}
                                                                              color = {form.agents_id === item.id ? ' #F3C242' : ''}
                                                                        />
                                                                  )
                                                            })}
                                                      </div>
                                                      <div className='row container m-0 p-3 justify-content-center'>
                                                            <button type='submit'  onClick={() => {setPagePackage(true); setPageAgen(false)}} className='btn-login mt-2 mx-1' style={{backgroundColor:'#f5a52d'}}>Kembali</button>
                                                            <button type='submit' className='btn-login mt-2 mx-1'onClick={handleRegisterDownline} >Register</button>
                                                      </div>
                                                </div>
                                          }
                              </div>
                        </div>
                  </section>
                  <Footer/>
            </Fragment>
      )
}

export default withRouter(RegisterDownline)
