import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import api from '../../api/axios'; 

export default function LoginBS() { 
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAuth(); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 

  const from = (location.state as any)?.from || '/dashboard';

  useEffect(() => { 
    if (state.user) navigate(from, { replace: true });
  }, [state.user, navigate, from]);
  
  async function handleSubmit(e: React.FormEvent) { 
    e.preventDefault(); 
    dispatch({ type: 'LOGIN_START' }); 
    try { 
      const { data: users } = await api.get(`/users?email=${email}`); 
      if (users.length === 0 || users[0].password !== password) { 
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' }); 
        return; 
      } 
      const { password: _, ...user } = users[0]; 
      dispatch({ type: 'LOGIN_SUCCESS', payload: user }); 
    } catch { 
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Erreur serveur' }); 
    } 
  }

  return (
    <div className="bg-light d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Container className="d-flex justify-content-center"> 
        <Card className="shadow-sm" style={{ maxWidth: 400, width: '100%' }}> 
          <Card.Body className="p-4"> 
            <h2 className="text-center fw-bold mb-1" style={{ color: '#1B8C3E' }}>
              TaskFlow
            </h2> 
            <p className="text-center text-muted small mb-4">
              Connectez-vous pour continuer
            </p>

            {state.error && <Alert variant="danger">{state.error}</Alert>} 

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3"> 
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                /> 
              </Form.Group> 

              <Form.Group className="mb-4"> 
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Votre mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                /> 
              </Form.Group> 

              <Button 
                type="submit" 
                className="w-100 border-0" 
                disabled={state.loading}
                style={{ backgroundColor: '#1B8C3E' }}
              >
                {state.loading ? 'Connexion...' : 'Se connecter'}
              </Button> 
            </Form> 
          </Card.Body> 
        </Card> 
      </Container>
    </div>
  ); 
}