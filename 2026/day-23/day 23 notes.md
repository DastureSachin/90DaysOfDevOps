# Day 23 – Git Branching & Working with GitHub

## What is a Git Branch?

A branch is a separate line of development in Git.

Branches allow us to work on features, fixes, and experiments without directly affecting the `main` branch.

```text
main
  |
  └── feature-1
```

---

## Why Do We Use Branches?

We use branches to:

* Work on features separately
* Test changes safely
* Fix bugs without affecting `main`
* Work with multiple developers
* Keep the `main` branch stable

---

## What is HEAD?

`HEAD` is a pointer that shows the branch or commit we are currently working on.

Example:

```text
HEAD → main
```

After switching:

```text
HEAD → feature-1
```

---

## What Happens When We Switch Branches?

When we switch branches, Git changes the files in the working directory to match the selected branch.

For example:

```text
main      → main version of files
feature-1 → feature version of files
```

---

# Branch Commands

## List Branches

```bash
git branch
```

Shows local branches.

---

## Create a Branch

```bash
git branch feature-1
```

Creates a new branch called `feature-1`.

---

## Switch Branch Using git switch

```bash
git switch feature-1
```

Switches to the `feature-1` branch.

---

## Create and Switch to a Branch

```bash
git switch -c feature-2
```

Creates `feature-2` and switches to it.

---

# Git Checkout

`git checkout` is an older Git command that can be used to switch branches.

```bash
git checkout feature-1
```

Switches to `feature-1`.

### Create and Switch to a Branch

```bash
git checkout -b feature-2
```

Creates `feature-2` and switches to it.

---

## git switch vs git checkout

### git switch

Mainly used for working with branches.

```bash
git switch feature-1
git switch -c feature-2
```

### git checkout

Older command that can be used for switching branches and other operations.

```bash
git checkout feature-1
git checkout -b feature-2
```

**Simple rule:**

```text
git switch   → Modern branch switching
git checkout → Older/more general command
```

---

# Make a Commit on a Branch

Switch to the branch:

```bash
git switch feature-1
```

Create or modify a file:

```bash
echo "Feature 1 work" > feature1.txt
```

Check changes:

```bash
git status
```

Stage the file:

```bash
git add feature1.txt
```

Commit the changes:

```bash
git commit -m "Add feature 1"
```

This commit exists on `feature-1` and not on `main`.

---

# Verify Branch Changes

Switch to `main`:

```bash
git switch main
```

Check commit history:

```bash
git log --oneline
```

The commit made on `feature-1` will not be part of the `main` branch history.

---

# Delete a Branch

```bash
git branch -d feature-2
```

Deletes a local branch.

Force delete:

```bash
git branch -D feature-2
```

---

# Working with GitHub

## Add GitHub Remote

```bash
git remote add origin <repository-url>
```

Connects the local repository to GitHub.

---

## Check Remote

```bash
git remote -v
```

Shows the configured remote repositories.

---

## Push Main Branch

```bash
git push -u origin main
```

Pushes the local `main` branch to GitHub.

---

## Push Feature Branch

```bash
git push -u origin feature-1
```

Pushes `feature-1` to GitHub.

---

# origin vs upstream

## origin

`origin` usually refers to our GitHub repository.

```text
origin → Your GitHub repository
```

## upstream

`upstream` usually refers to the original repository when working with a fork.

```text
upstream → Original repository
origin   → Your fork
```

---

# git fetch vs git pull

## git fetch

```bash
git fetch
```

Downloads information about changes from the remote repository but does not automatically merge those changes into the current branch.

---

## git pull

```bash
git pull
```

Downloads changes from the remote repository and integrates them into the current branch.

```text
git fetch
→ Download changes
→ No automatic merge

git pull
→ Download changes
→ Integrate changes
```

---

# Clone vs Fork

## Clone

Clone copies a repository from GitHub to the local machine.

```bash
git clone <repository-url>
```

```text
GitHub Repository
       ↓
     Clone
       ↓
Local Machine
```

---

## Fork

A fork creates a copy of another repository under your GitHub account.

```text
Original Repository
       ↓
      Fork
       ↓
Your GitHub Repository
```

A fork is a **GitHub feature**, not a Git command.

---

## When to Clone?

Clone when:

* You want a repository on your local machine
* You want to practice with a repository
* You have permission to work directly on the repository

---

## When to Fork?

Fork when:

* You don't have direct write access
* You want to contribute to another person's project
* You want your own GitHub copy of a repository

---

# Keep a Fork in Sync

Add the original repository as `upstream`:

```bash
git remote add upstream <original-repository-url>
```

Fetch changes:

```bash
git fetch upstream
```

Switch to main:

```bash
git switch main
```

Merge the changes:

```bash
git merge upstream/main
```

Push updated main to your fork:

```bash
git push origin main
```

---

# Basic Branch Workflow

```text
Create Branch
     ↓
Switch Branch
     ↓
Make Changes
     ↓
git add
     ↓
git commit
     ↓
git push
     ↓
GitHub
```

Example:

```bash
git branch feature-1

git switch feature-1

# Make changes

git add .

git commit -m "Add feature 1"

git push -u origin feature-1
```

---

# Quick Revision

| Command                   | Purpose                              |
| ------------------------- | ------------------------------------ |
| `git branch`              | List branches                        |
| `git branch <name>`       | Create a branch                      |
| `git switch <name>`       | Switch branch                        |
| `git switch -c <name>`    | Create and switch                    |
| `git checkout <name>`     | Switch branch                        |
| `git checkout -b <name>`  | Create and switch                    |
| `git branch -d <name>`    | Delete branch                        |
| `git remote -v`           | View remote                          |
| `git push`                | Push commits                         |
| `git fetch`               | Download remote changes              |
| `git pull`                | Download and integrate changes       |
| `git clone`               | Copy repository locally              |
| `git fetch upstream`      | Get changes from original repository |
| `git merge upstream/main` | Merge upstream changes               |

---

# Important Points

```text
Branch
→ Separate line of development

HEAD
→ Shows current branch/commit

git switch
→ Modern way to switch branches

git checkout
→ Older/general command for switching branches

git push
→ Send commits to GitHub

git fetch
→ Download remote changes

git pull
→ Download and integrate changes

clone
→ Copy repository to local machine

fork
→ Copy repository to your GitHub account

origin
→ Your remote repository

upstream
→ Original repository
```
