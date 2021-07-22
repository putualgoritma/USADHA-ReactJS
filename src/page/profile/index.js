import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { Activasi, Spinner, Profile } from '../../component'

function BaseProfile() {
      const history = useHistory()
      const [USER, setUSER] = useState(null);
      const [TOKEN, setTOKEN] = useState(null);
      const [loading, setLoading] = useState(true)

      useEffect( () => {
            let isAmounted = false
            if(!isAmounted) { 
                  Promise.all([getUSER(), getTOKEN()]).then((res) => {
                     setLoading(false)
                  }).catch((e) => setLoading(false));
           }
            return () => {
                  isAmounted = true;
            }
      }, [])

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

      
      if(loading){
            return (
                  <Spinner/>
            )
      }

      return (
            <div>
                  {/* <Profile/> */}
                  {/* <Activasi/> */}
                  {USER.status === 'active'?  (<Profile/>) :  (<Activasi/>)}
            </div>
      )
}

export default BaseProfile
