# Dixcordes 🧶

**Dixcordes** est une application de messagerie instantanée haute performance conçue pour l'apprentissage et la démonstration des technologies de communication en temps réel. Le projet met en œuvre une architecture robuste basée sur **Socket.io** pour les flux bidirectionnels et **Redis Stack** pour la persistance ultra-rapide des messages.

## 🚀 Fonctionnalités Clés

- **Salons Thématiques** : Rejoignez des espaces dédiés (Général, Tech, Loisirs, Musiques, Films) pour discuter de vos sujets préférés.
- **Temps Réel Absolu** : Communication instantanée grâce à Socket.io avec indicateurs de saisie ("typing...") et statuts de présence des membres.
- **Persistance Redis** : Historique des 10 derniers messages récupéré instantanément via Redis JSON et RediSearch lors de la connexion à un salon.
- **Interface Technique** : Un design "Dark Mode" épuré utilisant la police *Geist*, optimisé pour les développeurs.
- **Tableau de Bord Diagnostic** : Vue intégrée pour surveiller l'état des WebSockets et de la base Redis en temps réel.

## 🛠️ Architecture Technique

- **Frontend** : React (Interface réactive et gestion des hooks de cycle de vie des sockets).
- **Backend** : Node.js + Express (Chef d'orchestre des flux).
- **Communication** : Socket.io (Protocoles de communication haute vélocité).
- **Stockage & Indexation** : Redis Stack (Modélisation NoSQL JSON et index de recherche).
- **Infrastructure** : Orchestration via Docker pour une stack prête à l'emploi.

## 📁 Structure du Projet

- `/client` : Code source React de l'interface Dixcordes.
- `/server` : Serveur Node.js gérant la logique Socket.io et les interactions Redis.
- `/docker` : Scripts de configuration pour Redis Stack et Redis Insight.
