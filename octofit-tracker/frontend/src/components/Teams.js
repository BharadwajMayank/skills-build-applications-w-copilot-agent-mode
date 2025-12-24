
import React, { useEffect, useState } from 'react';
import TeamForm from './TeamForm';

const Teams = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;


  useEffect(() => {
    console.log('Fetching Teams from:', endpoint);
    fetch(endpoint, {
      headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
        console.log('Fetched Teams:', results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching teams:', err);
        setLoading(false);
      });
  }, [endpoint, user]);

  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({ name: '' });

  const handleTeamAdded = (team) => {
    setTeams(prev => [team, ...prev]);
  };

  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...teams[idx] });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const res = await fetch(`${endpoint}${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.key ? { 'Authorization': `Token ${user.key}` } : {})
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      setTeams(prev => prev.map(t => t.id === id ? data : t));
      setEditIdx(null);
    } catch (err) {
      alert('Error updating team: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      const res = await fetch(`${endpoint}${id}/`, {
        method: 'DELETE',
        headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
      });
      if (!res.ok) throw new Error('Delete failed');
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Error deleting team: ' + err.message);
    }
  };

  if (loading) return <div className="text-center my-4">Loading Teams...</div>;

  return (
    <>
      <TeamForm user={user} onTeamAdded={handleTeamAdded} />
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">Teams</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  {teams.length > 0 && Object.keys(teams[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => (
                  <tr key={team.id || idx}>
                    {editIdx === idx ? (
                      <>
                        {Object.keys(team).map((key, i) => (
                          <td key={i}>
                            {['id', 'created_at', 'members', 'join_code'].includes(key) ? (
                              typeof team[key] === 'object' ? JSON.stringify(team[key]) : team[key]
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                name={key}
                                value={editForm[key] || ''}
                                onChange={handleEditChange}
                              />
                            )}
                          </td>
                        ))}
                        <td>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleEditSave(team.id)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditIdx(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        {Object.values(team).map((val, i) => (
                          <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : val}</td>
                        ))}
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(idx)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(team.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Teams;
