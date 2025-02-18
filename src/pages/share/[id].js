// src/pages/share/[id].js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getTypeColor } from '../../utils/typeColors';

export default function SharedWishlist() {
    const router = useRouter();
    const { id } = router.query; // Correctly accesses the 'id' parameter
    const [wishlist, setWishlist] = useState(null);
    const [shinyStates, setShinyStates] = useState({});

    useEffect(() => {
        // Load shiny states from localStorage
        const storedShinyStates = JSON.parse(localStorage.getItem('shinyStates')) || {};
        setShinyStates(storedShinyStates);
    }, []);

    useEffect(() => {
        if (id) {
            const fetchWishlist = async () => {
                try {
                    const response = await fetch(`/api/wishlist/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setWishlist(data.pokemons);
                    } else {
                        console.error('Failed to fetch wishlist:', response.statusText);
                        setWishlist([]);
                    }
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                    setWishlist([]);
                }
            };

            fetchWishlist();
        }
    }, [id]);

    if (!wishlist) {
        return <div className="container mx-auto px-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1>Wishlist partagée</h1>
            {wishlist.length === 0 ? (
                <p className="text-center text-gray-600 mt-6">Cette wishlist est vide ou n'existe pas.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {wishlist.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition"
                        >
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
