// src/pages/api/wishlist.js
import dbConnect from '../../lib/mongoose';
import Wishlist from '../../models/Wishlist';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { wishlistId, pokemons } = req.body;

            // Create a new wishlist document
            const wishlist = new Wishlist({
                wishlistId: wishlistId,
                pokemons: pokemons,
            });

            // Save the wishlist to the database
            await wishlist.save();

            console.log('Wishlist saved successfully');
            res.status(200).json({ message: 'Wishlist saved successfully' });
        } catch (error) {
            console.error('Error saving wishlist:', error);
            res.status(500).json({ message: 'Error saving wishlist' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
