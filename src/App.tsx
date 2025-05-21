import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';
import PokemonCrudBar from './components/PokemonCrudBar';
import { PokemonData } from './types/PokemonData';
import { BASE_API_URL, FUNC_KEY } from './constants';

function App() {
  const [starters, setStarters] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PokemonData | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/pokemons?code=${FUNC_KEY}`
        );
        if (!response.ok) throw new Error(response.statusText);
        const data: PokemonData[] = await response.json();
        setStarters(data);
      } catch (err) {
        console.error('Error fetching starters:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

 
  const handleFilter = async (id: string) => {
  if (!id) {
    
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/pokemons?code=${FUNC_KEY}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const data: PokemonData[] = await response.json();
      setStarters(data);
    } catch (err) {
      console.error('Error fetching starters:', err);
    } finally {
      setLoading(false);
    }
    return;
  }
  
  const found = starters.find(p => p.pokemonId.toString() === id);
  if (found) {
    setStarters([found]);
    
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch(
      `${BASE_API_URL}/api/pokemon/get/${id}?code=${FUNC_KEY}`
    );
    if (!response.ok) throw new Error(response.statusText);
    const data: PokemonData = await response.json();
    setStarters([data]);
    
  } catch (err) {
    console.error('Error filtering Pokémon:', err);
    setStarters([]);
    setSelected(null);
  } finally {
    setLoading(false);
  }
};

  // Add Pokémon by name
  const handleAdd = async (pokemon: PokemonData) => {
    
    setStarters(prev =>
      prev.some(p => p.pokemonId === pokemon.pokemonId)
        ? prev
        : [...prev, pokemon]
    );
  };

  const handleRemove = async (id: string) => {
    setStarters(prev => prev.filter(p => p.pokemonId.toString() !== id));
  }
  return (
    <div className="container py-4">
      <div className="pokedex-frame mx-auto">
        <div className="row">
          <div className="col-12 pokedex-header text-center">
            <h1>Pokédex</h1>
            <div className="pokedex-lights">
              <span className="light red" />
              <span className="light yellow" />
              <span className="light green" />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <PokemonCrudBar onFilter={handleFilter} onAdd={handleAdd} onRemove={handleRemove} />
          </div>
        </div>

        <div className="row pokedex-body">
          <div className="col-12 col-md-8 mx-auto">
            <div className="screen mb-4">
              
              {loading ? (
                <p>Loading starters...</p>
              ) : (
                <div className="row g-4">
                  {starters.map(pokemon => (
                    <div
                      className="col-12 col-sm-6 col-md-4"
                      key={pokemon.pokemonId}
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        onClick={setSelected}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PokemonModal
        pokemon={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default App;