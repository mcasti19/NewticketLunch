import React from 'react'
import {getemployees} from "../services/actions";

export const useGetData = async () => {

    const employees = await getemployees();
    console.log( employees );



    return {employees}
}
