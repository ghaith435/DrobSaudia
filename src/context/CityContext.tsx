'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City, CITIES_DATA, getCityById } from '@/data/cities';

interface CityContextType {
    selectedCity: City;
    setSelectedCity: (city: City) => void;
    cities: City[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
    const [selectedCity, setSelectedCityState] = useState<City>(CITIES_DATA[0]);

    useEffect(() => {
        // Load saved city from localStorage
        const savedCityId = localStorage.getItem('selectedCity');
        if (savedCityId) {
            const city = getCityById(savedCityId);
            if (city) {
                setSelectedCityState(city);
            }
        }
    }, []);

    const setSelectedCity = (city: City) => {
        setSelectedCityState(city);
        localStorage.setItem('selectedCity', city.id);
        // Dispatch custom event for components that need to react to city changes
        window.dispatchEvent(new CustomEvent('cityChanged', { detail: city }));
    };

    return (
        <CityContext.Provider value={{ selectedCity, setSelectedCity, cities: CITIES_DATA }}>
            {children}
        </CityContext.Provider>
    );
}

export function useCity() {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
}

export { CityContext };
