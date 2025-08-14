## Prérequis

Pour faire fonctionner ce projet, vous devez avoir installé :

- **Docker** ([Installation](https://docs.docker.com/engine/install/))
- **Docker Compose** ([Installation](https://docs.docker.com/compose/install/))
- **Bash** (ou un shell compatible)

## Lancer le projet

Lancer les container lancer
```bash
    docker compose up -d
    # frontoffice http://localhost:3000
    # api http://localhost:8000
    # pour changer les ports ça se passe dans le docker compose 
```
Une fois les container lancer le script bash pour charger les fixture et generer les clefs necessaire pour le jwt
```bash
    ./script.sh
```

Pour les depanage ou l'instalation de package
```bash
    docker compose exec api bash # pour l'api
    docker compose exec frontoffice bash # pour le frontoffice
```

Pour Arreter le projet
```bash
    docker compose down
```

## Temps passé

- **Configuration Docker** : 30 minutes
- **api** : 2 heures
- **Frontend** : 4 heures 30 minutes
- **Documentation** : 30 minutes
- **Total** : **7 heures 30 minutes**  