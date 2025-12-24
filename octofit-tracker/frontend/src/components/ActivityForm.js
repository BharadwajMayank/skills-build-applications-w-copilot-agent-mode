import React, { useState } from 'react';

const ActivityForm = ({ user, onActivityAdded }) => {
  const [form, setForm] = useState({ type: '', duration: '', date: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.key ? { 'Authorization': `Token ${user.key}` } : {})
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setSuccess('Activity logged successfully!');
      setForm({ type: '', duration: '', date: '' });
      if (onActivityAdded) onActivityAdded(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Log Activity</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <input type="text" className="form-control" name="type" value={form.type} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Duration (minutes)</label>
            <input type="number" className="form-control" name="duration" value={form.duration} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary w-100">Log Activity</button>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;
