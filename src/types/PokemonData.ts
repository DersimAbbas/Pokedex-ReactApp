export type PokemonData = {
  pokemonId: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: number;
  weight: number;
  stats: { 
    baseStat: number; 
    stat: { 
      name: string 
    } 
  }[];
  Genus: string;
}