# Contribution Guide
## Content
1. Very condensed
1.1 Code Conventions
1.2 Naming Conventions
1.3 Characteristics of a "good" merge request
2. Merge Request
3. Full example

Straight to the [Quick Start Guide](https://git.mtv.tu-berlin.de/modysy-2020sose/quarantine/-/wikis/intern/Quick-Start-Guide) on how to use GitLab.

## Very condensed
### Code conventions
* Every method and loop should have a short and descriptive comment
* Spaces behind list elements and method parameters
  * e.g. `['a', 'b', 'c']`, not `['a','b','c']`
  * e.g. `x = 1`, not `x=1`
* Seperate blocks of code with empty lines
* Open parenthesis behind methods e.g. `private setupCollision(): void {`

### Naming conventions
* Use CamelCase e.g. `MyClass`
* Enums in Caps-Lock e.g. `INFECTED`

Generally speaking: _Think about the person which will read your code and make your code easy to understend and good looking._

### Characteristics of a "good" merge request
... should contain ...
* __Clear and descriptive Title__ to identify the implemented feature
* __Description of the changes__
* __Helpful Documentation__


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
It’s not! Patches without documentation will be returned to sender. Otherwise we'll have a lot of work later on and complicate the development process for each other.



## Full Example
### Preparing your project
1. Clone project: `git clone ssh://git@git.mtv.tu-berlin.de:2222/modysy-2020sose/quarantine.git`
2. Navigate to the project folder
3. Create a branch: `git branch <branch-name>`
4. Change to this branch: `git checkout <branch-name>` 

### Making your changes
1. Stage your changed files for commit: `git add <datei-name>`
2. Make your commit: `git commit -m "Ausführliche Beschreibung der vorgenommenen Änderungen."`
3. Upload your commit with all the changes: `git push`

### Merge Request erstellen
1. Click 'Create merge request' on GitLab
2. Chose a descriptive title
3. In the description field
  * Write down the issue number (if issue exists) or describe issue
  * Describe your fix/new code
    * Which changes have been made?
    * What are new functionalities?
  * If the issue should be closed automatically: `Closes #<Issue-Nummer>`