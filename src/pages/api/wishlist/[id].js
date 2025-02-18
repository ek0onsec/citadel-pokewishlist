// src/pages/api/wishlist/[id].js
import dbConnect from '../../../lib/mongoose';
import Wishlist from '../../../models/Wishlist';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            // Find the wishlist by its ID
            const wishlist = await Wishlist.findOne({ wishlistId: id });

            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist not found' });
            }

            res.status(200).json(wishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            res.status(500).json({ message: 'Error fetching wishlist' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
