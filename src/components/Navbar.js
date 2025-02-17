import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gray-700 p-4 text-white flex items-center justify-between">
            {/* Logo à gauche */}
            <div className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-12 w-auto mr-4" />
                <span className="font-bold">Citadel - PokeWishlist</span>
            </div>

            {/* Liens de navigation au centre */}
            <div className="flex space-x-4">
                <Link href="/">
                    Pokédex
                </Link>
                <Link href="/wishlist">
                    Wishlist
                </Link>
            </div>

            {/* Texte à droite */}
            <div className="text-right">
                <div>Fait par 0xChamberlain</div>
                <div>/pw Citadel</div>
            </div>
        </nav>
    );
}
