// src/pages/index.js
'use client';
import { useEffect, useState } from 'react';
import { fetchPokemonList } from '../services/pokemon';
import { getTypeColor } from '../utils/typeColors';
import Loader from '@/components/Loader';

export default function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [hoveredPokemon, setHoveredPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [shinyStates, setShinyStates] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchPokemonList();
                setPokemons(data);
                setFilteredPokemons(data);
            } finally {
                setIsLoading(false);
            }

            const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishlist(storedWishlist);
        };

        fetchData();
    }, []);

    // Load shiny states from localStorage on component mount
    useEffect(() => {
        const storedShinyStates = JSON.parse(localStorage.getItem('shinyStates')) || {};
        setShinyStates(storedShinyStates);
    }, []);

    // Save shiny states to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('shinyStates', JSON.stringify(shinyStates));
    }, [shinyStates]);

    const toggleWishlist = (pokemon) => {
        let updatedWishlist;
        if (wishlist.some((p) => p.name === pokemon.name)) {
            updatedWishlist = wishlist.filter((p) => p.name !== pokemon.name);
        } else {
            // Store the shiny state when adding to wishlist
            const shiny = shinyStates[pokemon.id] || false;
            updatedWishlist = [...wishlist, { ...pokemon, shiny }];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term === '') {
            setFilteredPokemons(pokemons);
            return;
        }

        let filtered = [];
        if (term.startsWith('#')) {
            const number = parseInt(term.slice(1));
            if (!isNaN(number)) {
                filtered = pokemons.filter(pokemon => pokemon.id === number);
            }
        } else {
            filtered = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(term.toLowerCase()));
        }

        setFilteredPokemons(filtered);
    };

    const toggleShiny = (pokemon) => {
        setShinyStates(prevState => ({
            ...prevState,
            [pokemon.id]: !prevState[pokemon.id],
        }));
    };

    return (
        <div className="container mx-auto px-4">
            <h1>Pokédex National</h1>

            {/* Barre de recherche */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou #numéro"
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {filteredPokemons.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition"
                        >
                            {/* Afficher le bouton Shiny en haut à gauche */}
                            <button
                                onClick={() => toggleShiny(pokemon)}
                                className="absolute top-2 left-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 z-10"
                            >
                                ✨
                            </button>

                            {/* Image */}
                            <img
                                src={
                                    shinyStates[pokemon.id]
                                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`
                                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                                }
                                alt={pokemon.name}
                                className="w-full mx-auto"
                            />

                            {/* Nom et Numéro */}
                            <h3 className="text-center capitalize font-bold text-gray-700 mt-2">
                                #{pokemon.id} {pokemon.name} {shinyStates[pokemon.id] ? '⭐' : ''}
                            </h3>

                            {/* Types */}
                            <div className="flex justify-center gap-2 mt-2">
                                {pokemon.types && pokemon.types.map((type, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-[2px] text-xs font-semibold text-white rounded ${getTypeColor(
                                            type.toLowerCase()
                                        )}`}
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>

                            {/* Bouton Wishlist */}
                            <button
                                onClick={() => toggleWishlist(pokemon)}
                                className="absolute top-3 right-3"
                            >
                                {wishlist.some((p) => p.name === pokemon.name) ? (
                                    <img
                                        src={hoveredPokemon === pokemon.name ? "/icons/heart-gray.svg" : "/icons/heart-red.svg"}
                                        alt="Red Heart"
                                        className="h-6 w-6 cursor-pointer"
                                        onMouseEnter={() => setHoveredPokemon(pokemon.name)}
                                        onMouseLeave={() => setHoveredPokemon(null)}
                                    />
                                ) : (
                                    <img
                                        src={hoveredPokemon === pokemon.name ? "/icons/heart-red.svg" : "/icons/heart-gray.svg"}
                                        alt="Gray Heart"
                                        className="h-6 w-6 cursor-pointer"
                                        onMouseEnter={() => setHoveredPokemon(pokemon.name)}
                                        onMouseLeave={() => setHoveredPokemon(null)}
                                    />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
