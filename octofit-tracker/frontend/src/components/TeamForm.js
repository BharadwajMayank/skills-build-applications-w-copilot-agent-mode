import React, { useState } from 'react';

const API_BASE = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`;

const TeamForm = ({ user, onTeamAdded }) => {
  const [form, setForm] = useState({ name: '', joinCode: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}teams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.key ? { 'Authorization': `Token ${user.key}` } : {})
        },
        body: JSON.stringify({ name: form.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setSuccess('Team created successfully!');
      setForm({ name: '', joinCode: '' });
      if (onTeamAdded) onTeamAdded(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoin = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}teams/join/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.key ? { 'Authorization': `Token ${user.key}` } : {})
        },
        body: JSON.stringify({ join_code: form.joinCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setSuccess('Joined team successfully!');
      setForm({ name: '', joinCode: '' });
      if (onTeamAdded) onTeamAdded(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Team Management</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleCreate} className="mb-3">
          <div className="mb-2">
            <label className="form-label">Create Team</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Team Name" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Team</button>
        </form>
        <form onSubmit={handleJoin}>
          <div className="mb-2">
            <label className="form-label">Join Team</label>
            <input type="text" className="form-control" name="joinCode" value={form.joinCode} onChange={handleChange} placeholder="Join Code" required />
          </div>
          <button type="submit" className="btn btn-success w-100">Join Team</button>
        </form>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {success && <div className="alert alert-success mt-2">{success}</div>}
      </div>
    </div>
  );
};

export default TeamForm;
