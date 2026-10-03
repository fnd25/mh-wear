# MH WEAR — site vitrine + commande WhatsApp

Site 100 % statique (HTML/CSS/JS, aucune base de données), hébergé gratuitement sur **Cloudflare Pages**.
Le backoffice est **Pages CMS** : une interface web gratuite qui modifie les fichiers du dépôt GitHub.
Chaque modification déclenche automatiquement un nouveau déploiement.

```
mh-wear/
├── .pages.yml            ← configuration du backoffice
└── public/               ← le site (dossier publié par Cloudflare)
    ├── index.html
    ├── style.css
    ├── app.js
    ├── data/
    │   ├── produits.json ← la liste des articles
    │   └── site.json     ← numéro WhatsApp + slogan
    └── images/           ← les photos des articles
```

## 1. Mettre le code sur GitHub

1. Crée un compte sur https://github.com (si besoin), puis un dépôt **mh-wear** (public ou privé).
2. Envoie tout le contenu de ce dossier dans le dépôt, y compris le fichier caché `.pages.yml` :
   ```bash
   cd mh-wear
   git init
   git add .
   git commit -m "Premier commit MH WEAR"
   git branch -M main
   git remote add origin https://github.com/<ton-compte>/mh-wear.git
   git push -u origin main
   ```

## 2. Déployer sur Cloudflare Pages

1. Va sur https://dash.cloudflare.com → **Workers & Pages** → **Créer** → **Pages** → **Connecter à Git**.
2. Choisis le dépôt **mh-wear**.
3. Réglages de build :
   - **Framework preset** : None
   - **Build command** : *(laisser vide)*
   - **Build output directory** : `public`
4. Clique sur **Enregistrer et déployer**. Le site est en ligne sur `https://mh-wear.pages.dev` (ou un nom proche).

À chaque modification du dépôt (via le backoffice ou un `git push`), Cloudflare redéploie tout seul en 1 à 2 minutes.

## 3. Le backoffice (pour ton petit frère)

1. Ouvre https://app.pagescms.org et connecte-toi avec le compte GitHub.
2. Autorise l'accès au dépôt **mh-wear**.
3. Deux menus apparaissent :
   - **Articles** : ajouter / supprimer / réordonner les vêtements, changer les photos (upload direct), prix, tailles, cocher « Nouveau » ou « Épuisé ».
   - **Réglages du site** : numéro WhatsApp et slogan.
4. Cliquer sur **Save** → le site se met à jour en 1 à 2 minutes.

Ton frère n'a pas de compte GitHub ? Soit il en crée un et tu l'ajoutes comme collaborateur du dépôt
(GitHub → Settings → Collaborators), soit tu l'invites par email depuis Pages CMS (paramètres du projet → Collaborators).

## À faire avant la mise en ligne

- [ ] **Numéro WhatsApp** : dans « Réglages du site », remplacer `221770000000` par le vrai numéro,
      au format international, chiffres uniquement (indicatif pays + numéro, sans `+` ni `0` initial).
- [ ] **Photos** : les images actuelles sont des exemples. Remplacer par de vraies photos
      (format portrait conseillé, ~1000×1250 px, JPG < 300 Ko pour un chargement rapide).
- [ ] **Prix** : le champ est du texte libre (`15 000 FCFA`, `25 €`…), adapte à ta devise.
- [ ] Supprimer les fichiers d'exemple de `public/images/` une fois remplacés.

## Comment marche le bouton WhatsApp

Le bouton ouvre `https://wa.me/<numéro>?text=<message>` avec un message déjà rédigé :

```
Bonjour MH WEAR 👋
Je souhaite acheter : *T-shirt Oversize Noir*
Prix : 10 000 FCFA
Taille souhaitée :
Photo : https://mh-wear.pages.dev/images/tshirt-noir.jpg
```

Sur téléphone, ça ouvre directement l'appli WhatsApp ; sur ordinateur, WhatsApp Web.
Le client n'a plus qu'à indiquer sa taille et envoyer.

## Tester en local

```bash
cd public
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
(Ouvrir `index.html` directement par double-clic ne marche pas : le navigateur bloque le chargement des fichiers JSON.)
