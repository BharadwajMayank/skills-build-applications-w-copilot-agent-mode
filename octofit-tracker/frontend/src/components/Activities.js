
import React, { useEffect, useState } from 'react';

import ActivityForm from './ActivityForm';


const Activities = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;


  useEffect(() => {
    console.log('Fetching Activities from:', endpoint);
    fetch(endpoint, {
      headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
        console.log('Fetched Activities:', results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setLoading(false);
      });
  }, [endpoint, user]);

  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', duration: '', date: '' });

  const handleActivityAdded = (activity) => {
    setActivities(prev => [activity, ...prev]);
  };

  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...activities[idx] });
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
      setActivities(prev => prev.map(a => a.id === id ? data : a));
      setEditIdx(null);
    } catch (err) {
      alert('Error updating activity: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      const res = await fetch(`${endpoint}${id}/`, {
        method: 'DELETE',
        headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
      });
      if (!res.ok) throw new Error('Delete failed');
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Error deleting activity: ' + err.message);
    }
  };

  if (loading) return <div className="text-center my-4">Loading Activities...</div>;

  return (
    <>
      <ActivityForm user={user} onActivityAdded={handleActivityAdded} />
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">Activities</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  {activities.length > 0 && Object.keys(activities[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, idx) => (
                  <tr key={activity.id || idx}>
                    {editIdx === idx ? (
                      <>
                        {Object.keys(activity).map((key, i) => (
                          <td key={i}>
                            {['id', 'user', 'created_at'].includes(key) ? (
                              typeof activity[key] === 'object' ? JSON.stringify(activity[key]) : activity[key]
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
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleEditSave(activity.id)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditIdx(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        {Object.values(activity).map((val, i) => (
                          <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : val}</td>
                        ))}
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(idx)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(activity.id)}>Delete</button>
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

export default Activities;
