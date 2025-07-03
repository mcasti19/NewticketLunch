import React, {useEffect} from 'react'
import {Header} from '../../components/Header'
import {useAuthStore} from '../../store/authStore'
import {TableNav} from '../../components/TableNav';
import {HeaderLogo} from '../../components/HeaderLogo';


export const Home = () => {

  const {user} = useAuthStore();

  useEffect( () => {
    if ( user )
      console.log( user );
  }, [ user ] )

  return (
    <div className="w-full flex justify-center items-center flex-col gap-10">
      <TableNav />
    </div>
  )
}
