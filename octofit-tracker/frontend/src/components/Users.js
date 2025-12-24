import React, { useEffect, useState } from 'react';

const Users = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const endpoint = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  useEffect(() => {
    console.log('Fetching Users from:', endpoint);
    fetch(endpoint, {
      headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
        console.log('Fetched Users:', results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setLoading(false);
      });
  }, [endpoint, user]);

  const handleEditClick = (idx) => {
    setEditIdx(idx);
    setEditForm({ ...users[idx] });
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
      setUsers(prev => prev.map(u => u.id === id ? data : u));
      setEditIdx(null);
    } catch (err) {
      alert('Error updating user: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${endpoint}${id}/`, {
        method: 'DELETE',
        headers: user && user.key ? { 'Authorization': `Token ${user.key}` } : {}
      });
      if (!res.ok) throw new Error('Delete failed');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  if (loading) return <div className="text-center my-4">Loading Users...</div>;

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white">
        <h2 className="h4 mb-0">Users</h2>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                {users.length > 0 && Object.keys(users[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id || idx}>
                  {editIdx === idx ? (
                    <>
                      {Object.keys(u).map((key, i) => (
                        <td key={i}>
                          {['id', 'created_at', 'last_login', 'date_joined'].includes(key) ? (
                            typeof u[key] === 'object' ? JSON.stringify(u[key]) : u[key]
                          ) : (
                            <input
                              type={key === 'email' ? 'email' : 'text'}
                              className="form-control"
                              name={key}
                              value={editForm[key] || ''}
                              onChange={handleEditChange}
                            />
                          )}
                        </td>
                      ))}
                      <td>
                        <button className="btn btn-success btn-sm me-2" onClick={() => handleEditSave(u.id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditIdx(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {Object.values(u).map((val, i) => (
                        <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : val}</td>
                      ))}
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(idx)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
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

export default Users;
