import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
    wishlistId: {
        type: String,
        required: true,
        unique: true,
    },
    pokemons: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

// Check if the model already exists
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;
