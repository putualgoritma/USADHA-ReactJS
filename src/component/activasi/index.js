import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, withRouter } from 'react-router';
import { Spinner } from '..';
import { listProduk, profile } from '../../assets'
import { Rupiah } from '../../helper/Rupiah';
import API from '../../services';
import { Source } from '../../services/Config';
import Footer from '../footer'
import Header from '../header'

function Activasi(props) {
      const history = useHistory()
      const [USER, setUSER] = useState(null);
      const [TOKEN, setTOKEN] = useState(null);
      const [paket, setPaket] = useState(null)
      const [point, setPoint] = useState(0)
      const [agen, setAgen] = useState(null)
      const [loading, setLoading] = useState(true)
      const [select, setSelect] = useState(null)
      const [changePage, setChangePage] = useState(false)
      const [selectAgen, setSelectAgen] = useState(null)
      const [form, setForm] = useState({
            id :null,
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
                              setForm({...form, id : userData.id})
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

      const selectPaket = () => {
            if(select !==null && point >= select.price ){
                  // alert('paket suskes')
                  setForm({...form, package_id : select.id})
                  setChangePage(true)
            }else{
                  alert('poin anda kurang')
            }
      }

      
      const handleActivasi = () => {
            if (form.id !== null && form.agents_id !==null  && form.package_id !== null) {
                  setLoading(true)
                  API.activasi(form, TOKEN).then((result) => {
                        setLoading(false)
                        console.log(result);
                        setUSERSession(result.data)
                        history.push(`/landing/Activasi Sukses/profile`)
                  }).catch((e) => {
                        console.log(e.request);
                  })
            }else{
                  select === null ? alert('mohon pilih paket') : alert('mohon pilih agen');
            }
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

      const setUSERSession = async (data) => {   
            let setData =  await  sessionStorage.setItem('USER', JSON.stringify(data));
      }


      if(loading){
            return (
                  <Spinner/>
            )
      }

      return (
            <Fragment>
                  <Header/>
                        <section className = 'section-activasi'>
                              <div className='text-center'>
                                    <h2>Activasi Member</h2>
                                    <hr className='hr-global' />
                              </div>

                              {changePage === false ? (
                                     <div className='container'>
                                          <h4>Pilih Paket</h4>
                                          <div className='row'>
                                                {paket && paket.map((item, index) => {
                                                      return (
                                                            <div className='col-6 col-md-4 p-3' key={index} onClick={() => setSelect(item)} >
                                                                  <div className='box-paket p-3' style={{ backgroundColor : (select !== null && select.id === item.id ? ' #ffffeb' : '')}}>
                                                                        <h6>{item.name}</h6>
                                                                        <div className='text-center'>
                                                                        <img src={(item.img == null ? listProduk : process.env.REACT_APP_BASE_URL + String(item.img).replace('public/', ''))} />
                                                                        </div>
                                                                        <p>{Rupiah(parseInt(item.price))}</p>
                                                                  </div>
                                                            </div>
                                                      )
                                                })}
                                          </div>
                                          <div className='text-center'>
                                                <button className='paket w-75' onClick={selectPaket}>Pilih Paket</button>
                                          </div>
                                    </div>
                              ) :   ( 
                                    <div className='wrapper-item-agen container'>
                                          <div className='row'>
                                          {agen.map((item) => {
                                                return (
                                                      <div className='col-6 col-md-4' key={item.id} onClick ={() => setForm({...form, agents_id : item.id})}>
                                                            <div className='box-item-agent p-4' style={{backgroundColor : (form.agents_id !== null && form.agents_id === item.id ? '#F3C242' : '')}}>
                                                                  <div className='text-center'>
                                                                        <img src={profile} alt='foto-agent'/>
                                                                  </div>
                                                                  <p>{item.name}</p>
                                                                  <p>{item.email}</p>
                                                                  <p>{item.phone}</p>
                                                            {/* <div className='text-center mt-2'>
                                                                  <button onClick={() => history.push("/checkout/" + item.id)}>Pilih Agen</button>
                                                            </div> */}
                                                            </div>
                                                      </div>
                                                )
                                          })}
                                          </div>
                                          <div className='text-center '>
                                                <button className='back mr-2 w-25' onClick={() => setChangePage(false)} >Back</button>
                                                <button className='paket w-25' onClick={handleActivasi}>Activasi</button>
                                          </div>
                                    </div>
                              )}

                        </section>
                  <Footer/>
            </Fragment>
      )
}

export default withRouter(Activasi)
