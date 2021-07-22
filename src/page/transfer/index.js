import React, { Fragment, useEffect, useState } from 'react'
import { FaCreditCard, FaRegCreditCard } from 'react-icons/fa';
import { connect } from 'react-redux'
import { useHistory } from 'react-router';
import { Footer, Header, Spinner } from '../../component';
import { Rupiah } from '../../helper/Rupiah';
import API from '../../services';
import { Source } from '../../services/Config';
import { SelectPicker, Button } from 'rsuite';
function Transfer() {
      const history = useHistory();
      const [USER, setUSER] = useState(null)
      const [loading, setLoading] = useState(true);
      const [point, setPoint] = useState(0);
      const [TOKEN, setTOKEN] = useState(null)
      const [members, setMembers] = useState(null)

      const dateRegister = () => {
            let todayTime = new Date();
            let month = todayTime.getMonth() + 1;
            let day = todayTime.getDate();
            let year = todayTime.getFullYear();
            return year + "-" + month + "-" + day;
      }
      const [form, setForm] = useState({
            register : dateRegister(),
            amount : 0,
            from : null,
            to : null
      })

      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN()]).then((res) => {
                        let userData = res[0];
                        let tokenData = res[1]

                        if(userData!== null && tokenData !==null){
                              Promise.all([API.members(tokenData), API.point(userData.id, tokenData)]) 
                              .then((result) => { 
                                    let memberData = [];
                                    result[0].data.map((item, index) => {
                                          memberData[memberData.length] ={
                                                label : `${item.name} (${item.code})`,
                                                value : item.id,
                                          }
                                    })
                                    setMembers(memberData)
                                    setForm({...form, from : userData.id})
                                    setPoint(parseInt(result[1].data[0].balance_points))
                                    setLoading(false)
                                    console.log('sekusis');
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
            // onChangeForm('customers_id', data.id)
            return data;
            
      }
      const getTOKEN =  () => {
            let data =  sessionStorage.getItem('TOKEN')
            data = JSON.parse(data)
            setTOKEN( data)
            return data;
            
      }


      const handleTransfer = () => {
            if(form.accounts_id !==null && form.amount > 0 && form.customers_id !==null && form.memo !== '' && form.register !== ''){
                  if(point >= form.amount){
                        setLoading(true)
                        API.transfer(form, TOKEN).then((result) => {
                              // window.location.reload();
                              history.push(`landing/tansfer sukses/transfer`)
                        }).catch((e) => {
                              console.log(e.request);
                              alert('transfer gagal')
                        })
                  }else{
                        alert('poin anda kurang')
                  }
            }else{
                  alert('mohon isi data dengan lengkap')
            }
      }


      if(loading){
            return (
                  <Spinner/>
            )
      }

      var key = 1;

      return (
            <Fragment>
                  <Header/>
                        <section className='section-transfer'>
                              <div className='header-agent container d-flex justify-content-center'>
                                   <div className='col-12 col-md-8'>
                                          <div className='text-center d-flex justify-content-center flex-column'>
                                                      <h2 >Transfer</h2>
                                                      <hr className='hr-global col-12 mt-3'  />
                                         </div>
                                          <div className='item-transfer'>
                                                <SelectPicker data={members}  block onChange={(value) => setForm({...form, to : value})} className='mb-3'/>
                                                <span>Sumber Dana</span>
                                                <div className='box-sumber-dana my-2'>
                                                      <div className='d-flex flex-row align-items-center'>
                                                            <FaCreditCard className='icon-card mr-3'/>
                                                            <div>
                                                                  <span className='font-weight-bold'>Minyak Belog Cash</span> <br/>
                                                                  <span className='font-smaller'>Balance {Rupiah(point)}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                                <label>Nominal Transfer</label><br/>
                                                <input className='form-control' type='number' onChange={(value) =>  setForm({...form, amount : value.target.value})} minLength={0} />
                                                {/* <label>Pesan Opsional</label><br/>
                                                <textarea rows='4' className='form-control mb-4' onChange={(value) =>  setForm({...form, memo : value.target.value})}></textarea> */}
                                                <div className='d-flex justify-content-center mt-4'>
                                                      <button onClick ={() => handleTransfer()} className='btn-login'>Transfer</button>
                                                </div>
                                          </div>
                                   </div>
                              </div>
                           
                        </section>
                  <Footer/>
            </Fragment>
      )
}


export default  (Transfer)
