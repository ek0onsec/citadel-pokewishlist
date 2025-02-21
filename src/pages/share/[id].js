// src/pages/share/[id].js
'use client';
import {useEffect, useRef, useState} from 'react';
import { useRouter } from 'next/router';
import { getTypeColor } from '../../utils/typeColors';
import * as htmlToImage from "html-to-image";

export default function SharedWishlist() {
    const router = useRouter();
    const { id } = router.query; // Correctly accesses the 'id' parameter
    const [wishlist, setWishlist] = useState(null);
    const [shinyStates, setShinyStates] = useState({});
    const wishlistRef = useRef(null);

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

    const exportToImage = () => {
        const element = wishlistRef.current;

        // Définir la hauteur d'une carte Pokémon
        const cardHeight = 280;

        // Nombre de colonnes (7 Pokémon par ligne)
        const numColumns = 7;

        // Calculer le nombre de lignes nécessaires
        const numRows = Math.ceil(wishlist.length / numColumns);

        // Hauteur du pied de page
        const footerHeight = 40;

        // Calculer la hauteur totale du contenu
        const contentHeight = numRows * cardHeight;

        // Calculer la hauteur totale de l'élément à capturer (contenu + pied de page)
        const totalHeight = contentHeight + footerHeight;

        // Créer le pied de page dynamiquement
        const footer = document.createElement('div');
        footer.className = "w-full text-center py-2 bg-gray-100 text-xs text-gray-600 flex items-center justify-center";
        footer.style.minHeight = `${footerHeight}px`; // Hauteur minimale du pied de page
        footer.innerHTML = `
          <img src="/logo.png" alt="Citadel Logo" class="h-5 w-auto mr-1" />
          <span>Fait sur Citadel - PokeWishlist</span>
        `;

        // Ajouter le pied de page à l'élément
        element.appendChild(footer);

        // Définir la hauteur totale de l'élément
        element.style.height = `${totalHeight}px`;

        htmlToImage.toJpeg(element, { quality: 0.95, backgroundColor: '#F3F4F6', height: totalHeight })
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'pokewishlist.jpg';
                link.href = dataUrl;
                link.click();

                // Retirer le pied de page après le téléchargement
                element.removeChild(footer);

                // Réinitialiser la hauteur de l'élément
                element.style.height = '';
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);

                // Retirer le pied de page même en cas d'erreur
                element.removeChild(footer);

                // Réinitialiser la hauteur de l'élément
                element.style.height = '';
            });
    };

    if (!wishlist) {
        return <div className="container mx-auto px-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <h1>Wishlist partagée</h1>

            <div className="flex justify-end mb-4">
                <button
                    onClick={exportToImage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                    Exporter en JPG
                </button>
            </div>
            {wishlist.length === 0 ? (
                <p className="text-center text-gray-600 mt-6">Cette wishlist est vide ou n'existe pas.</p>
            ) : (
                <div ref={wishlistRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
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
