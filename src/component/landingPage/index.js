import React, { Fragment , useEffect, useState} from 'react'
import { useHistory, withRouter } from 'react-router'
import {logoSpinner } from '../../assets'

function LandingPage(props) {
      const history = useHistory()
      const [info, setInfo] = useState(null)
      const [route, setRoute] = useState(null)
      useEffect(() => {
            let isAmounted = false
            if(!isAmounted) {
                  setInfo(props.match.params.info)
                  // setRoute(props.match.params.route)
              setTimeout(function () {
                    history.push(`/${props.match.params.route !== '' ? props.match.params.route : '/'}`)
              }, 2000)
           }
            return () => {
                  isAmounted = true
            }
      }, [])

 

      
      return (
            <Fragment>
                  <section className='d-flex justify-content-center align-content-center align-items-center flex-column' style={{height:'100vh'}}>
                        <img src={logoSpinner} style={{width:100, height:100}}/>
                        <div className='text-center'>
                              <h4>{info}</h4>
                        </div>
                  </section>
            </Fragment>
      )
}

export default withRouter(LandingPage)