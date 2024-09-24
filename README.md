# Anthony Cormeaux
# Osée Ibobi

___

Modèles de Données

Album
Le modèle Album représente un album contenant plusieurs photos.

Schéma:

title: String (obligatoire) - Titre de l'album.
description: String - Description optionnelle de l'album.
photos: Array of ObjectId (référence à Photo) - Liste des photos associées à l'album.
Fichier: models/album.js

Photo
Le modèle Photo représente une photo dans un album spécifique.

Schéma:

album: ObjectId (référence à Album) (obligatoire) - L'album auquel la photo appartient.
url: String (obligatoire) - URL de la photo.
description: String - Description optionnelle de la photo.
Fichier: models/photo.js

Endpoints de l'API
Endpoints pour Albums
Base URL: /album

URL: /album/
Méthode: POST
Description: Crée un nouvel album.
Corps de la requête: { "title": "Titre de l'album", "description": "Description de l'album" }
Réponse:
Succès: 200 OK avec les détails de l'album créé.
Erreur: 400 Bad Request si la requête est invalide. 500 Internal Server Error en cas d'erreur serveur.
Afficher un album par ID

URL: /album/:id
Méthode: GET
Description: Récupère les détails d'un album spécifique par son ID.
Paramètres URL: id - ID de l'album à récupérer.
Réponse:
Succès: 200 OK avec les détails de l'album.
Erreur: 400 Bad Request si l'ID est invalide. 500 Internal Server Error en cas d'erreur serveur.
Supprimer un album par ID

URL: /album/:id
Méthode: DELETE
Description: Supprime un album spécifique par son ID.
Paramètres URL: id - ID de l'album à supprimer.
Réponse:
Succès: 200 OK avec les détails de l'album supprimé.
Erreur: 400 Bad Request si l'ID est invalide. 500 Internal Server Error en cas d'erreur serveur.
Afficher tous les albums

URL: /albums/
Méthode: GET
Description: Récupère tous les albums.
Réponse:
Succès: 200 OK avec une liste de tous les albums.
Erreur: 400 Bad Request si la requête est invalide. 500 Internal Server Error en cas d'erreur serveur.

Endpoints pour Photos
Base URL: /album/:albumId/photo

URL: /album/:albumId/photo/
Méthode: POST
Description: Crée une nouvelle photo dans un album spécifique.
Paramètres URL: albumId - ID de l'album où la photo sera ajoutée.
Corps de la requête: { "url": "URL de la photo", "description": "Description de la photo" }
Réponse:
Succès: 200 OK avec les détails de la photo créée.
Erreur: 400 Bad Request si les données de la photo sont invalides. 500 Internal Server Error en cas d'erreur serveur.
Afficher toutes les photos d'un album spécifique

URL: /album/:albumId/photos/
Méthode: GET
Description: Récupère toutes les photos d'un album spécifique.
Paramètres URL: albumId - ID de l'album dont on veut récupérer les photos.
Réponse:
Succès: 200 OK avec une liste de toutes les photos de l'album.
Erreur: 400 Bad Request si l'ID de l'album est invalide. 500 Internal Server Error en cas d'erreur serveur.
Mettre à jour une photo par ID dans un album spécifique

URL: /album/:albumId/photo/:id
Méthode: PUT
Description: Met à jour les détails d'une photo spécifique dans un album.
Paramètres URL:
albumId - ID de l'album contenant la photo.
id - ID de la photo à mettre à jour.
Corps de la requête: { "url": "Nouvelle URL de la photo", "description": "Nouvelle description" }
Réponse:
Succès: 200 OK avec les détails de la photo mise à jour.
Erreur: 400 Bad Request si les données sont invalides. 500 Internal Server Error en cas d'erreur serveur.
Supprimer une photo par ID dans un album spécifique

URL: /album/:albumId/photo/:id
Méthode: DELETE
Description: Supprime une photo spécifique d'un album.
Paramètres URL:
albumId - ID de l'album contenant la photo.
id - ID de la photo à supprimer.
Réponse:
Succès: 200 OK avec les détails de la photo supprimée.
Erreur: 400 Bad Request si l'ID est invalide. 500 Internal Server Error en cas d'erreur serveur.
Notes
Authentification: Les endpoints de création, mise à jour et suppression devraient probablement être protégés par une authentification, mais cela dépend de la mise en œuvre spécifique de votre authenticateToken (non montré ici).
Gestion des erreurs: Les codes d'erreur 400 Bad Request sont utilisés pour les demandes malformées, tandis que les erreurs de serveur internes sont renvoyées avec le code 500.