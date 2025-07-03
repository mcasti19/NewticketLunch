import React from 'react'
import {useAuthStore} from '../store/authStore';

export const HeaderTitle = () => {

    const {user} = useAuthStore();


    return (
        <div className='text-white flex flex-col justify-end items-center'>
            <h2>BIENVENIDO A TICKETLUNCH</h2>
            {
                user && <h3 className='font-black'>{user.name}</h3>
            }

        </div>
    )
}
