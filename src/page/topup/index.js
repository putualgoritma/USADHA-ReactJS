import React, { Fragment, useEffect, useState } from 'react'
import {FaCreditCard, FaRegCreditCard} from "react-icons/fa";
import { useHistory } from 'react-router';
import { Footer, Header, Spinner } from '../../component';
import { Rupiah } from '../../helper/Rupiah';
import API from '../../services';
import { Source } from '../../services/Config';

function Topup() {
      const history = useHistory()
      const [USER, setUSER] = useState(null)
      const [accountCash, setAccountCash] = useState(null);
      const [loading, setLoading] = useState(true);
      const [point, setPoint] = useState(0);
      const [TOKEN, setTOKEN] = useState(null)

      const dateRegister = () => {
            let todayTime = new Date();
            let month = todayTime.getMonth() + 1;
            let day = todayTime.getDate();
            let year = todayTime.getFullYear();
            return year + "-" + month + "-" + day;
      }
      const [form, setForm] = useState({
            register : dateRegister(),
            customers_id : null,
            memo : 'Top up poin',
            accounts_id : null,
            amount : 0,
      })

      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN()]).then((res) => {
                        let userData = res[0];
                        let tokenData = res[1];
                        if(userData !== null && tokenData !==null){
                              setForm({
                                    ...form,
                                    customers_id : userData.id
                              })
                              Promise.all([API.accountCash(tokenData), API.point(userData.id, tokenData)]) 
                              .then((result) => { 
                                    setAccountCash(result[0])
                                    setPoint(result[1].data[0].balance_points)
                                    setLoading(false) 
                              }).catch((e) => {
                                    console.log(e);
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


      const onChangeForm = (name, value) => {
            setForm({
                  ...form,
                  [name] : value
            })
      }

      const handleTopup = () => {
            if(form.accounts_id !== null && form.amount !== 0 && form.customers_id !== '' && form.memo !== '' && form.register !== ''){
                  setLoading(true)
                  API.topup(form, TOKEN).then((result) => {
                        console.log(result);
                        setForm({
                              register : dateRegister(),
                              customers_id : USER.id,
                              memo : 'Top up poin',
                              accounts_id : null,
                              amount : 0,
                        });
                        // alert(result.message)
                        history.push(`landing/${result.message}/topup`)
                        // setLoading(false)
                        // window.location.reload();
                  }).catch((e) => {
                        console.log(e.request)
                        alert('topup gagal')
                        setForm({
                              register : dateRegister(),
                              customers_id : USER.id,
                              memo : 'Top up poin',
                              accounts_id : null,
                              amount : 0,
                        });
                        setLoading(false)
                  })
            }else{
                  alert('mohon isi data dengan lengkap');
                  setLoading(false)
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
                        <section className ='section-topup'>
                              <div className='header-agent container d-flex justify-content-center'>
                                   <div className='col-12 col-md-8'>
                                         <div className='text-center d-flex justify-content-center flex-column'>
                                                      <h2 >Topup</h2>
                                                      <hr className='hr-global col-12 mt-3'  />
                                         </div>
                                          <div className='item-transfer mt-5'>
                                                <span>Sumber Dana</span>
                                                <div className='box-sumber-dana mb-3'>
                                                      <div className='d-flex flex-row align-items-center'>
                                                            <FaCreditCard className='icon-card mr-3'/>
                                                            <div>
                                                                  <span className='font-weight-bold'>Minyak Belog Cash</span> <br/>
                                                                  <span className='font-smaller'>Balance {Rupiah(parseInt(point))}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                                <h3> Pilih Nominal Topup</h3>
                                                <hr />
                                                <div className='col-12 row justify-content-center nominal'>
                                                      <div className='col-4 text-center d-flex justify-content-center'  onClick={()=>onChangeForm('amount', 200000)}>
                                                            <span className='box-nominal ' style={{boxShadow : (form.amount === 200000 ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.amount === 200000? `rgb(230, 158, 26)` : '')}}> RP.200.000</span>
                                                      </div>
                                                      <div className='col-4 text-center  d-flex justify-content-center'>
                                                            <span className='box-nominal'  style={{boxShadow : (form.amount === 300000 ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.amount === 300000? `rgb(230, 158, 26)` : '')}} onClick={()=>onChangeForm('amount', 300000)}> RP.300.000</span>
                                                      </div>   
                                                      <div className='col-4 text-center  d-flex justify-content-center' >
                                                            <span className='box-nominal' style={{boxShadow : (form.amount === 500000 ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.amount === 500000? `rgb(230, 158, 26)` : '')}} onClick={()=>onChangeForm('amount', 500000)}> RP.500.000</span>
                                                      </div>
                                                </div>
                                                {/* defaultValue={typeof form.amount !== 'object' ? (form.amount === 200000 || form.amount === 300000 ||form.amount===500000? form.amount : 0) : 0} */}
                                                <span>Atau masukan nominal Topup disini</span>
                                                <input type = 'number' className='form-control input-nominal mb-3' value={typeof form.amount !== 'object' ? form.amount :0}  onChange={(value) => {onChangeForm('amount', value.target.value);}}/>
                                                <h3>Transfer Bank</h3>
                                                <hr />
                                                <div className='type-bank row mt-5'>
                                                      {accountCash.map((item, index) => {
                                                            return (
                                                                  <div className='col-6 col-md-4 mt-3' key = {index} onClick ={(result) => onChangeForm('accounts_id', item.id)}>
                                                                        <div className='box-type-transfer text-center' style={{boxShadow : (item.id === form.accounts_id ? `0 0 5px rgb(230, 158, 26)` : ''), color : (item.id === form.accounts_id ? `rgb(230, 158, 26)` : '')}}  >
                                                                              <FaRegCreditCard className='icon'/>
                                                                              <p>{item.name}</p>
                                                                        </div>
                                                                  </div>
                                                            )
                                                      })}
                                                      
                                                </div>
                                                <div className='d-flex justify-content-center my-4'>
                                                      <button onClick={() => handleTopup()} className= 'btn-login' >Topup</button>
                                                </div>
                                          </div>
                                   </div>
                              </div>
                        </section>
                  <Footer/>
                
            </Fragment>
      )
}


export default (Topup)
