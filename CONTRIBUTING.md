# Contribution Guide

## Content

[1. Very condensed](#very-condensed)  
[1.1 Code Conventions](#code-conventions)  
[1.2 Naming Conventions](#naming-conventions)  
[1.3 Characteristics of a "good" merge request](#characteristics-of-a-good-merge-request)  
[2. Merge Request](#merge-requests)  
[2.1 Preparation](#preparation)  
[3. Contributing Changes](#contributing-changes)  
[3.1 Version Control Branching](#version-control-branching)  
[3.2 Commit Messages](#commit-messages)  
[3.2.1 The Seven Rules of a Great Git Commit Message](#the-seven-rules-of-a-great-git-commit-message)  
[3.3 Documentation isn't Optional](#documentation-isnt-optional)  
[4. Full example](#full-example)  

Straight to the [Quick Start Guide](https://git.mtv.tu-berlin.de/modysy-2020sose/quarantine/-/wikis/intern/Quick-Start-Guide) on how to use GitLab.

## Very condensed

### Code conventions

* Every method and loop should have a short and descriptive comment
* Spaces behind list elements and method parameters
  * e.g. `['a', 'b', 'c']`, not `['a','b','c']`
  * e.g. `x = 1`, not `x=1`
* Seperate blocks of code with empty lines
* Open parenthesis behind methods e.g. `private setupCollision(): void {`
* No empty lines between the documentation and the first line of the class/method

### Naming conventions

* Use CamelCase e.g. `MyClass`
* Enums in Caps-Lock e.g. `INFECTED`

Generally speaking: _Think about the person which will read your code and make your code easy to understend and good looking._

### Characteristics of a "good" merge request

... should contain ...

* __Clear and descriptive Title__ to identify the implemented feature
* __Description of the changes__
  * If the issue you are solving has a good description just link that issue. But if you made changes not remarked in the issue description pleas add them here.
* __Helpful Documentation__ (see [here](#documentation-isnt-optional))

## Merge Requests

### Preparation

Before opening a new merge request please check the following:

1. Update your branch to fit the state of `master`
	1. Commit all your changes: `git commit -m "<commit-message>"`
	2. Get current version of master: `git pull origin master`
2. `npm run dev` compiles without errors
3. `npm run lint` doesn't return error messages
4. `npm run test` doesn't throw any errors

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

### Commit messages

To write great commit messages you have to use a text editor. Type `git config --global core.editor "<editor-name>"` to define one of your choice.

#### The seven rules of a great Git commit message

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain _what_ and _why_ vs. _how_

For example:

```
Summarize changes in around 50 characters or less

More detailed explanatory text, if necessary. Wrap it to about 72
characters or so. In some contexts, the first line is treated as the
subject of the commit and the rest of the text as the body. The
blank line separating the summary from the body is critical (unless
you omit the body entirely); various tools like `log`, `shortlog`
and `rebase` can get confused if you run the two together.

Explain the problem that this commit is solving. Focus on why you
are making this change as opposed to how (the code explains that).
Are there side effects or other unintuitive consequences of this
change? Here's the place to explain them.

Further paragraphs come after blank lines.

 - Bullet points are okay, too

 - Typically a hyphen or asterisk is used for the bullet, preceded
   by a single space, with blank lines in between, but conventions
   vary here

```

For more information look [here](https://chris.beams.io/posts/git-commit/).

### Documentation isn't optional

It’s not! Patches without documentation will be returned to sender. Otherwise we'll have a lot of work later on and complicate the development process for each other.  
Insert your documentation in our [wiki](https://git.mtv.tu-berlin.de/modysy-2020sose/quarantine/-/wikis/Documentations).


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

### Create Merge Request

1. Click 'Create merge request' on GitLab
2. Chose a descriptive title
3. In the description field
  * Write down the issue number (if issue exists) or describe issue
  * Describe your fix/new code
    * Which changes have been made?
    * What are new functionalities?
  * If the issue should be closed automatically: `Closes #<Issue-Nummer>`
