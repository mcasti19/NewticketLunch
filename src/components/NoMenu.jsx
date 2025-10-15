import React from 'react'

export const NoMenu = () => {
    return (
        <div className='w-[50dvw] flex flex-col justify-center items-center gap-3'>
            {/* <img src="/NoMenu.jpg" alt="No_hay_menu" /> */}
            <img src="/MascotaTriste.png" alt="No_hay_menu" className='w-90 h-90 drop-shadow-[0_4px_8px_rgba(255,220,0,0.9)]' />
            <h1 className="md:col-span-2 text-center text-2xl text-gray-800 dark:text-gray-400 uppercase font-black">No hay menú disponible por hoy</h1>
        </div>
    )
}
