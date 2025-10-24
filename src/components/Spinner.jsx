

export const Spinner = ( {text = 'Cargando...', color = 'blue-700', textColor = 'white'} ) => {
  const spinnerBaseClasses = "w-16 h-16 border-4 border-dashed rounded-full animate-spin";
  const textClasses = `mt-4 text-lg text-gray-700 dark:text-gray-300 text-${ textColor }`;
  const colorClass = `border-${ color }`;

  // Nota: Para que Tailwind detecte todas las clases posibles, es recomendable
  // que los valores por defecto o de uso común estén escritos completamente
  // en el código fuente.

  return (
    <div className="flex flex-col items-center justify-center h-full my-8">
      <div className={`${ spinnerBaseClasses } ${ colorClass }`}></div>
      <p className={textClasses}>{text}</p>
    </div>
  );
};