import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

export const useSpecialEvent = () => {
    const [employees, setEmployees] = useState([]);
    const [fileName, setFileName] = useState('');

    const parseFileContent = (content) => {
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
        const parsedEmployees = lines.map((line, index) => {
            const [fullName, cedula, management] = line.split(',').map(field => field.trim());

            if (!fullName || !cedula || !management) {
                console.warn(`Línea ${index + 1} ignorada por formato incorrecto: ${line}`);
                return null;
            }

            return {
                fullName,
                cedula,
                management,
                almuerzo: true, // Por defecto, el almuerzo está incluido en eventos especiales
                para_llevar: false,
                cubiertos: false,
                id_autorizado: null,
                evento_especial: true, // Todos son de evento especial
            };
        }).filter(Boolean); // Filtrar líneas nulas o con formato incorrecto

        return parsedEmployees;
    };

    const handleFileLoad = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const parsed = parseFileContent(content);
                if (parsed.length === 0) {
                    throw new Error('El archivo está vacío o no contiene datos en el formato esperado.');
                }
                setEmployees(parsed);
                Swal.fire('Éxito', `Se cargaron ${parsed.length} empleados desde ${file.name}.`, 'success');
            } catch (error) {
                Swal.fire('Error al procesar el archivo', error.message, 'error');
                setEmployees([]);
                setFileName('');
            }
        };

        reader.onerror = () => {
            Swal.fire('Error', 'No se pudo leer el archivo.', 'error');
            setEmployees([]);
            setFileName('');
        };

        reader.readAsText(file, 'UTF-8');
    }, []);

    const clearEmployees = useCallback(() => {
        setEmployees([]);
        setFileName('');
    }, []);

    return {
        employees,
        fileName,
        handleFileLoad,
        clearEmployees,
        setEmployees, // Exponemos para manipulación directa en la tabla
    };
};
