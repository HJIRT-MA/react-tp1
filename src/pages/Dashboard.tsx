import { useState, useEffect } from 'react'; 
import { useAuth } from '../features/auth/AuthContext'; 
import api from '../api/axios'; 
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar'; 
import MainContent from '../components/MainContent'; 
import ProjectForm from '../components/ProjectForm'; 
import styles from './Dashboard.module.css'; 
import axios from 'axios';

interface Project { id: string; name: string; color: string; } 
interface Column { id: string; title: string; tasks: string[]; } 

export default function Dashboard() { 
  const { state: authState, dispatch } = useAuth(); 
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [projects, setProjects] = useState<Project[]>([]); 
  const [columns, setColumns] = useState<Column[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [showForm, setShowForm] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [saving, setSaving] = useState(false); 

  // GET — charger les données au montage 
  useEffect(() => { 
    async function fetchData() { 
      try { 
        const [projRes, colRes] = await Promise.all([ 
          api.get('/projects'), 
          api.get('/columns'), 
        ]); 
        setProjects(projRes.data); 
        setColumns(colRes.data); 
      } catch (e) { 
        console.error(e); 
        setError("Erreur lors du chargement des données.");
      } finally { 
        setLoading(false); 
      } 
    } 
    fetchData(); 
  }, []); 

  // POST — ajouter un projet 
  async function addProject(name: string, color: string) { 
    setSaving(true); 
    setError(null); 
    try { 
      const { data } = await api.post('/projects', { name, color }); 
      setProjects(prev => [...prev, data]); 
      setShowForm(false); // On ferme le formulaire si succès
    } catch (err) { 
      if (axios.isAxiosError(err)) { 
        setError(err.response?.data?.message || `Erreur ${err.response?.status}`); 
      } else { 
        setError('Erreur inconnue'); 
      } 
    } finally { 
      setSaving(false); 
    } 
  } 

  // PUT — renommer un projet 
  async function renameProject(project: Project) {
    const nouveauNom = prompt('Nouveau nom du projet :', project.name);
    
    if (nouveauNom && nouveauNom.trim() !== '' && nouveauNom !== project.name) {
      setSaving(true);
      setError(null);
      try {
        // CORRECTION DE LA SYNTAXE ICI (séparation de l'URL et du body)
        const { data } = await api.put(`/projects/${project.id}`, { 
          ...project, 
          name: nouveauNom 
        });
        setProjects((pr) => pr.map((p) => (p.id === project.id ? data : p)));
      } catch (err) {
        if (axios.isAxiosError(err)) { 
          setError(`Erreur de modification : ${err.response?.status}`); 
        } else { 
          setError('Erreur inconnue lors du renommage'); 
        }
      } finally {
        setSaving(false);
      }
    }
  }

  // DELETE — supprimer un projet 
  async function deleteProject(id: string) {
    const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer ce projet ?');
    
    if (isConfirmed) {
      setSaving(true);
      setError(null);
      try {
        // CORRECTION DE LA SYNTAXE ICI (ajout du / avant l'id)
        await api.delete(`/projects/${id}`);
        setProjects(pr => pr.filter(p => p.id !== id));
      } catch (err) {
        if (axios.isAxiosError(err)) { 
          setError(`Erreur de suppression : ${err.response?.status}`); 
        } else { 
          setError('Erreur inconnue lors de la suppression'); 
        }
      } finally {
        setSaving(false);
      }
    } 
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>; 

  return ( 
    <div className={styles.layout}> 
      <Header 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(p => !p)} 
        userName={authState.user?.name || 'Utilisateur'} 
        onLogout={() => dispatch({ type: 'LOGOUT' })} 
      /> 
      <div className={styles.body}> 
        <Sidebar projects={projects} isOpen={sidebarOpen} /> 
        <div className={styles.content}> 
          
          <div className={styles.toolbar}> 
            
            {/* Affichage des erreurs au-dessus du bouton/formulaire */}
            {error && (
              <div className={styles.error} style={{ color: 'red', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            {!showForm ? ( 
              <button 
                className={styles.addBtn} 
                onClick={() => setShowForm(true)}
                disabled={saving} // Désactive le bouton si une action (POST/PUT/DELETE) est en cours
              > 
                {saving ? "Action en cours..." : "+ Nouveau projet"}
              </button> 
            ) : ( 
              <ProjectForm 
                submitLabel={saving ? "Création..." : "Créer"} 
                onSubmit={(name, color) => addProject(name, color)} 
                onCancel={() => {
                  setShowForm(false);
                  setError(null); // On vide l'erreur si on annule
                }} 
              /> 
            )} 
          </div> 
          
          <MainContent columns={columns} /> 
        </div> 
      </div> 
    </div> 
  ); 
}