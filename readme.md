# 🏋️ FitTrack Pro – KI-Agenten Kontextdokument

> **Version:** 2.0  
> **Typ:** High-Level Context für KI-Agenten  
> **Zielplattform:** Smartphone (PWA mit Capacitor)  
> **Zielgruppe:** Sportler im Fitnessstudio  
> **Kernprinzip:** Offline-First, Mobile-Only

---

## 📋 Inhaltsverzeichnis

1. [Produktvision & North Star](#1-produktvision--north-star)
2. [User Journeys & Flows](#2-user-journeys--flows)
3. [Feature-Übersicht](#3-feature-übersicht)
4. [Datenarchitektur (MVP)](#4-datenarchitektur-mvp)
5. [Offline-First & Sync-Strategie](#5-offline-first--sync-strategie)
6. [Analyse & KPIs](#6-analyse--kpis)
7. [UI/UX Prinzipien](#7-uiux-prinzipien)
8. [Edge Cases & Fehlerbehandlung](#8-edge-cases--fehlerbehandlung)
9. [Tech-Stack Entscheidungen](#9-tech-stack-entscheidungen)
10. [Anhang: Code-Referenzen](#10-anhang-code-referenzen)

---

## 1. Produktvision & North Star

### 1.1 Vision Statement

> **"Vom Handy zum ersten Satz in unter 30 Sekunden – auch ohne Internet."**

Eine Fitness-App, die im Gym funktioniert wie sie soll: schnell, zuverlässig, offline. Keine Ladebalken, keine Sync-Fehler, keine verlorenen Daten.

### 1.2 North Star Metric (NSM)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📊 NORTH STAR METRIC                                      │
│                                                             │
│   "Completed Sessions per Active User per Week"             │
│                                                             │
│   Ziel: ≥ 3 abgeschlossene Trainings pro Woche             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Warum diese Metrik?**
- Misst echte Nutzung, nicht nur App-Öffnungen
- Korreliert mit Nutzerbindung und -zufriedenheit
- Einfach zu tracken (auch offline)
- Beeinflusst Feature-Priorisierung direkt

### 1.3 Sekundäre Erfolgsmetriken

| Metrik | Ziel | Messung |
|--------|------|---------|
| **Time to First Training** | < 60 Sekunden | Vom App-Start bis erster Satz |
| **Session Completion Rate** | > 85% | Gestartete vs. abgeschlossene Sessions |
| **Sync Success Rate** | > 99% | Erfolgreiche Syncs / Gesamte Sync-Versuche |
| **Offline Usage Rate** | Tracking | % der Sessions ohne Internetverbindung |
| **Data Entry Rate** | > 70% | Sets mit mindestens einem geänderten Wert |

### 1.4 Was diese App NICHT ist

- ❌ Kein Social Network / Community Features
- ❌ Keine vorgefertigten Trainingspläne
- ❌ Kein Kalorienzähler / Ernährungstracker
- ❌ Keine Gamification (Badges, Streaks, Leaderboards)
- ❌ Keine Video-Anleitungen

**Fokus:** Persönliches Tracking, eigene Übungen, eigene Pläne, eigene Daten.

---

## 2. User Journeys & Flows

### 2.1 Kritischer Pfad: Erstes Training

```
┌─────────────────────────────────────────────────────────────┐
│                 🎯 GOLDEN PATH (< 60 Sekunden)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. APP ÖFFNEN                                               │
│    → Neuer User? → Schnell-Registrierung (Email + PW)       │
│    → Bestehender User? → Auto-Login (Token lokal)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. LEERER ZUSTAND → ONBOARDING                              │
│    "Du hast noch keinen Trainingsplan."                     │
│    [+ Ersten Plan erstellen]  ← Prominenter CTA             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. PLAN ERSTELLEN (Minimal)                                 │
│    → Name eingeben: "Push Day"                              │
│    → Mindestens 1 Übung hinzufügen                          │
│    → Übung: Name + Muskelgruppe (Dropdown)                  │
│    [Plan speichern]                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. TRAINING STARTEN                                         │
│    → Plan auswählen (oder direkt nach Erstellung)           │
│    → Übungen werden geladen                                 │
│    → Erste Übung ist bereits aufgeklappt                    │
│    → Input-Felder für Satz 1 sind fokussiert                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. ERSTER SATZ EINTRAGEN                                    │
│    → Gewicht eingeben (numerisches Keyboard)                │
│    → Wiederholungen eingeben                                │
│    → Optional: Notiz                                        │
│    → Nächster Satz oder nächste Übung                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ✅ ERFOLG: User hat ersten Datenpunkt erfasst               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Wiederkehrender User Flow

```
App öffnen → Home zeigt letzten Plan → [Training starten] 
→ Werte vom letzten Mal vorausgefüllt → Nur Änderungen eintragen 
→ [Speichern] → Fertig
```

**Wichtig:** Wiederkehrende User sollen mit **2 Taps** im Training sein.

### 2.3 User Flow: Training durchführen (Detail)

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAINING SESSION                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Für jede Übung im Plan:                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Übungsname                                          │    │
│  │ "Zuletzt: [Datum]" (nur wenn vorher trainiert)      │    │
│  │                                                     │    │
│  │ Sätze (vorausgefüllt mit letzten Werten):           │    │
│  │ ┌─────┬────────┬──────┬───────┐                     │    │
│  │ │ #   │ Gewicht│ Reps │ Notiz │                     │    │
│  │ ├─────┼────────┼──────┼───────┤                     │    │
│  │ │ 1   │ [80]   │ [10] │ [...]│                      │    │
│  │ │ 2   │ [80]   │ [8]  │ [...]│                      │    │
│  │ │ 3   │ [75]   │ [8]  │ [...]│                      │    │
│  │ └─────┴────────┴──────┴───────┘                     │    │
│  │                                                     │    │
│  │ [+ Satz]  [− Satz]                                  │    │
│  │ [ ] Aus Analyse ausschließen                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Aktionen auf Session-Ebene:                                │
│  • Übung zur Session hinzufügen (temporär)                  │
│  • Übung aus Session entfernen (temporär, nicht aus Plan)   │
│                                                             │
│  [Training abschließen]                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Entscheidungsbaum: Satz speichern

```
User ändert Wert in einem Satz
            │
            ▼
┌─────────────────────────────┐
│ Wert ≠ letzter Wert?        │
└─────────────────────────────┘
      │              │
     JA             NEIN
      │              │
      ▼              ▼
┌──────────┐   ┌──────────────────┐
│ isChanged│   │ Kein DB-Eintrag  │
│ = true   │   │ Datum unverändert│
└──────────┘   └──────────────────┘
      │
      ▼
Bei Session-Abschluss:
Nur Sets mit isChanged=true 
werden in DB geschrieben
```

---

## 3. Feature-Übersicht

### 3.1 MVP Feature Set (Phase 1)

| Feature | Priorität | Beschreibung | Offline |
|---------|-----------|--------------|---------|
| **Auth** | P0 | Email/PW Login, Token lokal | ⚠️ Login nur online, danach offline nutzbar |
| **Training starten** | P0 | Plan auswählen, Session beginnen | ✅ |
| **Sets eintragen** | P0 | Gewicht, Reps, Notizen pro Satz | ✅ |
| **Session speichern** | P0 | Nur geänderte Werte persistieren | ✅ |
| **Plan erstellen** | P1 | Name + Übungen hinzufügen | ✅ |
| **Übung erstellen** | P1 | Name + Muskelgruppe | ✅ |
| **Übungsreihenfolge** | P1 | Drag & Drop im Plan | ✅ |
| **Analyse: Leistungsindex** | P2 | Chart über Zeit | ✅ |
| **Analyse: Durchschnittsgewicht** | P2 | Chart über Zeit | ✅ |
| **Analyse: Trainingsfrequenz** | P2 | Wochen-Chart | ✅ |

### 3.2 Explizit NICHT im MVP

- Account-Wiederherstellung (später via Email)
- Daten-Export
- Dark Mode
- Mehrere Geräte synchronisieren
- Plan duplizieren
- Übungen archivieren

### 3.3 Feature-Regeln

**Training Session:**
- Vorausgefüllte Werte = letzte gespeicherte Werte dieser Übung
- Übung zur Session hinzufügen ≠ Übung zum Plan hinzufügen
- Übung aus Session entfernen löscht NICHTS aus der Datenbank
- Satz hinzufügen/entfernen gilt nur für aktuelle Session

**Datenpersistenz:**
- Neuer DB-Eintrag NUR wenn `isChanged = true`
- "Zuletzt trainiert" Datum ändert sich NUR bei echtem neuen Eintrag
- Keine Phantom-Einträge mit identischen Werten

---

## 4. Datenarchitektur (MVP)

### 4.1 Vereinfachtes Entity Model

```
┌─────────────┐       ┌─────────────┐
│    User     │       │ MuscleGroup │
├─────────────┤       ├─────────────┤
│ id visibles │       │ id          │
│ email       │       │ name        │
│ token       │       │ icon        │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │    ┌────────────────┘
       │    │
       ▼    ▼
┌─────────────────┐
│    Exercise     │
├─────────────────┤
│ id              │
│ userId          │
│ name            │
│ muscleGroupId   │
│ syncStatus      │
└────────┬────────┘
         │
         │ N:M via PlanExercise
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│  TrainingPlan   │◄─────│  PlanExercise   │
├─────────────────┤      ├─────────────────┤
│ id              │      │ planId          │
│ userId          │      │ exerciseId      │
│ name            │      │ order           │
│ syncStatus      │      │ defaultSets     │
└────────┬────────┘      └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│  TrainingSession    │
├─────────────────────┤
│ id                  │
│ planId              │
│ startedAt           │
│ completedAt         │
│ syncStatus          │
└──────────┬──────────┘
           │
           │ 1:N
           ▼
┌─────────────────────────────┐
│       ExerciseSet           │
├─────────────────────────────┤
│ id                          │
│ sessionId                   │
│ exerciseId                  │
│ setNumber                   │
│ weight          (nullable)  │
│ reps            (nullable)  │
│ notes           (string)    │
│ excludeFromAnalysis (bool)  │ ◄── Auf Set-Ebene, nicht Exercise
│ createdAt                   │
│ syncStatus                  │
└─────────────────────────────┘

Hinweis: "isChanged" wird NICHT gespeichert – 
es ist ein Runtime-Flag. Nur geänderte Sets 
werden überhaupt in die DB geschrieben.
```

### 4.2 MVP Feld-Reduktion

**Entfernt gegenüber V1:**
- `localId` → UUID reicht, Server übernimmt bei Sync
- `updatedAt` → `createdAt` reicht für MVP
- `isChanged` in DB → Runtime-only Flag
- `targetReps` in PlanExercise → Wird zu `defaultSets` (Anzahl Sätze)

### 4.3 Sync-Status Enum

```
syncStatus: 'local' | 'pending' | 'synced' | 'conflict'

local    → Nur lokal erstellt, nie versucht zu syncen
pending  → In Sync-Queue, wartet auf Upload
synced   → Erfolgreich mit Server synchronisiert
conflict → Konflikt erkannt, muss gelöst werden
```

---

## 5. Offline-First & Sync-Strategie

### 5.1 Grundprinzip

```
┌─────────────────────────────────────────────────────────────┐
│                    OFFLINE-FIRST REGEL                       │
│                                                             │
│  "Jede Aktion wird SOFORT lokal ausgeführt.                 │
│   Sync passiert im Hintergrund, wenn möglich."              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Sync-Priorisierung

| Priorität | Daten | Richtung | Frequenz |
|-----------|-------|----------|----------|
| **1 (Kritisch)** | ExerciseSets | Client → Server | Bei Verbindung, sofort |
| **2 (Hoch)** | TrainingSessions | Client → Server | Bei Verbindung, sofort |
| **3 (Mittel)** | Exercises, Plans | Bidirektional | Bei App-Start + alle 5 Min |
| **4 (Niedrig)** | MuscleGroups | Server → Client | Einmalig bei Erstinstallation |

### 5.3 Conflict Resolution Matrix

```
┌─────────────────────┬─────────────┬─────────────────────────────┐
│ Entity              │ Strategie   │ Begründung                  │
├─────────────────────┼─────────────┼─────────────────────────────┤
│ ExerciseSet         │ CLIENT_WINS │ Gym-Session > alles.        │
│                     │             │ User hat die Daten live     │
│                     │             │ eingetragen.                │
├─────────────────────┼─────────────┼─────────────────────────────┤
│ TrainingSession     │ CLIENT_WINS │ Lokale Session ist Wahrheit │
├─────────────────────┼─────────────┼─────────────────────────────┤
│ Exercise            │ SERVER_WINS │ Konsistenz über Geräte      │
│ (Name, Muskelgruppe)│             │ (Zukunft: Multi-Device)     │
├─────────────────────┼─────────────┼─────────────────────────────┤
│ TrainingPlan        │ MERGE       │ Server-Name gewinnt,        │
│                     │             │ Übungsliste wird gemerged   │
├─────────────────────┼─────────────┼─────────────────────────────┤
│ PlanExercise        │ SERVER_WINS │ Reihenfolge vom Server,     │
│ (Reihenfolge)       │             │ lokale Adds werden gepusht  │
└─────────────────────┴─────────────┴─────────────────────────────┘
```

### 5.4 Merge-Logik für TrainingPlan

```
Server-Plan: [Übung A, Übung B, Übung C]
Client-Plan: [Übung A, Übung D, Übung B]  (User hat D hinzugefügt, C entfernt)

Merge-Ergebnis:
1. Server-Reihenfolge als Basis: [A, B, C]
2. Client-Adds hinzufügen: [A, B, C, D]
3. Client-Deletes NICHT anwenden (gefährlich offline)
4. User muss C manuell löschen wenn gewünscht

Rationale: Lieber zu viel als Datenverlust.
```

### 5.5 Sync-Queue Verhalten

```
Queue wächst unbegrenzt? → NEIN

Regeln:
• Max 1000 Einträge in Queue
• Älteste Einträge werden komprimiert (Batch-Updates)
• Bei > 500 Einträgen: Warnung an User
• Bei > 1000: Erzwungene Sync-Pause bis Online

Retry-Strategie:
• 1. Versuch: Sofort
• 2. Versuch: Nach 30 Sekunden
• 3. Versuch: Nach 2 Minuten
• 4. Versuch: Nach 10 Minuten
• Danach: Nur bei manuellem Refresh oder App-Neustart
```

---

## 6. Analyse & KPIs

### 6.1 Definierte Metriken

#### Leistungsindex (Performance Index)

```
Formel: (Σ Gewicht × Reps) / Anzahl Sätze

Beispiel:
Session mit 3 Sätzen Bankdrücken:
• Satz 1: 80kg × 10 = 800
• Satz 2: 80kg × 8 = 640  
• Satz 3: 75kg × 8 = 600
Summe: 2040
Leistungsindex: 2040 / 3 = 680

Anzeige: Liniendiagramm über Zeit
X-Achse: Datum der Session
Y-Achse: Leistungsindex
```

#### Durchschnittsgewicht

```
Formel: Σ Gewicht / Anzahl Sätze

Beispiel (gleiche Session):
(80 + 80 + 75) / 3 = 78.3 kg

Anzeige: Liniendiagramm über Zeit
X-Achse: Datum
Y-Achse: kg
```

#### Trainingsfrequenz

```
Formel: Count(Sessions mit dieser Übung) pro Kalenderwoche

Anzeige: Balkendiagramm
X-Achse: Kalenderwoche (z.B. "KW 23", "KW 24")
Y-Achse: Anzahl Trainingseinheiten (0-7)
```

### 6.2 Analyse-Regeln

| Regel | Beschreibung |
|-------|--------------|
| **Ausschluss** | Sets mit `excludeFromAnalysis = true` werden ignoriert |
| **Minimum** | Mindestens 2 Datenpunkte für Chart-Anzeige |
| **Zeitraum** | Standard: Letzte 12 Wochen, erweiterbar |
| **Null-Werte** | Sets ohne Gewicht/Reps werden ignoriert |
| **Aggregation** | Pro Session EIN Datenpunkt (nicht pro Set) |

### 6.3 Pflicht-Charts im MVP

1. **Übungsdetail-Screen:** Leistungsindex (Linie)
2. **Übungsdetail-Screen:** Durchschnittsgewicht (Linie)
3. **Analyse-Dashboard:** Trainingsfrequenz pro Übung (Balken)

### 6.4 NICHT im MVP

- Volumen-Tracking (Total Weight Lifted)
- 1RM Schätzung (Epley etc.)
- Körpergewicht-Tracking
- Vergleich zwischen Übungen
- Export als CSV/PDF

---

## 7. UI/UX Prinzipien

### 7.1 Design-System Basics

```
┌─────────────────────────────────────────────────────────────┐
│ FARBEN                                                      │
├─────────────────────────────────────────────────────────────┤
│ Primary (Lila):     #a855f7 (Buttons, aktive Elemente)     │
│ Primary Dark:       #7e22ce (Hover, Pressed States)        │
│ Primary Light:      #f3e8ff (Backgrounds, Badges)          │
│                                                             │
│ Neutral:            Graustufen für Text & Borders          │
│ Success:            #10b981 (Grün für Bestätigungen)       │
│ Warning:            #f59e0b (Orange für Hinweise)          │
│ Error:              #ef4444 (Rot für Fehler)               │
│                                                             │
│ Background:         #f9fafb (Hellgrau)                     │
│ Surface:            #ffffff (Karten, Modals)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TYPOGRAFIE                                                  │
├─────────────────────────────────────────────────────────────┤
│ Font:               Inter (System-Fallback: SF Pro, Roboto)│
│ Heading:            Bold, 1.25rem - 1.5rem                 │
│ Body:               Regular, 1rem                          │
│ Caption:            Regular, 0.875rem, Grau                │
│ Input:              Medium, 1.125rem (größer für Touch)    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SPACING & LAYOUT                                            │
├─────────────────────────────────────────────────────────────┤
│ Base Unit:          4px                                    │
│ Card Padding:       16px                                   │
│ Card Radius:        12px                                   │
│ Button Radius:      8px                                    │
│ Touch Target:       Min. 44×44px                           │
│ Max Content Width:  428px (iPhone 14 Pro Max)              │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Navigation Struktur

```
┌─────────────────────────────────────────────────────────────┐
│ BOTTOM NAVIGATION (Fixed, immer sichtbar)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🏠          🏋️          ▶️          📊                   │
│  Home      Übungen    Training    Analyse                  │
│                                                             │
│ • Aktiver Tab: Lila Icon + Label                           │
│ • Inaktiv: Grau                                            │
│ • Training-Tab ist größer/prominenter                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Screen-Hierarchie

```
Home
├── Quick Actions (Training starten, Plan erstellen)
├── Letzte Session (Zusammenfassung)
└── Sync-Status

Übungen
├── Liste aller Übungen (gruppiert nach Muskelgruppe)
├── [+] Neue Übung
└── Übung Detail
    ├── Name, Muskelgruppe
    ├── Quick Stats
    └── → Zu Analyse

Training
├── Plan auswählen
└── Aktive Session
    ├── Übungsliste
    ├── Set-Eingabe
    └── [Speichern]

Analyse
├── Übung auswählen
└── Charts
    ├── Leistungsindex
    ├── Durchschnittsgewicht
    └── Frequenz
```

### 7.4 Interaktionsprinzipien

| Prinzip | Umsetzung |
|---------|-----------|
| **Thumb Zone** | Wichtige Aktionen im unteren Drittel |
| **One-Handed Use** | Alles mit einer Hand erreichbar |
| **Instant Feedback** | Haptic Feedback bei Speichern |
| **Minimal Input** | Zahlen-Keyboard für Gewicht/Reps |
| **Smart Defaults** | Letzte Werte vorausgefüllt |
| **Undo > Confirm** | Lieber Rückgängig als "Bist du sicher?" |

---

## 8. Edge Cases & Fehlerbehandlung

### 8.1 Kritische Szenarien

#### Szenario 1: App-Absturz während Session

```
Problem:  User ist mitten im Training, App crasht
Lösung:   Session wird alle 10 Sekunden in LocalStorage gecached

Recovery Flow:
1. App startet neu
2. Check: Gibt es eine ungespeicherte Session?
3. JA → Modal: "Du hast ein ungespeichertes Training. Fortsetzen?"
   • [Fortsetzen] → Session wiederherstellen
   • [Verwerfen] → Cache löschen
4. NEIN → Normal starten
```

#### Szenario 2: Sync-Queue wächst unkontrolliert

```
Problem:  User trainiert wochenlang offline, Queue hat 800+ Einträge
Lösung:   Progressives Warning System

Queue-Größe | Aktion
------------|-----------------------------------------------
< 100       | Normal, kein Hinweis
100-500     | Kleiner Badge am Sync-Icon
500-800     | Banner: "Bitte verbinde dich zum Synchronisieren"
800-1000    | Modal: "Sync dringend erforderlich"
> 1000      | Neue Einträge werden verweigert bis Sync erfolgt
```

#### Szenario 3: User trainiert ohne Login (Edge Case)

```
Problem:  User startet App, überspringt Login, trainiert
Lösung:   Für MVP nicht unterstützt

Verhalten:
• App zeigt Login als einzigen Screen
• Kein "Später" oder "Überspringen"
• Offline-Login nur möglich wenn vorher online eingeloggt

Zukunft (Post-MVP):
• Anonyme lokale Sessions
• Bei Registrierung: "Möchtest du bisherige Daten übernehmen?"
```

#### Szenario 4: Server-Daten neuer als Client

```
Problem:  User hat auf Server (via Web?) etwas geändert,
          lokale App hat ältere Daten

Lösung:   
1. Bei App-Start: Server-Timestamp vs. lokaler Timestamp
2. Server neuer? → Pull Server-Daten
3. Merge nach Conflict Resolution Matrix (siehe 5.3)
4. UI zeigt kurz "Daten aktualisiert"
```

#### Szenario 5: Doppelte Übung erstellt (Offline-Conflict)

```
Problem:  User erstellt offline "Bankdrücken", 
          existiert aber schon auf Server

Lösung:
1. Bei Sync: Server meldet "Exercise exists"
2. Client prüft: Gleicher Name + gleiche Muskelgruppe?
3. JA → Lokale ID wird zu Server-ID gemapped
4. NEIN → Beide behalten, User kann später mergen
```

### 8.2 Error Messages (User-Facing)

```
┌─────────────────────────────────────────────────────────────┐
│ FEHLER-TEXTE (menschlich, nicht technisch)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Offline, kein Cache:                                        │
│ "Du bist offline. Bitte verbinde dich einmal mit dem       │
│  Internet, um deine Daten zu laden."                        │
│                                                             │
│ Login fehlgeschlagen:                                       │
│ "Email oder Passwort ist falsch. Versuch's nochmal."       │
│                                                             │
│ Sync fehlgeschlagen:                                        │
│ "Synchronisierung fehlgeschlagen. Deine Daten sind sicher  │
│  gespeichert und werden später synchronisiert."             │
│                                                             │
│ Session nicht wiederherstellbar:                            │
│ "Dein letztes Training konnte nicht wiederhergestellt      │
│  werden. Starte ein neues Training."                        │
│                                                             │
│ Pflichtfeld leer:                                           │
│ "Bitte gib einen Namen ein."                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Fallback-Verhalten

| Situation | Fallback |
|-----------|----------|
| Chart kann nicht rendern | Tabelle mit Rohdaten anzeigen |
| Bild/Icon lädt nicht | Emoji als Fallback |
| Muskelgruppen nicht geladen | Hardcoded Default-Liste |
| Letzte Werte nicht verfügbar | Felder leer, Placeholder "—" |

---

## 9. Tech-Stack Entscheidungen

### 9.1 Gewählter Stack

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| **Framework** | React 18 + Vite | Schneller Build, große Community, PWA-Support |
| **Sprache** | TypeScript (strict) | Type-Safety, bessere DX |
| **Styling** | TailwindCSS | Utility-First, Mobile-First by Design |
| **State** | Zustand | Minimal, kein Boilerplate, persisted state |
| **Offline DB** | Dexie.js (IndexedDB) | Reactive Queries, große Kapazität |
| **Data Fetching** | TanStack Query | Caching, Background Refresh, Offline |
| **Native Bridge** | Capacitor | Web → Native ohne Rewrite |
| **Service Worker** | Workbox | Background Sync, Precaching |
| **Charts** | Recharts | React-Native, leichtgewichtig |
| **Backend** | Supabase | Auth + DB + Realtime out-of-the-box |
| **Deployment** | Vercel (Web) + App Stores | CI/CD, Preview Deploys |

### 9.2 Bewusst NICHT gewählt

| Technologie | Grund |
|-------------|-------|
| React Native | Overhead für simple App, PWA reicht |
| Redux | Zu komplex für diesen Scope |
| GraphQL | REST reicht, weniger Komplexität |
| Firebase | Vendor Lock-in, teurer bei Scale |
| SQLite (via WASM) | Dexie ist einfacher für Web |

### 9.3 Kapazitätsplanung

```
Lokaler Speicher (IndexedDB):
• Verfügbar: ~50% des freien Gerätespeichers
• Geschätzte Nutzung pro User/Jahr:
  - 150 Sessions × 5 Übungen × 4 Sets = 3000 Sets
  - ~0.5 KB pro Set = 1.5 MB/Jahr
  - Sicher für 10+ Jahre Nutzung

Sync-Bandbreite:
• Initial Sync: ~50 KB (Exercises + Plans)
• Session Sync: ~5 KB pro Session
• Monthly: ~500 KB bei 3×/Woche Training
```

---

## 10. Anhang: Code-Referenzen

> **Hinweis:** Dieser Abschnitt enthält Referenz-Snippets für Implementierungsdetails. 
> KI-Agenten sollten diese als Startpunkt nutzen, nicht als finale Implementierung kopieren.

### A. Projektstruktur (Empfohlen)

```
/fitness-app
├── /src
│   ├── /app              # Seiten/Routes (React Router oder File-based)
│   ├── /components       # UI-Komponenten
│   │   ├── /ui           # Generische Komponenten (Button, Card, Input)
│   │   └── /features     # Feature-spezifische Komponenten
│   ├── /lib
│   │   ├── /db           # Dexie Setup + Schema
│   │   ├── /api          # API Client + Sync Logic
│   │   └── /utils        # Helper Functions
│   ├── /stores           # Zustand Stores
│   └── /types            # TypeScript Types
├── /public
│   └── manifest.json     # PWA Manifest
└── capacitor.config.ts
```

### B. Dexie Schema (Kurzform)

```typescript
// Nur Schema-Definition, keine Implementierungsdetails
db.version(1).stores({
  exercises: 'id, userId, muscleGroupId, syncStatus',
  trainingPlans: 'id, userId, syncStatus',
  planExercises: 'id, planId, exerciseId',
  trainingSessions: 'id, planId, startedAt, syncStatus',
  exerciseSets: 'id, sessionId, exerciseId, syncStatus',
  syncQueue: '++id, tableName, timestamp'
});
```

### C. Sync-Queue Interface

```typescript
interface SyncQueueItem {
  id?: number;
  tableName: string;
  operation: 'create' | 'update' | 'delete';
  recordId: string;
  payload: unknown;
  timestamp: Date;
  retryCount: number;
}
```

### D. Session Recovery Check (Pseudo-Code)

```
ON_APP_START:
  cached_session = localStorage.get('active_session')
  IF cached_session EXISTS AND cached_session.completedAt IS NULL:
    SHOW recovery_modal
  ELSE:
    CONTINUE normal_boot
```

### E. Change Detection Logic (Pseudo-Code)

```
ON_SESSION_SAVE:
  FOR EACH exercise IN session.exercises:
    FOR EACH set IN exercise.sets:
      IF set.weight ≠ set.originalWeight 
         OR set.reps ≠ set.originalReps
         OR set.notes ≠ set.originalNotes:
        
        WRITE set TO database
        ADD set TO syncQueue
      
      ELSE:
        SKIP (no database write)
```

---

## 📎 Dokument-Metadaten

```yaml
erstellt: 2024-01-XX
version: 2.0
autor: KI-generiert, User-reviewed
status: Ready for Development
nächste_review: Nach MVP Launch
```

---

**Dieses Dokument beschreibt WAS gebaut werden soll und WARUM.**  
**Implementierungsdetails (WIE) gehören in separate technische Spezifikationen.**
