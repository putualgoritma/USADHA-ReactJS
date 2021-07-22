import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { profile } from '../../assets'
import { Footer, Header, Spinner } from '../../component'
import API from '../../services'
import { Source } from '../../services/Config'

function Agen() {
      const [loading, setLoading] = useState(true)
      const [agen, setAgen] = useState(null)
      const history = useHistory()
      const [select, setSelect] = useState(null)

      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) {
                  Promise.all([API.agents()])
                  .then(result => {
                        // getUSER()
                        // getCART()
                        // setProduct(result[0].data)
                        setAgen(result[0].data)
                        setLoading(false)
                  }).catch((e) => {
                        console.log(e.request)
                        setLoading(false)
                  })
           }
            return () => {
                  Source.cancel('cancel axios')
                  isAmounted = true
            }
      }, [])

      
      if(loading){
            console.log(agen);
            return (
                  <Spinner/>
            )
      }

      return (
            <div>
                  <Header/>
                        <section className='section-agent mb-4'>
                              <div className='header-agent container-fluid mb-5'>
                                    <h3>Pilih Agen</h3>
                                    <hr />
                              </div>
                              <div className='wrapper-item-agen container'>
                                    <div className='row  justify-content-center'>
                                        {agen.map((item) => {
                                              return (
                                                <div className='col-6 col-md-4' key={item.id} onClick={() => setSelect(item.id)}>
                                                      <div className='box-item-agent p-4'  style={{backgroundColor : (select !=null && select == item.id ? '#F3C242' :'')}}>
                                                      <div className='text-center'>
                                                            <img src={profile} alt='foto-agent'/>
                                                      </div>
                                                            <p>{item.name}</p>
                                                            <p>{item.email}</p>
                                                            <p>{item.phone}</p>
                                                      </div>
                                                </div>
                                              )
                                        })}
                                    </div>
                                    <div className='text-center'>
                                          {/* <button onClick={() => history.push("/checkout/" + item.id)}>Pilih Agen</button> */}
                                          <button  onClick={() => history.push("/checkout/" + select)} >Pilih Agen</button>
                                    </div>
                              </div>
                        </section>
                  <Footer/>
            </div>
      )
}

export default Agen
