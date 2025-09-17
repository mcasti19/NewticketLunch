import React from 'react';

export const Spinner = ({ text = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
};
