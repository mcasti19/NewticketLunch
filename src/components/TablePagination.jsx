export const TablePagination = ({ table, filteredEmployees }) => {
    if (!table) return null;

    return (
        <div className="hidden md:flex mt-4 flex-col md:flex-row justify-between items-center w-full gap-2">
            <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {table.getRowModel().rows.length} de {filteredEmployees.length} empleados
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
                >
                    Anterior
                </button>
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};