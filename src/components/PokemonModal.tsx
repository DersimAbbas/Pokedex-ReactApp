import React, { useEffect, useState } from 'react';
import './css/PokemonModal.css';
import { PokemonData } from '../types/PokemonData';
import {BASE_API_URL, FUNC_KEY } from '../constants';


const typeGradients: Record<string, string> = {
  grass: 'linear-gradient(135deg, #b2fba5 60%, #d1c4e9 100%)',
  fire: 'linear-gradient(135deg, #ffd180 60%, #ff8a65 100%)',
  water: 'linear-gradient(135deg, #81d4fa 60%, #b3e5fc 100%)',
  electric: 'linear-gradient(135deg, #fff9c4 60%, #ffe082 100%)',
  fighting: 'linear-gradient(135deg, #ffccbc 60%, #ffab91 100%)',
  dragon: 'linear-gradient(135deg, #e1bee7 60%, #f8bbd0 100%)',
  ice: 'linear-gradient(135deg, #bbdefb 60%, #90caf9 100%)',
  flying: 'linear-gradient(135deg, #b3e5fc 60%, #e1bee7 100%)',
  ground: 'linear-gradient(135deg, #d7ccc8 60%, #bcaaa4 100%)',
};

interface Evolution {
  id: number;
  name: string;
  sprite: string;
}

interface Details {
  pokemonId: number;
  name: string;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: string;
  weight: string;
  stats: { baseStat: number; stat: { name: string } }[];
  genus: string;
}

interface Props {
  pokemon: PokemonData | null;
  onClose: () => void;
}

const gameboyFont = { fontFamily: "'Press Start 2P', 'VT323', monospace" };

const PokemonModal: React.FC<Props> = ({ pokemon, onClose }) => {
  const [details, setDetails] = useState<Details | null>(null);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!pokemon) return;

    // reset state when opening a new pokemon
    setDetails(null);
    setEvolutions([]);
    setDescription('');

    // fetch your core data
    fetch(`${BASE_API_URL}/api/pokemon/get/${pokemon.pokemonId}?code=${FUNC_KEY}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load details');
        return res.json() as Promise<Details>;
      })
      .then(data => {
        setDetails(data);

        // now fetch species & evolution chain
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}`)
          .then(r => r.json())
          .then(speciesData => {
            // optional flavor text
            const flavor = speciesData.flavor_text_entries
              .find((e: any) => e.language.name === 'en');
            if (flavor) {
              let desc = flavor.flavor_text.replace(/\f/g, ' ')
                                            .replace(/\s+/g, ' ');
              const firstSentence =
                desc.split('. ')[0] + (desc.includes('.') ? '.' : '');
              setDescription(firstSentence);
            }
            return fetch(speciesData.evolution_chain.url);
          })
          .then(r => r.json())
          .then(chain => {
            const list: Evolution[] = [];
            let evo = chain.chain;
            while (evo) {
              const id = parseInt(
                evo.species.url.split('/').slice(-2)[0],
                10
              );
              list.push({
                id,
                name: evo.species.name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              });
              evo = evo.evolves_to[0];
            }
            setEvolutions(list);
          })
          .catch(err => console.error('Evolution error', err));
      })
      .catch(err => console.error('Details error', err));
  }, [pokemon]);

  if (!pokemon) return null;
  if (!details) {
    return (
      <div className="custom-modal-bg">
        <div className="custom-modal-content">
          <button className="custom-modal-close" onClick={onClose}>×</button>
          <div className="custom-modal-body" style={gameboyFont}>
            Loading…
          </div>
        </div>
      </div>
    );
  }

  const mainType = details.types[0]?.type.name;
  const bgStyle = { background: typeGradients[mainType] || '#f5f5f5' };
  const sectionStyle = {
    '--poke-section-bg': `${
      typeGradients[mainType] || '#f5f5f5'
    }, rgba(255, 255, 255, 0.94)`,
  } as React.CSSProperties;

  return (
    <div className="custom-modal-bg">
      <div className="custom-modal-content" style={bgStyle}>
        <button className="custom-modal-close" onClick={onClose}>×</button>
        <div className="custom-modal-body pokedex-modal-body" style={gameboyFont}>

        
          <div className="modal-left pokedex-modal-left">
            <div className="poke-id">
              #{details.pokemonId.toString().padStart(3, '0')}
            </div>
            <h2 className="poke-name">
              {details.name.charAt(0).toUpperCase() + details.name.slice(1)}
            </h2>
            <div className="poke-species">{details.genus}</div>
            <div className="poke-sprite-frame">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.pokemonId}.png`}
                alt={details.name}
                className="poke-img"
              />
            </div>
            <div className="poke-types">
              {details.types.map(t => (
                <span
                  className={`poke-type type-${t.type.name}`}
                  key={t.type.name}
                >
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="poke-attributes">
              <div>
                <b>Height:</b> {details.height ? +details.height / 10 : '-'} m
              </div>
              <div>
                <b>Weight:</b> {details.weight ? +details.weight / 10 : '-'} kg
              </div>
            </div>
          </div>

          <div className="modal-right pokedex-modal-right">
            <div className="poke-section poke-section-about" style={sectionStyle}>
              <h4>About</h4>
              <p>{description}</p>
            </div>
            <div className="poke-section poke-section-abilities" style={sectionStyle}>
              <h4>Abilities</h4>
              <ul>
                {details.abilities.map(a => (
                  <li key={a.ability.name}>{a.ability.name}</li>
                ))}
              </ul>
            </div>
            <div className="poke-section poke-section-stats" style={sectionStyle}>
              <h4>Base Stats</h4>
              <div className="poke-stats-horizontal">
                {details.stats.map(s => (
                  <div
                    key={s.stat.name}
                    className={`stat-col stat-${s.stat.name}`}
                  >
                    <div className="stat-label">
                      {s.stat.name.replace('-', ' ').toUpperCase()}
                    </div>
                    <div className="stat-value">{s.baseStat}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="poke-section poke-section-evolution" style={sectionStyle}>
              <h4>Evolution</h4>
              <div className="evolution-row">
                {evolutions.map((evo, idx) => (
                  <React.Fragment key={evo.id}>
                    <div className="evolution-item">
                      <img src={evo.sprite} alt={evo.name} />
                      <div>
                        {evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}
                      </div>
                    </div>
                    {idx < evolutions.length - 1 && <span className="evo-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PokemonModal;
