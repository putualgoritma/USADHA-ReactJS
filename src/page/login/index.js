import React, { Fragment, useState} from 'react'
import API from '../../services'
import { Link, useHistory} from 'react-router-dom'
import { Footer, Header, Spinner } from '../../component'
function Login(props) {
      const [loading, setLoading] = useState(false);
      const history = useHistory()
      const [form, setForm] = useState({
            email: null,
            password: null,
            id_onesignal : null
      })

      // cahnge form
      const onChangeForm = (name, value) => {
            setForm(
                 { ...form,
                  [name] : value}
            )
      }

      const setUSER = async (data) => {   
            let setData =  await  sessionStorage.setItem('USER', JSON.stringify(data));
      }

      const setTOKEN = async (data) => {
            let setData =  await  sessionStorage.setItem('TOKEN', JSON.stringify(data));
      }

      // aksi login
      const handleLogin = () => {
            if(form.email !==null && form.password !==null){
                  setLoading(true)
                  API.login(form).then(result => {
                        setUSER(result.user)
                        setTOKEN(result.token.token);
                        setForm({
                              email:null,
                              password:null,
                              id_onesignal:null
                        })
                        setLoading(false)
                        history.push("/");
                  }).catch((e) => {
                        console.log(e.request);
                        alert('login gagal')
                        setLoading(false)

                  })
            }else{
                  alert('mohon isi data dengan benar')
            }
      }

      // spinner
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
                              <div className='col-12 col-md-8 box-login'>
                                    <div className='p-4'>
                                          <div className='text-center'>
                                                <h2>Login Usadha Bakthi</h2>
                                                <hr className='hr-global'/>
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="examplehtmlForntrolInput1" className="form-label">Email address</label>
                                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" onChange={(value) => onChangeForm('email', value.target.value)}/>
                                          </div>
                                          <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput2" className="form-label">password</label>
                                                <input type="password" className="form-control" id="exampleFormControlInput2" placeholder="******" onChange={(value) => onChangeForm('password', value.target.value)}/>
                                          </div>
                                         <div className='row container m-0 p-0 text justify-content-center'>
                                                <button type='submit' className='0 btn-login' onClick={() => {handleLogin()}}>
                                                      Login
                                                </button>
                                                <button type='button' className='btn btn-link btn-small w-100 text-center'>
                                                      <Link to="/register">Regsiter</Link>
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


export default (Login)
