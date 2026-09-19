
import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';


const envUrl = import.meta.env.VITE_API_URL || 'https://app-lydevtech.duckdns.org/api/users';
const apiUrl = envUrl.endsWith('/users') ? envUrl : `${envUrl}/users`;


function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({ username: '', email: '', firstName: '', lastName: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(apiUrl);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur. (Network Error / CORS)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        username: user.username || '', 
        email: user.email || '', 
        firstName: user.firstName || '', 
        lastName: user.lastName || '' 
      });
    } else {
      setEditingUser(null);
      setFormData({ username: '', email: '', firstName: '', lastName: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${apiUrl}/${editingUser.id}`, formData);
      } else {
        // En création, on ajoute un password factice si requis par le backend (à adapter selon le DTO)
        const payload = { ...formData, password: 'password123' }; 
        await axios.post(apiUrl, payload);
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Examen DevOps - Gestion des Utilisateurs</h1>
        <button className="btn" onClick={() => openModal()}>
          + Nouvel Utilisateur
        </button>
      </header>

      {error && (
        <div className="error-banner">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="empty-state">Chargement...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">Aucun utilisateur trouvé.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => openModal(user)}>
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Modifier' : 'Créer'} un Utilisateur</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Username</label>
                <input required name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
