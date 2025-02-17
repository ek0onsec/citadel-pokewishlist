'use client';
import { useEffect, useState } from 'react';
import { fetchPokemonList } from '../services/pokemon';
import { getTypeColor } from '../utils/typeColors';
import Loader from '@/components/Loader'; // Import du Loader

export default function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [hoveredPokemon, setHoveredPokemon] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Nouvel état pour gérer le chargement

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Définir le chargement à true au début
            try {
                const data = await fetchPokemonList();
                setPokemons(data);
            } finally {
                setIsLoading(false); // Définir le chargement à false une fois les données chargées
            }

            const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            setWishlist(storedWishlist);
        };

        fetchData();
    }, []);

    const toggleWishlist = (pokemon) => {
        let updatedWishlist;
        if (wishlist.some((p) => p.name === pokemon.name)) {
            updatedWishlist = wishlist.filter((p) => p.name !== pokemon.name);
        } else {
            updatedWishlist = [...wishlist, pokemon];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    return (
        <div className="container mx-auto px-4">
            <h1>Pokédex National</h1>
            {isLoading ? (
                <Loader /> // Afficher le Loader pendant le chargement
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {pokemons.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition"
                        >
                            {/* Image */}
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                                alt={pokemon.name}
                                className="w-full mx-auto"
                            />

                            {/* Nom et Numéro */}
                            <h3 className="text-center capitalize font-bold text-gray-700 mt-2">
                                #{pokemon.id} {pokemon.name}
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
