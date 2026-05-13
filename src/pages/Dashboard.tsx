import { useState, useCallback, memo } from 'react'; 
import api from '../api/axios'; 
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar'; 
import MainContent from '../components/MainContent'; 
import ProjectForm from '../components/ProjectForm'; 
import styles from './Dashboard.module.css'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { type RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import useProjects from '../hooks/useProjects'; 

interface Project { id: string; name: string; color: string; } 
interface Column { id: string; title: string; tasks: string[]; } 

const MemoizedSidebar = memo(Sidebar); 

export default function Dashboard() { 
   const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects(); 
   
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [showForm, setShowForm] = useState(false); 
  const [saving, setSaving] = useState(false); 
  
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleRename = useCallback((project: Project) => {
    renameProject(project);
  }, [renameProject]);
  

  if (loading) return <div className={styles.loading}>Chargement...</div>; 

  return ( 
    <div className={styles.layout}> 
      <Header 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(p => !p)} 
        userName={user?.name || 'Utilisateur'} 
        onLogout={() => dispatch(logout())} 
      /> 
      <div className={styles.body}> 
        
        <MemoizedSidebar 
          projects={projects} 
          isOpen={sidebarOpen} 
          onRename={handleRename} 
        /> 

        <div className={styles.content}> 
          <div className={styles.toolbar}> 
            {error && (
              <div className={styles.error} style={{ color: 'red', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            {!showForm ? ( 
              <button 
                className={styles.addBtn} 
                onClick={() => setShowForm(true)}
                disabled={saving} 
              > 
                {saving ? "Action en cours..." : "+ Nouveau projet"}
              </button> 
            ) : ( 
              <ProjectForm 
                submitLabel={saving ? "Création..." : "Créer"} 
                onSubmit={async (name, color) => {
                  setSaving(true);
                  await addProject(name, color);
                  setSaving(false);
                  setShowForm(false);
                }} 
                onCancel={() => setShowForm(false)} 
              /> 
            )} 
          </div> 
          
          <MainContent columns={columns} /> 
        </div> 
      </div> 
    </div> 
  ); 
}