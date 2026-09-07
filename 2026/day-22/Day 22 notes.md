# Day 22 – Git & GitHub Notes

## What is Git?

Git is a **Distributed Version Control System (DVCS)** used to track changes in files and manage source code.

Git helps developers:

* Track changes
* Create different versions of code
* Work with branches
* Collaborate with other developers
* Restore previous versions

---

## What is GitHub?

GitHub is a **cloud-based platform** used to store and manage Git repositories online.

Git = Version control tool
GitHub = Platform for hosting Git repositories

---

## Git Repository

A Git repository is a project directory tracked by Git.

When we run:

```bash
git init
```

Git creates a hidden `.git` directory.

The `.git` directory contains Git's tracking information, history, branches, and configuration.

---

## Git Workflow

The basic Git workflow is:

```text
Working Directory
       ↓
   git add
       ↓
Staging Area
       ↓
 git commit
       ↓
Local Repository
       ↓
  git push
       ↓
GitHub Repository
```

---

## Three Important Areas

### 1. Working Directory

The files where we make changes.

### 2. Staging Area

Files selected to be included in the next commit.

Command:

```bash
git add filename
```

### 3. Local Repository

Contains committed changes.

Command:

```bash
git commit
```

---

## Git Commit

A commit is a saved snapshot of changes in the Git repository.

Example:

```bash
git commit -m "Add Git notes"
```

A good commit message should clearly describe what was changed.

---

## Git Branch

A branch is an independent line of development.

The default branch is commonly:

```text
main
```

Branches allow us to work on features or changes without directly modifying the main code.

---

## Remote Repository

A remote repository is a Git repository hosted somewhere outside our local machine.

Example:

```text
GitHub
```

We can connect a local repository to GitHub using:

```bash
git remote add origin <repository-url>
```

---

## Git Push

`git push` sends local commits to the remote repository.

```bash
git push origin main
```

---

## Git Pull

`git pull` downloads changes from the remote repository and integrates them into the current branch.

```bash
git pull origin main
```

---

## Git Clone

`git clone` creates a local copy of an existing remote repository.

```bash
git clone <repository-url>
```

---

## Git Status

`git status` shows the current state of the working directory and staging area.

```bash
git status
```

It helps us understand:

* Modified files
* Untracked files
* Staged files
* Current branch

---

## Git Log

`git log` displays commit history.

```bash
git log
```

Short version:

```bash
git log --oneline
```

---

## Git Add

`git add` moves changes from the working directory to the staging area.

Add one file:

```bash
git add filename
```

Add all changed files:

```bash
git add .
```

---

## Git Reset

`git reset` can remove files from the staging area.

Example:

```bash
git reset filename
```

This unstages the file but keeps the changes in the working directory.

---

## Git Diff

`git diff` shows changes that have not been staged.

```bash
git diff
```

---

## Git Remote

`git remote` manages connections to remote repositories.

Check remote:

```bash
git remote -v
```

---

## Git Configuration

Git configuration can be checked using:

```bash
git config --list
```

Set username:

```bash
git config --global user.name "Your Name"
```

Set email:

```bash
git config --global user.email "your@email.com"
```

---

## Basic Git Workflow

For a new project:

```bash
mkdir project
cd project

git init

git add .

git commit -m "Initial commit"

git remote add origin <repository-url>

git push -u origin main
```

---

## Important Git Concepts

| Concept           | Meaning                                         |
| ----------------- | ----------------------------------------------- |
| Git               | Version control system                          |
| GitHub            | Platform for hosting Git repositories           |
| Repository        | Project tracked by Git                          |
| Working Directory | Where we modify files                           |
| Staging Area      | Changes prepared for commit                     |
| Commit            | Saved snapshot of changes                       |
| Branch            | Separate line of development                    |
| Remote            | External repository                             |
| Push              | Send commits to remote                          |
| Pull              | Get and integrate remote changes                |
| Clone             | Copy a remote repository locally                |
| `.git`            | Directory containing Git repository information |

---

## Quick Revision

```text
git init       → Initialize repository
git status     → Check repository status
git add        → Stage changes
git commit     → Save changes
git log        → View commit history
git branch     → Manage branches
git remote     → Manage remote repository
git push       → Upload commits
git pull       → Download and integrate changes
git clone      → Copy remote repository
```
