import {use, useEffect, useState} from 'react';
import {getMenu, getUsers} from "../services/actions";
import {NoMenu} from './NoMenu';
import {Spinner} from './Spinner';

export const ContentMenu = () => {
  const [ menuDia, setMenuDia ] = useState( [] );
  const [ isLoading, setIsLoading ] = useState( true );

  // const day = new Date().getDate();
  // const month = new Date().getMonth() + 1;

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString( 'es-ES', {month: 'long'} ); // Ejemplo: "septiembre"

  const maxMenu = 5;

  useEffect( () => {
    getUsers()

  }, [] )

  useEffect( () => {
    const fetchMenu = async () => {
      setIsLoading( true );
      try {
        const data = await getMenu();
        setMenuDia( Array.isArray( data ) ? data : [] );
      } catch ( error ) {
        console.error( "Error al obtener el menú:", error );
        setMenuDia( [] );
      } finally {
        setIsLoading( false );
      }
    };
    fetchMenu();
  }, [] );


  if ( isLoading ) {
    return <Spinner text="Cargando menú..." />;
  }


  if ( menuDia.length === 0 ) {
    return (
      <div className="flex flex-col items-center justify-center w-full text-center h-full border-0">
        <h1 className="text-3xl md:text-4xl font-extrabold dark:text-red-700 text-blue-700 mb-4 tracking-tight drop-shadow">Menú de hoy: <span className="text-gray-800 dark:text-amber-50">{day} de {month}</span></h1>
        <NoMenu />
      </div>
    );
  }


  return (
    <>
      <div className="flex flex-col items-center justify-center w-full text-center gap-5">
        <h1 className="text-3xl md:text-4xl font-extrabold dark:text-red-700 text-blue-700 mb-1 tracking-tight drop-shadow">Menú de hoy: <span className="text-gray-800 dark:text-amber-50">{day} de {month}</span></h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-amber-50">Tasa del día: <span className="text-amber-500  rounded-2xl px-2 py-1 ml-1 font-bold shadow">Bs 119,67</span></h2>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 md:gap-2 items-center border-0 border-amber-300 lg:w-full lg:justify-between"> */}
      <div className="flex flex-col lg:flex-row md:gap-2 items-center border-0 border-amber-300 lg:w-full lg:justify-between">

        <div className="flex flex-col gap-2 items-center justify-center grow border-0">
          <picture className="w-full border-0 flex justify-center items-center">
            <source srcSet="/comedor3.jpg" media="(min-width: 768px)" />
            <img src="/comedor2.jpg" alt="Descripción de la imagen" className="rounded-3xl md:w-[35vw] shadow-lg border-0 border-blue-800 object-contain" />
          </picture>
        </div>

        <div className="flex flex-wrap justify-center w-full gap-6 border-0">
          {
            menuDia.slice( 0, maxMenu ).map( ( item ) => (
              <div key={item.id_menu} className="flex flex-col w-full sm:w-2/5 md:min-h-48 bg-white/90 rounded-sm shadow-md border-0 border-blue-100 p-4 hover:shadow-xl transition-all dark:bg-slate-900">
                <h1 className="text-[clamp(1rem,2.5vw,2rem)] font-bold text-blue-600 mb-2 tracking-wide dark:text-red-600">
                  {item.food_category}
                </h1>
                <ul className="list-disc list-inside space-y-1">
                  {item.name_ingredient.split( ',' ).map( ( ingredient, idx ) => (
                    <li key={idx} className="text-gray-800 dark:text-white text-[clamp(0.9rem,2vw,1.5rem)] font-medium pl-2">
                      {ingredient.charAt( 0 ).toUpperCase() + ingredient.slice( 1 ).trim()}
                    </li>
                  ) )}
                </ul>
              </div>
            ) )
          }
        </div>
      </div>
      <div className="mt-8">
        <h1 className="text-center text-3xl md:text-4xl text-red-700 font-extrabold py-3">¡Buen Provecho!</h1>
      </div>
    </>
  );
};