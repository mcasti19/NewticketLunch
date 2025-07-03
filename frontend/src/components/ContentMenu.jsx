import {useEffect} from 'react';
import {useState} from 'react'
import almuerzos from '../data/mockDataMenu.json';
import {useTasaDia} from '../hooks/useTasaDia';

export const ContentMenu = () => {
  // const {tasaDia} = useTasaDia();
  const [ menuDia, setMenuDia ] = useState( {} );

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;

  const {
    data,
    error,
    isLoading,
  } = useTasaDia();

  // const offsetTop = 300; // ejemplo, cambia este valor según tu layout

  useEffect( () => {
    if ( !almuerzos ) {
      return null
    }
    setMenuDia( almuerzos );
    // console.log( "MENU DEL DIA: ", data );
  }, [ data ] );

  return (
    <>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className='border-0 w-full flex flex-col gap-5 h-full dark:bg-gray-950 rounded-4xl p-5 '
      // style={{height: `calc(100vh - ${ offsetTop }px)`}}
      >

        <div className='flex flex-col items-center w-full'>
          <h1 className='text-3xl font-black'>Menu de hoy: {day} de {month}</h1>
          <h1 className='text-2xl'>Tasa del día:  <strong className='text-amber-400 bg-black rounded-2xl px-2'>Bs {data}</strong></h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className=' flex flex-col gap-5 items-center  justify-center grow'>
            <picture className=''>
              <img src="/comedor.jpg" alt="Descripción de la imagen" className='rounded-3xl' />
            </picture>
            {/* <picture className='self-start'>
              <img src="/descarga.jpeg" alt="Descripción de la imagen" className='rounded-3xl' />
            </picture> */}

          </div>
          {data && Object.keys( menuDia ).length > 0
            ? (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-2 w-full  border-0 border-slate-800 rounded-2xl p-3'>
                {Object.entries( menuDia ).map( ( [ category, value ] ) => (
                  <div key={category} className="flex flex-col  rounded-t-md border-0">
                    <h1 className="text-2xl font-black text-red-600">{category.charAt( 0 ).toUpperCase() + category.slice( 1 )}</h1>
                    {Array.isArray( value ) ? (
                      <ul>
                        {value.map( ( item, index ) => (
                          <li key={index} className='text-left'>{item.nombre}</li>
                        ) )}
                      </ul>
                    ) : (
                      <span>{value.nombre}</span>
                    )}
                  </div>
                ) )}
              </div>
            ) : ( <h1>Cargando</h1> )
          }
        </div>
        <div><h1 className='text-center text-4xl text-red-700 dark:bg-slate-900 rounded-2xl font-black'>Buen Provecho!!!!</h1></div>
      </div>
    </>
  )
}
