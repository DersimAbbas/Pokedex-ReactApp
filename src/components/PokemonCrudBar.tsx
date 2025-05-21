import React, { useState } from 'react';
import './css/PokemonCrudBar.css';
import { BASE_API_URL, FUNC_KEY } from '../constants';
interface Props {
  onFilter: (id: string) => void;
  onAdd: (pokemon: any) => void;
  onRemove?: (id: string) => void; 
}

const PokemonCrudBar: React.FC<Props> = ({ onFilter, onAdd, onRemove }) => {
  const [filterId, setFilterId] = useState('');
  const [addName, setAddName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updateId, setUpdateId] = useState('');
  const [updateStat, setUpdateStat] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

 
  const [removeId, setRemoveId] = useState('');
  const [removeLoading, setRemoveLoading] = useState(false);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filterId.trim());
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_API_URL}/api/pokemon/add/${addName.trim()}?code=${FUNC_KEY}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to add Pokémon');
      const data = await res.json();
      onAdd(data);
      setAddName('');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateId || !updateStat || !updateValue) return;
    setUpdateLoading(true);
    setError(null);
    try {
      const url = `${BASE_API_URL}/api/pokemon/update/${updateId}?statname=${encodeURIComponent(updateStat)}&statvalue=${updateValue}?code=${FUNC_KEY}`;
      const res = await fetch(url, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to update Pokémon stat');
      setUpdateId('');
      setUpdateStat('');
      setUpdateValue('');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeId.trim()) return;
    setRemoveLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_API_URL}/api/pokemon/delete/${removeId.trim()}?code=${FUNC_KEY}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to remove Pokémon');
      if (onRemove) onRemove(removeId.trim());
      setRemoveId('');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="crud-bar">
  <form onSubmit={handleFilter} className="d-flex align-items-center gap-2">
    <input
      type="text"
      className="form-control"
      placeholder="Filter by ID"
      value={filterId}
      onChange={e => setFilterId(e.target.value)}
    />
    <button type="submit" className="btn btn-outline-primary">Filter</button>
  </form>
  <form onSubmit={handleAdd} className="d-flex align-items-center gap-2">
    <input
      type="text"
      className="form-control"
      placeholder="Add Pokémon by name"
      value={addName}
      onChange={e => setAddName(e.target.value)}
    />
    <button type="submit" className="btn btn-success" disabled={loading}>Add</button>
  </form>
  <form onSubmit={handleUpdate} className="d-flex align-items-center gap-2">
    <input
      type="text"
      className="form-control"
      placeholder="ID"
      value={updateId}
      onChange={e => setUpdateId(e.target.value)}
    />
    <input
      type="text"
      className="form-control"
      placeholder="Stat Name"
      value={updateStat}
      onChange={e => setUpdateStat(e.target.value)}
    />
    <input
      type="number"
      className="form-control"
      placeholder="Value"
      value={updateValue}
      onChange={e => setUpdateValue(e.target.value)}
    />
    <button type="submit" className="btn btn-warning" disabled={updateLoading}>
      Update
    </button>
  </form>
  <form onSubmit={handleRemove} className="d-flex align-items-center gap-2">
    <input
      type="text"
      className="form-control"
      placeholder="Remove by ID"
      value={removeId}
      onChange={e => setRemoveId(e.target.value)}
    />
    <button type="submit" className="btn btn-danger" disabled={removeLoading}>
      Remove
    </button>
  </form>
  {error && <span className="text-danger">{error}</span>}
</div>
  );
};

export default PokemonCrudBar;