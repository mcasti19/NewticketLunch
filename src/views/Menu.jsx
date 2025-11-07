import {NoMenu} from '../components/NoMenu';
import {Spinner} from '../components/Spinner';

// Importamos los custom hooks de TanStack Query
import {useTasaDia} from '../hooks/useTasaDia';
import {useMenu} from '../hooks/useMenu';

// Íconos para la clasificación
import {IoRestaurantOutline, IoFitnessOutline, IoNutritionOutline, IoLeafOutline, IoBeerOutline} from 'react-icons/io5';
import {useBank} from '../hooks/useBanks';


// Función de ayuda para obtener un icono basado en la categoría (Mantenida)
const getCategoryIcon = ( category ) => {
  switch ( category.toLowerCase() ) {
    case 'sopas':
      return <IoRestaurantOutline className="w-6 h-6 mr-2 text-blue-600 dark:text-red-500" />;
    case 'proteinas':
      return <IoFitnessOutline className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />;
    case 'contornos':
      return <IoNutritionOutline className="w-6 h-6 mr-2 text-amber-600 dark:text-amber-400" />;
    case 'postres':
      return <IoLeafOutline className="w-6 h-6 mr-2 text-pink-600 dark:text-pink-400" />;
    case 'bebidas':
    case 'jugos': // Añadido ejemplo de alias
      return <IoBeerOutline className="w-6 h-6 mr-2 text-cyan-600 dark:text-cyan-400" />;
    default:
      return null;
  }
};

export const Menu = () => {

  // --- Lógica (Mantenida sin cambios) ---
  const {
    bcvRate,
    isError: isBcvError,
    isLoading: isBcvLoading,
  } = useTasaDia();

  const {
    menuData,
    isError: isMenuError,
    isLoading: isMenuLoading,
  } = useMenu();

 

  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString( 'es-ES', {month: 'long'} );
  const maxMenu = 6;

  // --- Lógica de Renderizado (Mantenida sin cambios) ---

  if ( isBcvLoading || isMenuLoading ) {
    return <Spinner text="Cargando datos del día..." />;
  }

  if ( isMenuError || !menuData || menuData.length === 0 ) {
    return (
      <div className="flex flex-col items-center justify-center w-full text-center h-full p-8 bg-white/90 dark:bg-slate-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Menú: **{day} de {month}**
        </h1>
        <NoMenu />
        {isMenuError && <p className="mt-4 text-lg text-red-500 font-medium">Error al cargar el menú. Intente de nuevo más tarde.</p>}
      </div>
    );
  }

  // --- 🚀 Renderizado Final con Mejoras de Uso de Espacio 🚀 ---
  return (
    // 💡 CAMBIO CLAVE 1: Eliminamos el 'max-w' en este contenedor para usar casi todo el ancho disponible
    // Usamos 'w-full px-4' para control de padding en pantallas pequeñas
    <div className="flex flex-col items-center w-full px-4 pb-8">

      {/* 1. Encabezado y Tasa del Día */}
      <div className="flex flex-col items-center w-full max-w-7xl pt-4 pb-6"> {/* max-w-7xl para centrar el encabezado si la pantalla es inmensa */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
          Menú de hoy: <span className="font-bold text-blue-700 dark:text-green-500">{day} de {month}</span>
        </h1>

        <div className="mt-2 flex items-center bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-1 shadow-inner">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">
            Tasa BCV:
          </span>
          <span className={`text-lg font-extrabold ${ isBcvError ? 'text-red-500' : 'text-green-600 dark:text-green-400' }`}>
            {isBcvError ? 'Error' : `Bs. ${ bcvRate.toFixed( 2 ) }`}
          </span>
        </div>
      </div>

      {/* 2. Contenido Principal: Imagen y Tarjetas de Menú */}
      {/* 💡 CAMBIO CLAVE 2: Usamos 'max-w-full' y ajustamos el flexbox para que ambos contenedores crezcan */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8">

        {/* Contenedor de Imagen: Ahora ocupa 1/3 del ancho en pantallas grandes (lg:w-1/3) */}
        <div className="lg:w-1/3 flex justify-center items-start pt-2">
          <div className="relative w-full max-w-lg lg:max-w-none"> {/* max-w-lg para no estirar demasiado en móvil/tablet */}
            <picture className="block">
              <source srcSet="/comedor3.jpg" media="(min-width: 768px)" />
              <img
                src="/comedor.webp"
                alt="Vista del autoservicio del comedor"
                className="w-full rounded-2xl shadow-xl object-cover h-auto"
              />
            </picture>
            <p className="mt-2 text-center text-sm font-light text-gray-500 dark:text-gray-400">
              Vista del autoservicio de hoy
            </p>
          </div>
        </div>

        {/* Tarjetas de Menú: Ahora ocupan 2/3 del ancho en pantallas grandes (lg:w-2/3) */}
        {/* 💡 CAMBIO CLAVE 3: Usamos 2 columnas en móvil (sm:grid-cols-2) y hasta 3 en desktop (lg:grid-cols-3) para llenar el espacio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:w-2/3 w-full gap-5">
          {
            menuData.slice( 0, maxMenu ).map( ( item ) => (
              <div key={item.id_menu} className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700">

                {/* Título de la Categoría con Icono (Mantenido) */}
                <div className="flex items-center mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
                  {getCategoryIcon( item.food_category )}
                  <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
                    {item.food_category}
                  </h2>
                </div>

                {/* Lista de Platos/Ingredientes (Mantenido) */}
                <ul className="space-y-2">
                  {item.name_ingredient.split( ',' ).map( ( ingredient, idx ) => (
                    <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300 text-base font-normal">
                      <span className="mr-2 text-blue-500 dark:text-green-500">•</span>
                      <span className="flex-1">{ingredient.charAt( 0 ).toUpperCase() + ingredient.slice( 1 ).trim()}</span>
                    </li>
                  ) )}
                </ul>
              </div>
            ) )}
        </div>
      </div>

      {/* 3. Mensaje Final */}
      <div className="mt-10 mb-4">
        <h1 className="text-center text-4xl md:text-5xl text-red-600 dark:text-red-500 font-black tracking-wider">
          ¡Buen Provecho!
        </h1>
      </div>
    </div>
  );
};
