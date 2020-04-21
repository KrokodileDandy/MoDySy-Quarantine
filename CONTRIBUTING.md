# Richtlinien zum Mitwirken

Dieses Dokument soll Euch dabei helfen, wohlgeformte Merge Request beizutragen und hilfreiche Issues zu erstellen.

## Vorbereitung
Bevor Ihr einen Merge Request eröffnet, prüft folgende Dinge:
1. Bringt euren eigenen Branch auf den gleichen Stand wie `master`
	1. Alle bisherigen Änderungen auf euren Branch commiten `git commit -m "<commit-message>"`
	2. Änderungen von 'master' einholen: `git pull origin master`
2. `npm run dev` compiliert
3. `npm run lint` gibt keine Fehlermeldung zurück


## Version control branching

Inspiriert durch <a href="www.contribution-guide.org">www.contribution-guide.org</a>

* __Erstellt immer einen neuen Branch__ für Eure Arbeit, egal wie klein die Änderungen sind.
  * Daraus folg: __Submittet nicht unzusammenhängende Änderungen auf dem gleichen Branch/Merge Request!__
* __Basiert euren neuen Branch auf den passenden Branches__ des Main Repositories:
  * __Bug fixes__ sollten auf dem Branch basieren, mit dem der __Bug eingeführt wurde__
    * Z.B.: Ein Feature wurde mit Version 1.1 implemeniert, die aktuelle Version ist 1.3 und ein Bug wurde in diesem Feature gefunden. Erstellt euren Branch basierend auf 1.1.
  * __Neue Features__ sollten vom __'master' branch__ branchen
* __Kommentiert Euren Code__


## Wie sieht eine gute Merge Request aus?
* __Klarer und beschreibender Titel__ um das zu implementierende Feature zu identifizieren
* __Beschreibung, welche Änderungen vorgenommen wurden__
* Die __Dokumentation wurde aktualisiert__


## Die Dokumentation ist nicht optional
Patches ohne Dokumentation werden nicht gemerged. Sonst haben wir zum Schluss einen haufen Arbeit und erschweren uns gegenseitig den Entwicklungsprozess.


## Praxis-Beispiel
### Projekt kopieren
1. Projekt kopieren: `git clone ssh://git@git.mtv.tu-berlin.de:2222/modysy-2020sose/quarantine.git`
2. Projektordner aufrufen
3. Branch erstellen: `git branch <branch-name>`
4. Zum Branch wechseln: `git checkout <branch-name>` 

### Änderungen vornehmen
1. Geänderte Dateien stagen: `git add <datei-name>`
2. Geänderte Dateien commiten: `git commit -m "Ausführliche Beschreibung der vorgenommenen Änderungen."`
3. Änderungen auf den Branch hochladen: `git push`

### Merge Request erstellen
1. Auf GitLab neue Merge Request erstellen
2. Markanten Titel eintragen
3. Beschreibung hinzufügen
  * Welche Änderungen wurden vorgenommen? / Was sind die neuen Funktionalitäten?
  * Wenn damit ein Issue abgeschlossen werden soll: `Closes #<Issue-Nummer>`