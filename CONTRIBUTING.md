# Richtlinien zum Mitwirken

Straight to the [Quick Start Guide](https://git.mtv.tu-berlin.de/modysy-2020sose/quarantine/-/wikis/intern/Quick-Start-Guide)

## Code Conventions
* Kommentiere jede Methode und Schleife kurz und prägnant
* Leerzeichen hinter Listenelementen und Methodenparametern
  * z.B. `['a', 'b', 'c']`, nicht `['a','b','c']` oder `x = 1`, nicht `x=1`
* Grenzt logisch zusammenhängende Blöcke mit Leerzeilen voneinander ab
* Klammern hinter Methoden öffnen
  * also z.B. `private setupCollision(): void {`

## Naming Conventions
* CamelCase für Variablennamen und Klassennamen
* Enums in Caps-Lock

Allgemein gilt: _Versetzt euch in die Person hinein, die euren Code lesen soll und sorgt dafür, dass eure Arbeit leicht zu verstehen ist und gut aussieht._


## Merge Requests
### Vorbereitung
Bevor Ihr einen Merge Request eröffnet, prüft folgende Dinge:
1. Bringt euren eigenen Branch auf den gleichen Stand wie `master`
	1. Alle bisherigen Änderungen auf euren Branch commiten `git commit -m "<commit-message>"`
	2. Änderungen von 'master' einholen: `git pull origin master`
2. `npm run dev` compiliert
3. `npm run lint` gibt keine Fehlermeldung zurück

## Contributing changes
### Version control branching

Based upon <a href="www.contribution-guide.org">www.contribution-guide.org</a>

* Always __make a new branch__ for your work, no matter how small. This makes it easy for others to take just that one set of changes from your repository, in case you have multiple unrelated changes floating around.
  * A corollary: __don’t submit unrelated changes in the same branch/pull request!__ The maintainer shouldn’t have to reject your awesome bugfix because the feature you put in with it needs more review.
* Base your new branch off of the appropriate branch on the main repository:
  * __Bug fixes__ should be based on the branch named after the oldest supported release line the bug affects.
    * E.g. if a feature was introduced in 1.1, the latest release line is 1.3, and a bug is found in that feature - make your branch based on 1.1. The maintainer will then forward-port it to 1.3 and master.
    * Bug fixes requiring large changes to the code or which have a chance of being otherwise disruptive, may need to base off of __master__ instead. This is a judgement call 
  * __New features__ should branch off of __the ‘master’ branch__.

### Code formatting
* fdaf

### Documentation isn't optional
It’s not! Patches without documentation will be returned to sender. By “documentation” I mean:

Patches ohne Dokumentation werden nicht gemerged. Sonst haben wir zum Schluss einen haufen Arbeit und erschweren uns gegenseitig den Entwicklungsprozess.


### Wie sieht eine gute Merge Request aus?
* __Klarer und beschreibender Titel__ um das zu implementierende Feature zu identifizieren
* __Beschreibung, welche Änderungen vorgenommen wurden__
* Die __Dokumentation wurde aktualisiert__





### Praxis-Beispiel
#### Projekt kopieren
1. Projekt kopieren: `git clone ssh://git@git.mtv.tu-berlin.de:2222/modysy-2020sose/quarantine.git`
2. Projektordner aufrufen
3. Branch erstellen: `git branch <branch-name>`
4. Zum Branch wechseln: `git checkout <branch-name>` 

#### Änderungen vornehmen
1. Geänderte Dateien stagen: `git add <datei-name>`
2. Geänderte Dateien commiten: `git commit -m "Ausführliche Beschreibung der vorgenommenen Änderungen."`
3. Änderungen auf den Branch hochladen: `git push`

#### Merge Request erstellen
1. Auf GitLab neue Merge Request erstellen
2. Markanten Titel eintragen
3. Beschreibung hinzufügen
  * Welche Änderungen wurden vorgenommen? / Was sind die neuen Funktionalitäten?
  * Wenn damit ein Issue abgeschlossen werden soll: `Closes #<Issue-Nummer>`