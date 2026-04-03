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



TP4:

Q1: 4 lignes de CSS avec MUI. Sans MUI 16 lignes de CSS

Q2 Comparez le code du Header MUI vs Bootstrap. Lequel est plus lisible ? Plus court ?:
=> Bootstrap est plus court grâce à ses classes utilitaires, tandis que MUI est plus lisible grâce à ses composants sémantiques et explicites.
 

Q3 : Le Login MUI utilise sx={{}} pour le style. Le Login Bootstrap utilise des classes CSS 
(className). Quel système préférez-vous ? Pourquoi ? 

=>MUI (sx) offre un contrôle typé et structuré idéal pour les projets complexes, tandis que Bootstrap (className) privilégie la rapidité et la simplicité d'écriture. A mon avis je prefere MUI



Q4 : Si vous deviez choisir UNE seule library pour TaskFlow en production, laquelle et 
pourquoi ? 

=>MUI est le meilleur choix pour la production car son thémage centralisé et sa robustesse TypeScript garantissent une maintenance et une scalabilité optimales pour TaskFlow.

Q5 : Pourquoi React ne peut-il PAS se connecter directement à MySQL ?

=>Pour des raisons de securité: risque d'exposer la base de données. Des raisons de protocole: MySQL utilise une couche intermidiaire pour communiquer avec le navigateur.

Q6 : Pourquoi ne pas utiliser json-server en production ? 
=>
Absence de sécurité : json-server n'offre aucune gestion d'authentification ou de permissions par défaut 

Performance et Concurrence : Comme les données sont dans un seul fichier .json, si deux utilisateurs écrivent en même temps, le fichier peut être corrompu ou verrouillé.

Absence de logique métier : Tu ne peux pas vérifier si une donnée est valide avant de l'enregistrer.


Q7 : Firebase permet à React de se connecter directement (pas de backend Express). 
Comment est-ce possible alors que MySQL ne le permet pas ? 

=>Firebase n'est pas juste une base de données, c'est une plateforme qui inclut un serveur intermédiaire invisible géré par Google.

Q8 : Passer de json-server à la production

=>
1-Backend: Remplacer json-server par un vrai serveur capable de gérer la logique métier.
2-Base de Données: Migrer les données de db.json vers un système robuste comme PostgreSQL
3-Implémenter un système sécurisé
4-S'assurer que les données envoyées par le client sont valides avant de les enregistrer
5-Héberger le frontend

Q9: Les risques des librairies externes

=>-Taille du Bundle (Poids) : Ces librairies sont "lourdes". Si on n'utilise que 10% de leurs composants mais qu'on importe tout, le site devient lent à charger
-Mises à jour et "Breaking Changes" : Si MUI passe de la version 5 à 6, il se peut que ton code ne fonctionne plus. Tu dois alors passer des heures à refactoriser ton projet pour rester à jour

 Q10 : Vous devez créer une app de chat en temps réel. json-server, Firebase ou Backend 
custom ? Justifiez. 

=> - Pourquoi pas json-server ? Il est incapable de gérer le "temps réel" (WebSockets). Il faudrait rafraîchir la page manuellement pour voir les nouveaux messages.De plus, il est vulnérable car il ne possède pas de couche d'authentification native, laissant les données exposée

-Pour taskflow c'est le meilleur choix ici. Sa base de données (Firestore) possède des "listeners" natifs. Dès qu'un message est écrit, tous les clients connectés le reçoivent instantanément sans configurer de serveur. Cependant, pour une application plus complexe, Firebase peut être limité en termes de fonctionnalités personnalisées et n'offre pas un contrôle total sur la logique métier

-Backend Custom (Le gagnant pour le contrôle) : Utiliser Node.js avec Socket.io. C'est plus complexe à coder, mais cela permet un contrôle total sur les coûts et la logique de chat