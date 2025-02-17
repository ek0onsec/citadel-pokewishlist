'use client';
import { useEffect, useState, useRef } from 'react';
import { getTypeColor } from '../utils/typeColors';
import * as htmlToImage from 'html-to-image';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const wishlistRef = useRef(null);
    const [hoveredPokemon, setHoveredPokemon] = useState(null);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(storedWishlist);
    }, []);

    const removeFromWishlist = (pokemon) => {
        const updatedWishlist = wishlist.filter((p) => p.name !== pokemon.name);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const exportToImage = () => {
        const element = wishlistRef.current;

        // Calculer la hauteur dynamique du conteneur
        const numRows = Math.ceil(wishlist.length / 7); // 7 Pokémon par ligne
        const rowHeight = 200; // Hauteur approximative d'une ligne (à ajuster selon votre design)
        const footerHeight = 30; // Hauteur du pied de page
        const dynamicHeight = numRows * rowHeight + footerHeight;

        // Appliquer une hauteur maximale au conteneur pour éviter d'exporter trop d'espace vide
        element.style.maxHeight = `${dynamicHeight}px`;
        element.style.overflow = 'hidden';

        // Créer le pied de page dynamiquement
        const footer = document.createElement('div');
        footer.className = "w-full text-center py-1 bg-gray-100 text-xs text-gray-600 flex items-center justify-center";
        footer.style.minHeight = '30px'; // Hauteur minimale du pied de page
        footer.innerHTML = `
      <img src="/logo.png" alt="Citadel Logo" class="h-5 w-auto mr-1" />
      <span>Fait sur Citadel - PokeWishlist</span>
    `;

        // Insérer le pied de page avant de capturer l'image
        element.appendChild(footer);

        htmlToImage.toJpeg(element, { quality: 0.95, backgroundColor: '#F3F4F6', height: dynamicHeight })
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'pokewishlist.jpg';
                link.href = dataUrl;
                link.click();

                // Retirer le pied de page après le téléchargement
                element.removeChild(footer);
                element.style.maxHeight = null; // Réinitialiser la hauteur maximale
                element.style.overflow = null; // Réinitialiser l'overflow
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
                // Assurez-vous de retirer le pied de page même en cas d'erreur
                element.removeChild(footer);
                element.style.maxHeight = null; // Réinitialiser la hauteur maximale
                element.style.overflow = null; // Réinitialiser l'overflow
            });
    };

    return (
        <div className="container mx-auto px-4">
            <h1>Ma Wishlist</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={exportToImage}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Exporter la Wishlist
                </button>
            </div>
            {wishlist.length === 0 ? (
                <p className="text-center text-gray-600 mt-6">Votre wishlist est vide.</p>
            ) : (
                <div ref={wishlistRef} className="relative" style={{ overflow: 'hidden' }}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                        {wishlist.map((pokemon) => (
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
                                    onClick={() => removeFromWishlist(pokemon)}
                                    className="absolute top-3 right-3"
                                >
                                    <img
                                        src={hoveredPokemon === pokemon.name ? "/icons/heart-gray.svg" : "/icons/heart-red.svg"}
                                        alt="Red Heart"
                                        className="h-6 w-6 cursor-pointer"
                                        onMouseEnter={() => setHoveredPokemon(pokemon.name)}
                                        onMouseLeave={() => setHoveredPokemon(null)}
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
