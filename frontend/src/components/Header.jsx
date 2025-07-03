import React from 'react'
import {HeaderLogo} from './HeaderLogo'
import {HeaderTitle} from './HeaderTitle'
import {HeaderExit} from './HeaderExit'
import {TableNav} from './TableNav'

export const Header = () => {



    return (
        <div className='h-24  flex justify-around items-center mt-4'>
            <TableNav />
        </div>
    )
}
