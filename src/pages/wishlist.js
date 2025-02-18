// src/pages/wishlist.js
'use client';
import { useEffect, useState, useRef } from 'react';
import { getTypeColor } from '../utils/typeColors';
import * as htmlToImage from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const wishlistRef = useRef(null);
    const [shinyStates, setShinyStates] = useState({});
    const [shareLink, setShareLink] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(storedWishlist);
    }, []);

    useEffect(() => {
        // Load shiny states from localStorage
        const storedShinyStates = JSON.parse(localStorage.getItem('shinyStates')) || {};
        setShinyStates(storedShinyStates);
    }, []);

    useEffect(() => {
        // Save shiny states to localStorage
        localStorage.setItem('shinyStates', JSON.stringify(shinyStates));
    }, [shinyStates]);

    const removeFromWishlist = (pokemon) => {
        const updatedWishlist = wishlist.filter((p) => p.name !== pokemon.name);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    // Function to toggle shiny state in Wishlist
    const toggleShiny = (pokemon) => {
        // Toggle shiny state locally
        setShinyStates(prevShinyStates => {
            const updatedShinyStates = {
                ...prevShinyStates,
                [pokemon.id]: !(prevShinyStates[pokemon.id] || false) // Toggle based on current state, default to false if undefined
            };
            localStorage.setItem('shinyStates', JSON.stringify(updatedShinyStates)); // Sync to local storage

            return updatedShinyStates;
        });
    };

    // Function to generate and share wishlist link
    const generateShareLink = async () => {
        const wishlistId = uuidv4(); // Generate unique ID
        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wishlistId: wishlistId, pokemons: wishlist }),
            });

            if (response.ok) {
                const baseUrl = window.location.origin; // Dynamically get the base URL
                const link = `${baseUrl}/share/${wishlistId}`;
                setShareLink(link);
            } else {
                console.error('Failed to save wishlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    };

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

    return (
        <div className="container mx-auto px-4">
            <h1>Ma Wishlist</h1>

            <div className="flex justify-end mb-4">
                <button
                    onClick={exportToImage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                    Exporter en JPG
                </button>
                <button
                    onClick={generateShareLink}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Générer un lien de partage
                </button>
            </div>

            {shareLink && (
                <div className="mb-4">
                    <p>Lien de partage :</p>
                    <a href={shareLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">{shareLink}</a>
                </div>
            )}

            {wishlist.length === 0 && isMounted ? (
                <p className="text-center text-gray-600 mt-6">Votre wishlist est vide.</p>
            ) : (
                <div ref={wishlistRef} className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                        {wishlist.map((pokemon) => (
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
                                    onClick={() => removeFromWishlist(pokemon)}
                                    className="absolute top-3 right-3"
                                >
                                    <img
                                        src={'/icons/heart-red.svg'}
                                        alt="Red Heart"
                                        className="h-6 w-6 cursor-pointer"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
