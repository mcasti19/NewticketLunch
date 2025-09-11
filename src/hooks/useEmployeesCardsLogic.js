import { useState, useEffect, useMemo, useCallback } from 'react';

export function useEmployeesCardsLogic(employeeList) {
    const [search, setSearch] = useState('');
    const [itemsToShow, setItemsToShow] = useState(5);
    const [loading, setLoading] = useState(false);

    const filteredEmployees = useMemo(() => {
        if (!search) return employeeList;
        const s = search.trim().toLowerCase();
        return employeeList.filter(emp =>
            (emp.first_name && emp.first_name.toLowerCase().includes(s)) ||
            (emp.last_name && emp.last_name.toLowerCase().includes(s))
        );
    }, [employeeList, search]);

    const employeesToDisplay = useMemo(() => {
        return filteredEmployees.slice(0, itemsToShow);
    }, [filteredEmployees, itemsToShow]);

    useEffect(() => {
        const observer = new window.IntersectionObserver(entries => {
            if (
                entries[0].isIntersecting &&
                employeesToDisplay.length < filteredEmployees.length &&
                !loading
            ) {
                setLoading(true);
                setTimeout(() => {
                    setItemsToShow(prev => prev + 5);
                    setLoading(false);
                }, 1000);
            }
        }, { threshold: 1 });

        const sentinel = document.querySelector('#sentinel');
        if (sentinel) observer.observe(sentinel);
        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [employeesToDisplay, filteredEmployees.length, loading]);

    const handleSearchChange = useCallback(e => {
        setSearch(e.target.value);
        setItemsToShow(5);
    }, []);

    return {
        search,
        setSearch,
        itemsToShow,
        setItemsToShow,
        loading,
        filteredEmployees,
        employeesToDisplay,
        handleSearchChange,
    };
}
