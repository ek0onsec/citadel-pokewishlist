// src/components/Navbar.js
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo et nom à gauche */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-4" />
                    <span className="font-bold">Pokedex</span>
                </div>

                {/* Texte au centre (version mobile) */}
                <div className="md:hidden text-center">
                    <div>Fait par 0xChamberlain</div>
                    <div>/pw Citadel</div>
                </div>

                {/* Menu burger à droite */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="focus:outline-none">
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

                {/* Liens de navigation (version desktop) */}
                <div className="hidden md:flex space-x-4">
                    <Link href="/" className="hover:text-gray-300 flex items-center">
                        <img src="/icons/pokedex.svg" alt="Pokédex Icon" className="h-5 w-5 mr-2" />
                        Pokédex
                    </Link>
                    <Link href="/wishlist" className="hover:text-gray-300 flex items-center">
                        <img src="/icons/wishlist.svg" alt="Wishlist Icon" className="h-5 w-5 mr-2" />
                        Wishlist
                    </Link>
                </div>

                {/* Liens de navigation (version mobile) */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-gray-800 z-10 ${isOpen ? 'block' : 'hidden'}`}>
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

                {/* Texte à droite (version desktop) */}
                <div className="hidden md:flex text-right">
                    <div>Fait par 0xChamberlain</div>
                    <div>/pw Citadel</div>
                </div>
            </div>
        </nav>
    );
}
