import React, { Fragment, useState } from 'react'
import API from '../../services/'
import { Link, useHistory } from 'react-router-dom'
import { Footer, Header, Spinner } from '../../component'

function Register() {
      const [loading, setLoading] = useState(false);
      const history = useHistory()
      const [confirmPassword, setConfirmPassword] = useState(null)
      const dateRegister = () => {
            var todayTime = new Date();
            var month = todayTime.getMonth() + 1;
            var day = todayTime.getDate();
            var year = todayTime.getFullYear();
          
            return year + "-" + month + "-" + day;
      }
      const [form, setForm] = useState({
            register: dateRegister(),
            password: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            type: 'member',
            status: 'active',
      })

      const onChangeForm = (name, value) => {
            setForm(
                 { ...form,
                  [name] : value}
            )
      }

      const handleRegister = () => {
            let message = ''
            if(form.email !== null && form.name !==null && form.password !==null && form.phone !==null && form.address !== null){
                  if(form.password === confirmPassword){
                        setLoading(true)
                        API.register(form).then((res) => {
                              // message = res
                              console.log(res);
                              message= 'registrai berhasil'
                              alert(message)
                              setForm({
                                    register : dateRegister(),
                                    email : null,
                                    name : null,
                                    password : null,
                                    phone : null,
                                    address : null
                              })
                              setLoading(false)
                               history.push(`landing/Register berhasil/login`)
                        }).catch((e) => {
                              // message ='resgitrasi gagal';
                              // message = JSON.parse(e.request.response)
                              let error = JSON.parse(e.request.response);
                              // 
                              message = error.message;
                              console.log(message);
                              alert(message)
                              setLoading(false)

                        })
                  }else{
                        message = 'password tidak sama'
                        alert(message)
                  }
            }else{
                  message ='mohon lengkapi data diri anda'
                  alert(message)
            }
            // console.log(form);
      }

      if(loading ){
            return (
                  <Spinner/>
            )
      }

      return (
            <Fragment>
                  <Header/>
                   <div className='container wrapper-login'>
                        <div className='d-flex justify-content-center'>
                              <div className='col-12 col-md-7 box-register'>
                                    <div className='mb-4'>
                                          <div className='text-center'>
                                                <h2>Register Usadha Bakthi</h2>
                                                <hr className='hr-global' />
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" onChange={(value) => onChangeForm('email', value.target.value)}/>
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput2" className="form-label">Name</label>
                                                <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="Your name" onChange={(value) => onChangeForm('name', value.target.value)}/>
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput3" className="form-label">Password</label>
                                                <input type="password" className="form-control" id="exampleFormControlInput3" placeholder="******" onChange={(value) => onChangeForm('password', value.target.value)}/>
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput4" className="form-label">Confirm Password</label>
                                                <input type="password" className="form-control" id="exampleFormControlInput4" placeholder="******" onChange={(value) => setConfirmPassword(value.target.value)}/>
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput5" className="form-label">Phone number</label>
                                                <input type="number" className="form-control" id="exampleFormControlInput5" placeholder="082xxxxx" onChange={(value) => onChangeForm('phone', value.target.value)}/>
                                          </div>
                                          <div className="mb-3">
                                          <label htmlFor="exampleFormControlTextarea6" className="form-label">Address</label>
                                          <textarea className="form-control" id="exampleFormControlTextarea6" rows="3" onChange={(value) => onChangeForm('address', value.target.value)}></textarea>
                                          </div>
                                         <div className='row container m-0 p-0 justify-content-center'>
                                                <button type='submit' className='btn-login ' onClick={handleRegister}>
                                                      Register
                                                </button>
                                                <button type='button text-center' className='btn btn-link btn-small w-100'>
                                                      <Link to="/login">Login</Link>
                                                </button>
                                         </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <Footer/>
            </Fragment>
      )
}



export default (Register)
