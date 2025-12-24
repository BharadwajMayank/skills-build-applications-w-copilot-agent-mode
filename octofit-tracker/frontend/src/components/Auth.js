import React, { useState } from 'react';

const API_BASE = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`;

const Auth = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const url = isLogin ? `${API_BASE}auth/login/` : `${API_BASE}auth/registration/`;
    const payload = isLogin ? { username: form.username, password: form.password } : form;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
      onAuth(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card shadow mx-auto my-5" style={{ maxWidth: 400 }}>
      <div className="card-header bg-primary text-white text-center">
        <h3>{isLogin ? 'Login' : 'Register'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
          </div>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100 mb-2">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button className="btn btn-link w-100" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
