#  Catch the Moment (CTM)

**Catch the Moment** ist eine Hochzeits- und Event-Web-App, mit der Gäste Fotos teilen und Musikwünsche direkt über eine Spotify-Suche einreichen können.  
Ein Admin-Login verwaltet aktuell **ein einziges Event** und kann sowohl Bilder als auch Musikwünsche moderieren.


---

##  Features

###  Für Gäste

-  **Fotos hochladen**
  - Einzelne Bilder hochladen
  - Mehrere Bilder auf einmal hochladen
  - Bilder direkt über die Kamera aufnehmen
-  **Namen angeben**
  - Gäste müssen Vor- und Nachnamen eingeben, bevor sie Inhalte einreichen
-  **Musikwünsche**
  - Songs direkt über die Spotify-API suchen
  - Wunschliste an den Admin schicken

###  Für Admins

-  **Admin-Login**
  - Ein einfacher, zentraler Admin-Login (aktuell nur **ein Event**)
-  **Bildverwaltung**
  - Vom Admin hochgeladene Bilder einsehbar
  - Bilder können gelöscht werden
-  **Musikwunsch-Verwaltung**
  - Musikwünsche einsehen
  - Wünsche **annehmen**, **ablehnen**, **löschen** oder auf **wartend** lassen

---

##  Vision & Roadmap

Aktueller Stand:  
- Ein Event  
- Ein Admin-Login  
- Gleiche Rolle für alle Gäste

Geplante Weiterentwicklung:

-  **Multi-Event-Unterstützung**
  - Trennung der Daten pro Event (eigene Gäste, eigene Bilder, eigene Musikwünsche)
-  **Rollen & Rechte**
  - Besitzer eines Events
  - Gast
  - DJ (nur Musikwünsche verwalten)
  - Globaler App-Admin
-  **Besserer DJ-/Musik-Modus**
  - Übersichtliche Queue von Musikwünschen
  - Status pro Song (gespielt, übersprungen, offen)

---

##  Tech-Stack

- **Framework:** Next.js 
- **Sprache:** JavaScript 
- **Styling:**
  - Tailwind CSS
- **Weitere Ordner & Module:**
  - components/ – UI-Komponenten  
  - pages/ – Seiten & API-Routen  
  - db/ – Datenlogik  
  - public/ – statische Dateien  

Die Spotify-Suche nutzt die Spotify Web API, konfiguriert über Environment Variablen.

---

##  Lokal starten

### 1. Repository klonen

\`\`\`bash
git clone https://github.com/jonas8900/CTM.git
cd CTM
\`\`\`

### 2. Abhängigkeiten installieren

\`\`\`bash
npm install
\`\`\`

### 3. Environment-Variablen setzen

Erstelle eine Datei `.env.local` im Projektroot, bitte auf jeden Fall darauf achten auch in der ENV die Passwörter zu hashen:

\`\`\`env
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
\`\`\`

### 4. Development-Server starten

\`\`\`bash
npm run dev
\`\`\`

App erreichbar unter:  
http://localhost:3000

---



## Contribution / Weiterentwicklung

Dieses Projekt ist aktuell ein persönliches Projekt.  
Ideen & Feedback gerne als GitHub-Issue.

---
