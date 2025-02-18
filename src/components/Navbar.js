// src/components/Navbar.js
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4 text-white relative">
            <div className="container mx-auto flex items-center justify-between">
                {/* Menu burger à gauche (version mobile) */}
                <div className={`md:hidden ${isOpen ? 'order-first' : ''}`}>
                    <button onClick={toggleMenu} className="focus:outline-none z-30">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Logo et nom (version mobile) */}
                <div className={`md:hidden text-center ${isOpen ? 'hidden' : ''}`}>
                    <img src="/logo.png" alt="Logo" className="h-12 w-auto mr-1 inline-block"/>
                    <div className="flex flex-col items-center">
                        <span className="font-bold">Citadel</span>
                        <span className="font-bold">PokeWishlist</span>
                    </div>
                </div>

                {/* Texte au centre (version mobile) */}
                <div
                    className={`md:hidden text-center absolute left-1/2 transform -translate-x-1/2 ${isOpen ? 'hidden' : ''}`}>
                    <div>Fait par 0xChamberlain</div>
                    <div>/pw Citadel</div>
                </div>

                {/* Masque de la navbar (version mobile) */}
                <div className={`md:hidden absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 z-10 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                     onClick={toggleMenu}></div>

                {/* Liens de navigation (version mobile) */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-gray-800 z-20 ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col items-center p-4">
                        <Link href="/" className="hover:text-gray-300 flex items-center mb-2">
                            <img src="/icons/pokedex.svg" alt="Pokédex Icon" className="h-5 w-5 mr-2" />
                            Pokédex
                        </Link>
                        <Link href="/wishlist" className="hover:text-gray-300 flex items-center">
                            <img src="/icons/wishlist.svg" alt="Wishlist Icon" className="h-5 w-5 mr-2" />
                            Wishlist
                        </Link>
                    </div>
                </div>

                {/* Logo et nom (version desktop) */}
                <div className="hidden md:flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-14 w-auto mr-4" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold">Citadel</span>
                        <span className="font-bold">PokeWishlist</span>
                    </div>
                </div>

                {/* Liens de navigation (version desktop) */}
                <div className="hidden md:flex justify-center flex-grow space-x-4">
                    <Link href="/" className="hover:text-gray-300 flex items-center">
                        <img src="/icons/pokedex.svg" alt="Pokédex Icon" className="h-5 w-5 mr-2" />
                        Pokédex
                    </Link>
                    <Link href="/wishlist" className="hover:text-gray-300 flex items-center">
                        <img src="/icons/wishlist.svg" alt="Wishlist Icon" className="h-5 w-5 mr-2" />
                        Wishlist
                    </Link>
                </div>

                {/* Texte à droite (version desktop) */}
                <div className="hidden md:flex flex-col items-end">
                    <div>Fait par 0xChamberlain</div>
                    <div>/pw Citadel</div>
                </div>
            </div>
        </nav>
    );
}
