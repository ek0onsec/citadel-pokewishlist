export const fetchPokemonList = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await response.json();

    // Récupérer les détails de chaque Pokémon (nom et types en français)
    const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon, index) => {
            const detailsResponse = await fetch(pokemon.url);
            const details = await detailsResponse.json();

            // Récupérer le nom en français depuis l'endpoint species
            const speciesResponse = await fetch(details.species.url);
            const species = await speciesResponse.json();
            const frenchName = species.names.find((name) => name.language.name === 'fr').name;

            // Traduire les types en français
            const frenchTypes = await Promise.all(
                details.types.map(async (t) => {
                    const typeResponse = await fetch(t.type.url);
                    const typeData = await typeResponse.json();
                    return typeData.names.find((name) => name.language.name === 'fr').name;
                })
            );

            return {
                id: index + 1,
                name: frenchName, // Nom en français
                types: frenchTypes, // Types en français
            };
        })
    );

    return pokemonDetails;
};
