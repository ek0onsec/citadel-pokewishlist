export const typeColors = {
    feu: 'bg-red-500',        // Fire
    eau: 'bg-blue-500',       // Water
    plante: 'bg-green-500',     // Grass
    électrik: 'bg-yellow-500',   // Electric
    psy: 'bg-pink-500',       // Psychic
    glace: 'bg-cyan-300',      // Ice
    dragon: 'bg-indigo-700',    // Dragon
    ténèbres: 'bg-gray-700',     // Dark
    fée: 'bg-pink-300',       // Fairy
    normal: 'bg-gray-400',      // Normal
    combat: 'bg-orange-700',    // Fighting
    vol: 'bg-purple-400',       // Flying
    poison: 'bg-purple-600',    // Poison
    sol: 'bg-yellow-700',       // Ground
    roche: 'bg-gray-600',      // Rock
    insecte: 'bg-green-700',    // Bug
    spectre: 'bg-indigo-900',    // Ghost
    acier: 'bg-gray-500',      // Steel
};

export const getTypeColor = (type) => typeColors[type] || 'bg-gray-200';
