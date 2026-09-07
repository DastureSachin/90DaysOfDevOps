# Day 22 – Git Commands

## 1. Check Git Version

```bash
git --version
```

Shows the installed Git version.

---

## 2. Configure Git

Set username:

```bash
git config --global user.name "Your Name"
```

Set email:

```bash
git config --global user.email "your@email.com"
```

Check configuration:

```bash
git config --list
```

---

## 3. Initialize a Repository

```bash
git init
```

Creates a new Git repository in the current directory.

---

## 4. Check Repository Status

```bash
git status
```

Shows modified, staged, and untracked files.

---

## 5. Add Files to Staging

Add one file:

```bash
git add filename
```

Add all files:

```bash
git add .
```

---

## 6. Commit Changes

```bash
git commit -m "Add project files"
```

Creates a commit with a message.

---

## 7. View Commit History

Full history:

```bash
git log
```

Short history:

```bash
git log --oneline
```

---

## 8. View Changes

```bash
git diff
```

Shows unstaged changes.

---

## 9. View Branches

```bash
git branch
```

Shows local branches.

---

## 10. Create a Branch

```bash
git branch feature
```

Creates a new branch.

---

## 11. Switch Branch

```bash
git switch feature
```

Switches to the `feature` branch.

Alternative:

```bash
git checkout feature
```

---

## 12. Create and Switch to a Branch

```bash
git switch -c feature
```

Creates a new branch and switches to it.

---

## 13. Rename Current Branch

```bash
git branch -M main
```

Renames the current branch to `main`.

---

## 14. Delete a Branch

```bash
git branch -d feature
```

Deletes a local branch.

---

## 15. Add GitHub Remote

```bash
git remote add origin <repository-url>
```

Connects the local repository to a GitHub repository.

---

## 16. Check Remote

```bash
git remote -v
```

Shows configured remote repositories.

---

## 17. Push Changes to GitHub

```bash
git push origin main
```

Uploads local commits to the `main` branch.

First push:

```bash
git push -u origin main
```

`-u` sets the upstream branch.

After that, you can usually use:

```bash
git push
```

---

## 18. Pull Changes from GitHub

```bash
git pull origin main
```

Downloads and integrates changes from the remote `main` branch.

---

## 19. Clone a Repository

```bash
git clone <repository-url>
```

Downloads a remote repository to your local machine.

---

## 20. Unstage a File

```bash
git reset filename
```

Removes the file from the staging area but keeps the changes.

---

## 21. Remove a File

```bash
git rm filename
```

Removes the file and stages the deletion.

---

## 22. Show Remote Information

```bash
git remote show origin
```

Shows information about the `origin` remote.

---

# Basic Git Workflow

```bash
# Create project
mkdir my-project
cd my-project

# Initialize Git
git init

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Rename branch
git branch -M main

# Connect GitHub repository
git remote add origin <repository-url>

# Push to GitHub
git push -u origin main
```

---

# Daily Git Workflow

When working on an existing repository:

```bash
git status

git pull

# Make changes

git status

git add .

git commit -m "Describe the changes"

git push
```

---

# Git Command Cheat Sheet

| Command         | Purpose               |
| --------------- | --------------------- |
| `git --version` | Check Git version     |
| `git config`    | Configure Git         |
| `git init`      | Initialize repository |
| `git status`    | Check status          |
| `git add`       | Stage changes         |
| `git commit`    | Create commit         |
| `git log`       | View history          |
| `git diff`      | View changes          |
| `git branch`    | Manage branches       |
| `git switch`    | Switch branches       |
| `git remote`    | Manage remote         |
| `git clone`     | Clone repository      |
| `git pull`      | Get remote changes    |
| `git push`      | Upload commits        |
| `git reset`     | Unstage changes       |
| `git rm`        | Remove a file         |

---

# Remember

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
     GitHub
```
