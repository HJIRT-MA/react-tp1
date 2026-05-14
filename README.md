 Q1 : Comparez la structure de votre projet React (Vite) avec Next.js. Quelles différences ? 

En React, le routage se configure dans le code (App.tsx), tandis qu'en Next.js, il est défini automatiquement par la structure des dossiers dans app/.


 Q2 : Combien de fichiers avez-vous créé pour cette route ? Comparez avec React Router 
où il faut : le composant + la Route dans App.tsx + l’import.


Un seul fichier (app/login/page.tsx) a été créé, et la page s'affiche sans nécessiter la moindre configuration de router supplémentaire.


 Q3 : En React, on utilisait useParams() pour récupérer l’id. En Next.js, comment est-il 
récupéré ? Quelle différence fondamentale ? 
    
L'ID est passé directement en tant que prop (params) par le serveur au composant, au lieu d'utiliser un hook s'exécutant côté client.

 Q5 : En React SPA, combien de lignes fallait-il pour charger les projets ? (useState + 
useEffect + fetch + .then + setProjects + loading). Combien ici ? 

Seulement deux lignes suffisent (le await fetch et le await res.json()), car le composant agit directement comme une fonction asynchrone.

 Q6 : Ouvrez F12 > Network. Voyez-vous la requête GET /projects ? Pourquoi ? 

Non, la requête réseau n'est pas visible car elle est effectuée par le serveur Next.js, qui envoie ensuite au navigateur un HTML déjà pré-rempli.

 Q7 : Pourquoi faut-il 'use client' ici et pas dans la page Dashboard ? 

La page Login nécessite une interactivité côté client (utilisation de useState, onChange et onSubmit), ce qui rend la directive 'use client' obligatoire.

 Q8 : En React, on utilisait useNavigate() de react-router-dom. En Next.js, quel est 
l’équivalent ? 

L'équivalent en Next.js pour déclencher une navigation depuis le code est le hook useRouter, importé depuis next/navigation.


 Q9 : Que voyez-vous dans le code source HTML ? Y a-t-il les noms des projets ? 

Le code source ne montre qu'une structure vide <div id="root"></div> avec un script, les données des projets sont totalement absentes.

 Q10 : Que voyez-vous cette fois ? Les noms des projets sont-ils dans le HTML ? 

on voit le code HTML complet avec les noms des projets déjà intégrés, ce qui prouve l'efficacité du Server-Side Rendering (SSR).


 Q11 : Le Header dans layout.tsx ne se re-monte pas quand on navigue. En React Router, 
comment faisait-on pour obtenir ce comportement ? 

En React Router, on obtenait ce comportement en créant un composant parent (le Layout) qui englobait le composant <Outlet /> (le contenu dynamique).

 Q12 : En Next.js, si je veux un layout spécifique au Dashboard (avec Sidebar), où est-ce 
que je crée le fichier ? 

Il te suffit de créer un nouveau fichier nommé layout.tsx directement à l'intérieur du dossier app/dashboard/.

 Q13 : Le Dashboard est un Server Component. Peut-il utiliser onClick ? Pourquoi ? 

Non, car un Server Component s'exécute uniquement sur le serveur et n'a pas accès aux événements interactifs du navigateur comme un clic.


 Q14 : Si je veux ajouter un bouton « + Nouveau projet » sur le Dashboard, dois-je 
transformer TOUTE la page en Client Component ? 

Non, la bonne pratique est de créer uniquement le bouton dans un petit composant séparé avec 'use client', afin de garder le Dashboard principal en Server Component (affichage pur).


Q15 : json-server tourne sur :4000. Le fetch dans le Server Component se fait depuis le 
SERVEUR Next.js. Le navigateur ne voit jamais l’URL :4000. Quel avantage de sécurité cela 
apporte ? 


Cela masque totalement l'accès à l'API backend (sur le port 4000) au navigateur, empêchant ainsi les utilisateurs finaux d'y accéder ou de l'inspecter directement.



--------------------------------
TP 2 Next.js 

Q1 : En React SPA, que fallait-il faire après un POST pour voir le nouveau projet ? (indice : 
setProjects). Ici ? 

Il fallait mettre à jour l'état local manuellement en ajoutant le nouveau projet à la liste existante via setProjects(prev => [...prev, nouveauProjet])


Q3 : Le bouton supprimer est un <form> avec un <input type="hidden">. Pourquoi pas un 
onClick ?

un Server Component. Pas de onClick possible ! Le formulaire est la 
façon native d’envoyer des données au serveur sans JavaScript. 

Q4 : Testez http://localhost:3000/api/projects dans le navigateur. Que voyez-vous ? 

[{"id":"1","name":"Site E-commerce","color":"#e74c3c"},{"id":"2","name":"App Mobile","color":"#3498db"},{"id":"3","name":"API Backend","color":"#2ecc71"},{"id":"4","name":"Dashboard Admin","color":"#9b59b6"}]

Q5 : Quelle est la différence entre une API Route et une Server Action ? 

API Route pour le CRUD externe,  Server Action pour l'interne


Q6 : Comparez ce Login avec celui de React SPA. Combien de useState en moins ? 

Il y a 3 useState en moins (email, password, et loading/error) car Next.js gère les données via l'objet FormData natif et l'état du formulaire via le hook useActionState.


Q7 : Après le login, ouvrez F12 > Application > Cookies. Voyez-vous le cookie 'session' ? 
Pouvez-vous le lire avec document.cookie dans la console ? 

Oui, le cookie est visible dans l'onglet Application, mais non, vous ne pouvez pas le lire avec document.cookie car l'option httpOnly: true bloque l'accès au JavaScript pour prévenir les attaques XSS.

Q8 : En React SPA, ProtectedRoute affichait brièvement le Dashboard avant de rediriger. 
Ici, que se passe-t-il ? 

La page ne se charge MÊME PAS. Le middleware intercepte AVANT que le serveur 
génère le HTML. Zéro flash, zéro fuite de contenu. 

Q9 : Le middleware.ts est à la racine, pas dans app/. Pourquoi ?

car il doit intercepter toutes les requêtes entrant dans l'application, y compris celles pour les dossiers app/, api/, public/, et même les fichiers statiques, avant qu'elles n'atteignent le système de routage.


Q10 : Le layout est un Server Component. Il lit le cookie DIRECTEMENT avec cookies(). 
En React SPA, comment faisait-on ? (indice : useAuth(), Context, state) 

En React SPA, il était impossible de lire les données directement au premier rendu serveur : on devait utiliser un useEffect (au chargement de l'app) pour extraire le token du localStorage ou d'un cookie, puis injecter ces informations dans un Context via un state (useAuth), ce qui provoquait souvent un court écran blanc ou un flash de contenu ("loading") le temps que le client s'initialise.



Q11 : Server Actions vs API Routes — lequel utiliseriez-vous pour un formulaire de 
création de projet ? Pour une app mobile qui consomme la même API ? 

Pour un formulaire de création de projet dans l'app web, j'utiliserais une Server Action car elle est plus simple à intégrer et gère nativement le cycle de vie du formulaire ; pour une app mobile, j'utiliserais obligatoirement des API Routes car l'application mobile a besoin d'un point d'entrée standard (endpoint) pour envoyer ses données via des requêtes HTTP classiques.


Q12 : En React SPA, l’auth était : Context + useReducer + JWT mémoire + 
ProtectedRoute. En Next.js c’est : cookies + middleware. Quel avantage de sécurité ? 

L'avantage majeur est la protection contre les attaques XSS : le cookie étant géré côté serveur avec l'option httpOnly, le jeton n'est jamais accessible par le JavaScript du navigateur, contrairement au JWT stocké en mémoire ou en localStorage dans une SPA.


Q13 : Si vous arrêtez json-server, les API Routes fonctionnent-elles toujours ? Pourquoi ? 

Les API Routes fonctionneront toujours en tant que code, mais elles renverront une erreur (souvent 500) car elles échoueront à se connecter à leur source de données ; l'API n'est qu'un "messager", si le serveur de base de données (json-server) est éteint, le messager n'a plus rien à transmettre.


Q14 : Le cookie est HttpOnly. Un script XSS injecté dans la page peut-il le voler ? 

Non, un script XSS ne peut pas voler le cookie car le navigateur interdit strictement au JavaScript (via document.cookie) d'accéder aux cookies marqués HttpOnly