# GitHub Setup Instructies

## Stap 1: Maak een GitHub Repository aan

1. Ga naar [GitHub.com](https://github.com) en log in
2. Klik op het **+** icoon rechtsboven en kies **New repository**
3. Geef je repository een naam (bijvoorbeeld: `straver-website`)
4. Kies **Public** of **Private** (aanbevolen: Private)
5. **NIET** vink "Initialize with README" aan (we hebben al een README)
6. Klik op **Create repository**

## Stap 2: Koppel je lokale repository aan GitHub

Na het aanmaken van de repository krijg je instructies. Gebruik deze commando's:

```bash
# Voeg GitHub remote toe (vervang USERNAME en REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push naar GitHub
git push -u origin main
```

## Stap 3: Controleer

Ga naar je GitHub repository pagina en controleer of alle bestanden er zijn.

## Toekomstige Updates

Wanneer je wijzigingen maakt, gebruik deze commando's:

```bash
# Voeg alle wijzigingen toe
git add .

# Maak een commit
git commit -m "Beschrijving van je wijzigingen"

# Push naar GitHub
git push
```

## Belangrijk

- Je `.env.local` bestand wordt **NIET** geüpload (staat in .gitignore)
- Je Supabase credentials blijven lokaal en veilig
- Alle code en afbeeldingen worden wel geüpload


