# Rassemblements Ancêtres 2026

App Next.js qui affiche automatiquement les événements depuis Google Calendar.

## 🚀 Déploiement sur Vercel

### Étape 1 — Préparer le Service Account Google

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com)
2. Projet `oldtimer-bot` → **IAM & Admin** → **Service Accounts**
3. Cliquez **+ Create Service Account**
   - Nom : `rassemblements-calendar-reader`
   - Rôle : aucun nécessaire
4. Cliquez sur le service account créé → **Keys** → **Add Key** → **JSON**
5. Téléchargez le fichier JSON — gardez-le en sécurité !

### Étape 2 — Partager les calendriers avec le Service Account

1. Copiez l'email du service account (ex: `rassemblements-calendar-reader@oldtimer-bot.iam.gserviceaccount.com`)
2. Dans Google Calendar → ⚙️ → **Paramètres** → **Rassemblement ancetres** → **Partager avec des personnes spécifiques**
3. Ajoutez l'email du service account avec le rôle **"Voir tous les détails"**
4. Faites pareil pour le calendrier **Rassemblements motos**

### Étape 3 — Déployer sur Vercel

1. Poussez ce projet sur GitHub :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/cgoudaill/rassemblements-next.git
   git push -u origin main
   ```

2. Allez sur [vercel.com](https://vercel.com) → **New Project** → Importez le repo

3. Dans **Environment Variables**, ajoutez :
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` → email du service account
   - `GOOGLE_PRIVATE_KEY` → le contenu du champ `private_key` du JSON (avec les `\n`)
   - `CALENDAR_VOITURES` → `838ff1a719d507aa59685eed5011a81a77b8761d738e40327d78444f3a0e6559@group.calendar.google.com`
   - `CALENDAR_MOTOS` → `84be91c8a82faf3e87bdb4aba04c0d4ae03f0a485fb4a32abdc00ba69b4969c1@group.calendar.google.com`

4. Cliquez **Deploy** ! ✅

### Mise à jour automatique

Le site se **re-génère automatiquement toutes les 6 heures** grâce à `revalidate = 21600` dans `app/page.tsx`.

Pour forcer une mise à jour immédiate : **Vercel Dashboard** → votre projet → **Deployments** → **Redeploy**.

## 🛠️ Développement local

```bash
npm install
cp .env.local.example .env.local
# Remplissez .env.local avec vos vraies valeurs
npm run dev
```

## 📁 Structure

```
├── app/
│   ├── layout.tsx      # Fonts, metadata SEO
│   ├── page.tsx        # Server component — fetch Calendar
│   └── globals.css     # Design system CSS
├── components/
│   ├── ClientPage.tsx  # UI principale (filtres, grille)
│   ├── Hero.tsx        # Banner avec slideshow
│   ├── EventCard.tsx   # Carte événement avec icône SVG
│   ├── EventModal.tsx  # Modal de détail
│   └── MapView.tsx     # Carte Leaflet interactive
└── lib/
    └── calendar.ts     # Fetch Google Calendar + utilitaires
```
