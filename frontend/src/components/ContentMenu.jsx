import {useEffect} from 'react';
import {useState} from 'react'
import almuerzos from '../data/mockDataMenu.json';
import {ContentHeader} from './ContentHeader';
// import {useTasaDia} from '../hooks/useTasaDia';
import {getMenu} from "../services/actions";

export const ContentMenu = () => {
  // const {tasaDia} = useTasaDia();
  const [ menuDia, setMenuDia ] = useState( {} );

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;

  // const {
  //   data,
  //   error,
  //   isLoading,
  // } = useTasaDia();

  //  const tasaDia = 119.67;
  const isLoading = false;

  // const offsetTop = 300; // ejemplo, cambia este valor según tu layout

  useEffect( () => {
    if ( !almuerzos ) {
      return null
    }
    setMenuDia( almuerzos );
    // console.log( "MENU DEL DIA: ", data );
  }, [] );

  useEffect( () => {
    getMenu()

  }, [] )


  return (
    <>
      {isLoading && <p>Cargando...</p>}
      {/* {error && <p>Error: {error.message}</p>} */}
      <div className="flex flex-col items-center justify-center w-full text-center gap-5 max-h-screen">
        <h1 className="text-3xl md:text-4xl font-extrabold dark:text-red-700 text-blue-700 mb-1 tracking-tight drop-shadow">Menú de hoy: <span className="text-gray-800 dark:text-amber-50">{day} de {month}</span></h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-amber-50">Tasa del día: <span className="text-amber-500  rounded-2xl px-2 py-1 ml-1 font-bold shadow">Bs 119,67</span></h2>
      </div>

      {/* <ContentHeader title={"Menu"} /> */}

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-2 items-center border-0 border-amber-300 lg:w-full lg:justify-between">
        <div className="flex flex-col gap-2 items-center justify-center grow border-0">
          <picture className="w-full   border-0 flex justify-center items-center">
            <source srcSet="/comedor3.jpg" media="(min-width: 768px)" />
            <img src="/comedor2.jpg" alt="Descripción de la imagen" className="rounded-3xl md:w-[25vw] shadow-lg border-0 border-blue-800 object-contain" />
          </picture>
        </div>
        {Object.keys( menuDia ).length > 0 ? (
          <div className="grid md:col-span-2 grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {Object.entries( menuDia ).map( ( [ category, value ] ) => (
              <div key={category} className="flex flex-col bg-white/90 rounded-2xl shadow-md border border-blue-100 p-4 hover:shadow-xl transition-all dark:bg-slate-900">
                <h1 className="text-xl  font-bold text-blue-600 mb-2 tracking-wide dark:text-red-600  ">{category.charAt( 0 ).toUpperCase() + category.slice( 1 )}</h1>
                {Array.isArray( value ) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {value.map( ( item, index ) => (
                      <li key={index} className="text-gray-800 dark:text-white text-base md:text-lg font-medium pl-2">{item.nombre}</li>
                    ) )}
                  </ul>
                ) : (
                  <span className="text-gray-700 dark:text-white  text-base md:text-lg font-medium">{value.nombre}</span>
                )}
              </div>
            ) )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-32">
            <span className="text-lg text-blue-600 animate-pulse">Cargando menú...</span>
          </div>
        )}
      </div>
      <div className="mt-8">
        <h1 className="text-center text-3xl md:text-4xl text-red-700  font-extrabold py-3">¡Buen Provecho!</h1>
      </div>

    </>
  )
}