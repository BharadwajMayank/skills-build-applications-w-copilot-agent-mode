import React, { useEffect, useState } from 'react';

const Workouts = ({ user }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Fetching Workouts from:', endpoint);
    fetch(endpoint, {
      headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
        console.log('Fetched Workouts:', results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching workouts:', err);
        setLoading(false);
      });
  }, [endpoint, user]);

  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...workouts[idx] });
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
      setWorkouts(prev => prev.map(w => w.id === id ? data : w));
      setEditIdx(null);
    } catch (err) {
      alert('Error updating workout: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      const res = await fetch(`${endpoint}${id}/`, {
        method: 'DELETE',
        headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
      });
      if (!res.ok) throw new Error('Delete failed');
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert('Error deleting workout: ' + err.message);
    }
  };

  if (loading) return <div className="text-center my-4">Loading Workouts...</div>;

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h2 className="h4 mb-0">Workouts</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                {workouts.length > 0 && Object.keys(workouts[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, idx) => (
                <tr key={workout.id || idx}>
                  {editIdx === idx ? (
                    <>
                      {Object.keys(workout).map((key, i) => (
                        <td key={i}>
                          {['id', 'user', 'created_at'].includes(key) ? (
                            typeof workout[key] === 'object' ? JSON.stringify(workout[key]) : workout[key]
                          ) : (
                            <input
                              type={key === 'duration' ? 'number' : key === 'date' ? 'date' : 'text'}
                              className="form-control"
                              name={key}
                              value={editForm[key] || ''}
                              onChange={handleEditChange}
                            />
                          )}
                        </td>
                      ))}
                      <td>
                        <button className="btn btn-success btn-sm me-2" onClick={() => handleEditSave(workout.id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditIdx(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {Object.values(workout).map((val, i) => (
                        <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : val}</td>
                      ))}
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(idx)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(workout.id)}>Delete</button>
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
  );
};

export default Workouts;
