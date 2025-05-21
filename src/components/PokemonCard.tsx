import React from 'react';
import './css/PokemonCard.css';
import { PokemonData } from '../types/PokemonData';

interface Props {
  pokemon: PokemonData;
  onClick: (pokemon: PokemonData) => void;
}

const typeColors: Record<string, string> = {
  grass: 'linear-gradient(135deg, #b2fba5 60%, #d1c4e9 100%)',
  fire: 'linear-gradient(135deg, #ffd180 60%, #ff8a65 100%)',
  water: 'linear-gradient(135deg, #81d4fa 60%, #b3e5fc 100%)',
  bug: 'linear-gradient(135deg, #dcedc8 60%, #f8bbd0 100%)',
  poison: 'linear-gradient(135deg, #ce93d8 60%, #b2dfdb 100%)',
  flying: 'linear-gradient(135deg, #b3e5fc 60%, #e1bee7 100%)',
  normal: 'linear-gradient(135deg, #e0e0e0 60%, #bdbdbd 100%)',
  electric: 'linear-gradient(135deg, #fff9c4 60%, #ffe082 100%)',
  fighting: 'linear-gradient(135deg, #ffccbc 60%, #ffab91 100%)',
  dragon: 'linear-gradient(135deg, #e1bee7 60%, #f8bbd0 100%)',
  ice: 'linear-gradient(135deg, #bbdefb 60%, #90caf9 100%)',
  ground: 'linear-gradient(135deg, #d7ccc8 60%, #bcaaa4 100%)',
  psychic: 'linear-gradient(135deg, #f8bbd0 60%, #e1bee7 100%)',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PokemonCard: React.FC<Props> = ({ pokemon, onClick }) => {
  const mainType = pokemon.types[0]?.type.name;
  const bgStyle = { background: typeColors[mainType] || '#f5f5f5' };

  return (
    <div className="poke-card" style={bgStyle} onClick={() => onClick(pokemon)}>
      <div className="poke-card-info">
        <span className="poke-card-id">#{pokemon.pokemonId.toString().padStart(3, '0')}</span>
        <span className="poke-card-icon" title="More info">ℹ️</span>
      </div>
      <img className="poke-card-img"  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`} alt={pokemon.name} />
      <div className="poke-card-name">{capitalize(pokemon.name)}</div>
      <div className = "poke-types">
            {pokemon.types.map(t => (
          <span className={`poke-type type-${t.type.name}`} key={t.type.name}>
            {t.type.name.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;