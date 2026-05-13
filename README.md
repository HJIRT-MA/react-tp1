Q1 : Pourquoi <Navigate /> (composant) et pas navigate() (hook) ici ? 
=>Ce code s'exécute pendant la phase de rendu de React, navigate() est fait pour être appelé en dehors du rendu par exemple un handler ou un useEffect.


Q2 : Quelle différence entre navigate(from) et navigate(from, { replace: true }) ? 
=>La différence principale réside dans la façon dont le routeur gère l'historique du navigateur ce qui impacte le comportement du bouton Retour

Q3 : Après un POST, pourquoi fait-on setProjects(prev => [...prev, data]) plutôt qu’un 
re-fetch GET ? 
=>Cela permet d'afficher le nouveau projet instantanément pour l'utilisateur tout en évitant une requête réseau complète qui surchargerait inutilement le serveur.

 Q4 : Testez ces scénarios :
 =>a- /dashboard sans être connecté : Le composant <ProtectedRoute> va détecter que l'utilisateur n'est pas authentifié (grâce      au      contexte fourni par <AuthProvider>). Il va bloquer l'accès à <Dashboard /> et rediriger l'utilisateur vers /login.

    b- /projects/1 sans être connecté : Exactement le même comportement. L'accès est intercepté par le <ProtectedRoute> qui protège cette route. Redirection vers /login.

    c- /nimportequoi (URL inexistante) : Cette URL ne correspond à aucune route spécifique, elle est donc capturée par la route "fourre-tout" (path="*"). Elle déclenche une <Navigate to="/dashboard" />.
Résultat : Redirection vers /dashboard (qui, à son tour, renverra vers /login si l'utilisateur n'est pas connecté).

    d- / (racine) : Capturé par la route path="/". L'utilisateur est immédiatement redirigé vers /dashboard. L'attribut replace indique que cette redirection remplace la racine (/) dans l'historique de navigation (pour éviter de boucler si on clique sur le bouton "Retour").

    e- Connecté puis bouton Retour du navigateur : Le BrowserRouter gère parfaitement l'historique.

Q5 : Quelle différence entre <Link> et <NavLink> ? Pourquoi NavLink ici ?
=>Contrairement à un simple <Link>, <NavLink> détecte s'il correspond à l'URL actuelle, ce qui permet ici de mettre automatiquement en surbrillance visuelle le projet sélectionné dans le menu.

Q6 : Ce composant sert pour le POST ET le PUT. Qu’est-ce qui change entre les deux 
usages ? 
=>Pour un POST on passe des valeurs initiales vides pour créer un nouveau projet, tandis que pour un PUT on injecte les données du projet existant (initialName, initialColor) via les props pour les modifier.

Q7 : Arrêtez json-server et tentez un POST. Le message s’affiche ? 
Q8 : Avec fetch, un 404 ne lance PAS d’erreur. Avec Axios, que se passe-t-il ? 

=>Oui, si le serveur est arrêté le message s'affiche bien (Network Error), car contrairement à fetch, Axios bascule automatiquement dans le bloc catch pour toute erreur HTTP (404, 500, ou serveur injoignable).


TP_seance5:

Q1 : Le script s’exécute-t-il ? Pourquoi ? Que fait React avec les strings dans le JSX ? 

Non, React échappe automatiquement les variables JSX en Strings inoffensif pour bloquer les attaques XSS

Q2 : Que se passe-t-il cette fois ? Supprimez ce code immédiatement après le test. 

En ajoutant dangerouslySetInnerHTML() la protection React est desactivé.

Q3 : Ouvrez Network (F12). Faites un GET /projects. Voyez-vous le header Authorization: 
Bearer ... ? 
 
OUI.

Q4 : Pourquoi stocker le token en mémoire (state React) et PAS dans localStorage ? 


localStorage est accessible par TOUT script JS de la page (XSS). Le state React est 
isolé dans le composant. 

 Q5 : Comparez authSlice.ts avec votre ancien authReducer.ts. Qu’est-ce qui a changé ? 
(indice : switch/case, action types, immutabilité) 

authSlice (Redux Toolkit) simplifie le code en remplaçant le switch/case par des fonctions simples, en générant automatiquement les action types, et en gérant l'immutabilité en coulisses grâce à Immer.

Q6 : Combien de composants se re-rendent quand on toggle la sidebar ? Lesquels ne 
DEVRAIENT PAS ? 

Les deux composants (Sidebar et MainContent) se re-rendent, mais MainContent ne devrait pas car ses props (columns) n'ont pas changé lors de cette action.

Q7 : Pourquoi MainContent ne se re-rend plus ? Que compare React.memo ? 

React.memo effectue une comparaison de surface (shallow compare) des props, et puisqu'elles ne changent pas, il empêche le re-rendu.

BUG VOLONTAIRE : La Sidebar mémoisée se re-rend quand même ! Pourquoi ? 

À chaque rendu du parent, la fonction inline (p) => renameProject(p) est recréée avec une nouvelle référence en mémoire, ce qui trompe la comparaison de surface de React.memo ; il faut donc utiliser useCallback pour figer sa référence.


Q8 : Quelle différence entre useMemo et useCallback ? Quand utiliser chacun ? reponse en un ligne

useMemo mémorise le résultat d'un calcul complexe, tandis que useCallback mémorise la référence d'une fonction pour éviter qu'elle soit recréée à chaque re-rendu.