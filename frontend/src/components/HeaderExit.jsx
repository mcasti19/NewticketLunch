import React from 'react'
import {GiExitDoor} from "react-icons/gi";
import {useNavigate} from 'react-router';
import {useAuthStore} from '../store/authStore';
import {IoMdExit} from "react-icons/io";


export const HeaderExit = ( {className, color} ) => {
    
    const navigate = useNavigate();
    const logout = useAuthStore( ( state ) => state.logout );
    const handleExit = () => {
        logout();
        navigate( '/auth/login' );
        console.log("ME LLEVO AL LOGIN");
    }

    return (
        <div className='flex items-center gap-2'>
            {/* <p className='text-white'>Salir</p> */}
            <IoMdExit onClick={handleExit} color={color} size={30} className={className} />
        </div>
    )
}
