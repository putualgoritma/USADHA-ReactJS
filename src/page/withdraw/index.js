import React, { Fragment, useEffect, useState } from 'react'
import { FaCreditCard, FaRegCreditCard } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { Footer, Header, Spinner } from '../../component';
import API from '../../services';
import { Rupiah } from '../../helper/Rupiah';
import { Source } from '../../services/Config';

function Withdraw() {

      const history = useHistory()
      const [USER, setUSER] = useState(null)
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
            amount : 0,
            bank_name : null,
            bank_acc_no : null
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
                              Promise.all([ API.point(userData.id, tokenData)]) 
                              .then((result) => { 
                                    setPoint(parseInt(result[0].data[0].balance_points))
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

      const handleWithdraw = () => {
            if(form.bank_acc_no !== null && form.amount !== 0 && form.customers_id !== '' && form.bank_name !== null && form.register !== ''){
                  if(point > form.amount){
                        setLoading(true)
                        API.withdraw(form, TOKEN).then((result) => {
                              console.log(result);
                              setForm({
                                    register : dateRegister(),
                                    customers_id : null,
                                    amount : 0,
                                    bank_name : null,
                                    bank_acc_no : null
                              });
                              // alert(result.message)
                              // window.location.reload();
                              history.push(`landing/${result.message}/withdraw`)
                        }).catch((e) => {
                              console.log(e.request)
                              alert('withdraw gagal')
                              setForm({
                                    register : dateRegister(),
                                    customers_id : null,
                                    amount : 0,
                                    bank_name : null,
                                    bank_acc_no : null
                              });
                              setLoading(false)
                        })
                  }else{
                        alert('poin anda kurang')
                  }
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
                                                      <h2 >WIthdraw</h2>
                                                      <hr className='hr-global col-12 mt-3'  />
                                         </div>
                                          <div className='item-transfer mt-5'>
                                                <span>Sumber Dana</span>
                                                <div className='box-sumber-dana mb-3'>
                                                      <div className='d-flex flex-row align-items-center'>
                                                            <FaCreditCard className='icon-card mr-3'/>
                                                            <div>
                                                                  <span className='font-weight-bold'>Minyak Belog Cash</span> <br/>
                                                                  <span className='font-smaller'>Balance {Rupiah(point)}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                                <label>No Rek</label><br/>
                                                <input className='form-control mb-2' type='number' placeholder='******' min={0} onChange={(value) => onChangeForm('bank_acc_no', value.target.value)}/>
                                                <h3>Pilih Nominal Topup</h3>
                                                <hr />
                                                <div className='col-12 row justify-content-center nominal'>
                                                      <div className='col-4 text-center d-flex justify-content-center' onClick={() => onChangeForm('amount', 200000)} >
                                                            <span className='box-nominal'  style={{boxShadow : (form.amount === 200000 ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.amount === 200000? `rgb(230, 158, 26)` : '')}} > RP.200.000</span>
                                                      </div>
                                                      <div className='col-4 text-center  d-flex justify-content-center'  onClick={() => onChangeForm('amount', 300000)}>
                                                            <span className='box-nominal'  style={{boxShadow : (form.amount === 300000 ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.amount === 300000? `rgb(230, 158, 26)` : '')}} > RP.300.000</span>
                                                      </div>   
                                                      <div className='col-4 text-center  d-flex justify-content-center'  onClick={() => onChangeForm('amount', 500000)}>
                                                            <span className='box-nominal' style={{boxShadow : (form.amount === 500000 ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.amount === 500000? `rgb(230, 158, 26)` : '')}} > RP.500.000</span>
                                                      </div>
                                                </div>
                                                <span>Atau masukan nominal Topup disini</span>
                                                <input type = 'number' className='form-control input-nominal mb-3' value={form.amount} onChange={(value)=> onChangeForm('amount', value.target.value)}/>
                                                <h3>Transfer Bank</h3>
                                                <hr />
                                                <div className='type-bank row mt-5 justify-content-center'>
                                                      <div className='col-6 col-md-4 mt-3'>
                                                            <div className='box-type-transfer text-center' onClick={() => onChangeForm('bank_name', 'BRI')} style={{boxShadow : (form.bank_name === 'BRI' ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.bank_name === 'BRI' ? `rgb(230, 158, 26)` : '')}} >
                                                                  <FaRegCreditCard className='icon'/>
                                                                  <p>Bank BRI</p>
                                                            </div>
                                                      </div>
                                                      <div className='col-6 col-md-4 mt-3'>
                                                            <div className='box-type-transfer text-center' onClick={() => onChangeForm('bank_name', 'BCA')} style={{boxShadow : (form.bank_name === 'BCA' ? `0 0 5px rgb(230, 158, 26)` : ''), color : (form.bank_name === 'BCA' ? `rgb(230, 158, 26)` : '')}}>
                                                                  <FaRegCreditCard className='icon'/>
                                                                  <p>Bank BCA</p>
                                                            </div>
                                                      </div>
                                                </div>
                                                <div className='d-flex justify-content-center my-4'>
                                                      <button onClick={handleWithdraw} className='btn-login'>Withdraw</button>
                                                </div>
                                          </div>
                                   </div>
                              </div>
                        </section>
                 <Footer/>
           </Fragment>
      )
}

export default Withdraw
