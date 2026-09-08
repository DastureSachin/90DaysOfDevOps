# Day 24 – Advanced Git: Merge, Rebase, Squash, Stash & Cherry-Pick

## 🎯 Day 24 Goal

Today I learned how to manage changes between Git branches.

The main concepts are:

* **Merge** → Join branches
* **Rebase** → Move/replay my commits on top of another branch
* **Squash** → Combine multiple commits into one
* **Stash** → Temporarily save unfinished work
* **Cherry-pick** → Take one specific commit

---

# 1. Git Merge

## What is Git Merge?

`git merge` is used to combine changes from one branch into another branch.

Example:

```text
main
  |
  A
  |
  B
   \
    C
    |
    D
  feature
```

If I want the feature changes in `main`:

```bash
git checkout main
git merge feature
```

---

## Fast-Forward Merge

A fast-forward merge happens when `main` has not changed after the feature branch was created.

```text
A → B → C → D
            ↑
          main
```

Git simply moves the `main` pointer forward.

### Important:

* No new merge commit
* History remains linear
* Happens when there is no divergence

### Interview answer:

> A fast-forward merge happens when the target branch has no new commits after the feature branch was created. Git simply moves the branch pointer forward without creating a new merge commit.

---

## Merge Commit

A merge commit happens when both branches have new commits.

```text
       C → D
      /     \
A → B       M
      \     /
       E → F
```

Git creates `M` to combine the two histories.

### Important:

* Branches have diverged
* Git creates a new merge commit
* The merge commit has two parents
* The original branching history is preserved

### Interview answer:

> A merge commit is created when the branches have diverged and both contain independent commits. Git creates a new commit to combine their histories.

---

# 2. Merge Conflict

A merge conflict happens when Git cannot automatically combine changes.

A common example is when two branches change the same line differently.

Git may show:

```text
<<<<<<< HEAD
Hello from main
=======
Hello from feature
>>>>>>> feature
```

I need to manually decide which content should remain.

Then:

```bash
git add .
git commit -m "resolve merge conflict"
```

### If I want to cancel the merge:

```bash
git merge --abort
```

### Interview answer:

> A merge conflict occurs when Git cannot automatically combine changes, usually because the same part of a file was modified differently in two branches. I resolve the conflict manually, stage the file, and commit the resolution.

---

# 3. Git Rebase

## What is Rebase?

Rebase is used to put my branch's commits on top of the latest version of another branch.

Before rebase:

```text
A → B → C        main
     \
      D → E      feature
```

Run:

```bash
git checkout feature
git rebase main
```

After rebase:

```text
A → B → C → D' → E'
```

Git takes my feature commits and replays them on top of the latest `main`.

---

## What happens during Rebase?

Git:

1. Takes the feature commits aside
2. Moves the feature branch to the latest `main`
3. Replays the feature commits one by one
4. Creates new commit hashes for the replayed commits

### Important:

Rebase **rewrites history**.

The original commits and the rebased commits have different hashes.

---

## Merge vs Rebase

### Merge:

```text
       D → E
      /     \
A → B       M
      \     /
       C
```

### Rebase:

```text
A → B → C → D' → E'
```

### Main difference:

| Merge                             | Rebase                      |
| --------------------------------- | --------------------------- |
| Combines branches                 | Replays commits             |
| Preserves branch history          | Creates linear history      |
| Can create merge commit           | Usually no merge commit     |
| Does not rewrite existing commits | Rewrites commit history     |
| Good for shared branches          | Best for private/local work |

### Interview answer:

> Merge preserves the branching history, while rebase creates a cleaner linear history by replaying my commits on top of a new base.

---

## ⚠️ Why should I avoid rebasing shared commits?

Suppose I already pushed my commits and another developer pulled them.

If I rebase, Git creates new commit hashes.

This means my history and my teammate's history can become different.

### Easy rule:

> **Do not rebase commits that have already been shared with others unless the team has an agreed workflow for it.**

### Interview answer:

> I avoid rebasing shared commits because rebase rewrites history and changes commit hashes. This can create conflicts and confusion for other developers who already have the original commits.

---

# 4. Git Squash

## What is Squash?

Suppose my feature branch has:

```text
Commit 1 → Add feature
Commit 2 → Fix typo
Commit 3 → Formatting
Commit 4 → Fix bug
Commit 5 → Final cleanup
```

Instead of adding all five commits to `main`, I can combine them into one.

```bash
git checkout main
git merge --squash feature
git commit -m "feat: add feature"
```

Now `main` gets one commit:

```text
feat: add feature
```

### Easy meaning:

> **Squash = Many commits → One commit**

---

## Why use Squash?

Squash is useful when a feature branch contains many small or temporary commits such as:

```text
wip
fix
fix typo
formatting
another fix
final fix
```

I can turn them into one meaningful commit before adding the feature to `main`.

### Interview answer:

> Squash merge combines multiple commits from a feature branch into a single commit on the target branch. It is useful for keeping the main branch history clean.

---

## Trade-off of Squashing

### Advantages:

* Cleaner history
* Easier to read `git log`
* One commit represents the whole feature

### Disadvantages:

* Individual commit history is lost from the target branch
* Harder to inspect each small change
* Less granular history for debugging

---

# 5. Git Stash

## What is Git Stash?

`git stash` temporarily saves my uncommitted changes.

Imagine:

I'm working on a feature:

```text
feature-login
```

I have unfinished work.

Suddenly, I need to switch to another branch to fix an urgent issue.

I don't want to commit unfinished code.

So I use:

```bash
git stash
```

Now my working directory becomes clean.

I can switch branches:

```bash
git checkout main
```

After finishing the urgent work, I return:

```bash
git checkout feature-login
```

Then restore my work:

```bash
git stash pop
```

### Easy meaning:

> **Stash = Temporarily put unfinished work on a shelf.**

---

## Stash with a message

Instead of:

```bash
git stash
```

I can use:

```bash
git stash push -m "login work in progress"
```

This makes it easier to identify the stash later.

---

## View Stashes

```bash
git stash list
```

Example:

```text
stash@{0} login work
stash@{1} dashboard work
stash@{2} testing work
```

---

## Apply a Specific Stash

```bash
git stash apply stash@{1}
```

This restores that specific stash.

---

# `git stash pop` vs `git stash apply`

This is an important interview question.

### `git stash pop`

```bash
git stash pop
```

Restores the changes **and removes the stash**.

```text
POP
 ↓
Restore changes
 ↓
Remove stash
```

### `git stash apply`

```bash
git stash apply stash@{0}
```

Restores the changes but **keeps the stash**.

```text
APPLY
 ↓
Restore changes
 ↓
Keep stash
```

### Easy memory:

> **POP = Restore + Remove**

> **APPLY = Restore + Keep**

### Interview answer:

> `git stash pop` restores the stash and removes it from the stash list. `git stash apply` restores the stash but keeps it in the stash list.

---

# 6. Git Cherry-Pick

## What is Cherry-Pick?

Cherry-pick allows me to take **one specific commit** from another branch and apply it to my current branch.

Suppose:

```text
feature-hotfix

A → B → C
```

I only want commit `B`.

First find the commit:

```bash
git log --oneline
```

Then:

```bash
git checkout main
git cherry-pick <B-commit-hash>
```

Only the changes from that commit are applied to `main`.

### Easy meaning:

> **Cherry-pick = Pick one specific commit.**

---

## Real-World Example

Imagine a feature branch contains:

```text
Commit 1 → New payment UI
Commit 2 → Critical bug fix
Commit 3 → New payment design
```

The complete feature isn't ready.

But the bug fix is urgent.

I can use:

```bash
git cherry-pick <commit-2-hash>
```

Now I can bring only the bug fix into `main`.

### Interview answer:

> Cherry-pick applies the changes from a specific commit onto the current branch without merging the entire source branch.

---

## What can go wrong with Cherry-Pick?

### 1. Merge conflicts

The target branch may have changed the same code.

### 2. Missing dependencies

The selected commit may depend on an earlier commit that I didn't cherry-pick.

### 3. Duplicate changes

If I cherry-pick a commit and later merge the original branch, the same change may exist as separate commits.

---

# 7. Git History Visualization

One of the most useful commands from Day 24 is:

```bash
git log --oneline --graph --all
```

It helps me see:

* All branches
* Commit history
* Branches joining
* Branches diverging
* Merge commits

Example:

```text
*   abc123 Merge branch 'feature'
|\
| * def456 Feature commit
| * ghi789 Feature commit
|/
* jkl012 Main commit
```

### Interview tip:

If an interviewer asks:

> "How do you visualize Git branch history?"

Answer:

```bash
git log --oneline --graph --all
```

---

# 🧠 Key Takeaways – Interview Revision

| Concept                | Easy Meaning                                  | Interview Keyword |
| ---------------------- | --------------------------------------------- | ----------------- |
| **Fast-forward merge** | Main didn't diverge, so pointer moves forward | No new commit     |
| **Merge commit**       | Branches diverged and Git joins them          | Two parents       |
| **Merge conflict**     | Git cannot automatically combine changes      | Manual resolution |
| **Rebase**             | Replay commits on a new base                  | Linear history    |
| **Squash merge**       | Combine multiple commits into one             | Clean history     |
| **Stash**              | Temporarily save unfinished work              | Context switching |
| **Cherry-pick**        | Apply one specific commit                     | Selective change  |

---

# ⚡ Quick Reference – Commands

## Merge

```bash
git checkout main
git merge <branch>
```

## Abort Merge

```bash
git merge --abort
```

## Rebase

```bash
git checkout feature
git rebase main
```

## Continue Rebase

```bash
git rebase --continue
```

## Abort Rebase

```bash
git rebase --abort
```

## Squash

```bash
git checkout main
git merge --squash <branch>
git commit -m "message"
```

## Stash

```bash
git stash
git stash push -m "message"
```

## List Stashes

```bash
git stash list
```

## Apply Stash

```bash
git stash apply stash@{0}
```

## Pop Stash

```bash
git stash pop
```

## Delete Stash

```bash
git stash drop stash@{0}
```

## Cherry-Pick

```bash
git cherry-pick <commit-hash>
```

## Continue Cherry-Pick

```bash
git cherry-pick --continue
```

## Abort Cherry-Pick

```bash
git cherry-pick --abort
```

## View Git History

```bash
git log --oneline --graph --all
```

---

# 🔥 Day 24 – One-Minute Revision

Before an interview, remember this:

```text
MERGE
↓
Join branches
↓
Preserves branch history


REBASE
↓
Replay commits on latest base
↓
Clean linear history
↓
Don't normally rebase shared commits


SQUASH
↓
Many commits → One commit
↓
Clean main history


STASH
↓
Save unfinished work temporarily
↓
Useful when switching tasks


CHERRY-PICK
↓
Select one commit
↓
Useful for a specific fix
```

---

# 🎤 Most Important Interview Answers

### What is merge?

> Merge combines changes from one branch into another branch.

### What is fast-forward merge?

> It happens when the target branch has not diverged, so Git simply moves the branch pointer forward without creating a new commit.

### What is a merge conflict?

> A conflict occurs when Git cannot automatically combine changes, commonly because the same part of a file was changed differently on two branches.

### What is rebase?

> Rebase moves my branch onto a new base and replays my commits on top of it, producing a cleaner linear history.

### Why shouldn't we rebase shared commits?

> Because rebase rewrites history and creates new commit hashes, which can cause problems for people who already have the original commits.

### What is squash?

> Squash combines multiple commits into one commit.

### What is stash?

> Stash temporarily saves uncommitted changes so I can switch branches without committing unfinished work.

### Pop vs Apply?

> Pop restores and removes the stash. Apply restores but keeps the stash.

### What is cherry-pick?

> Cherry-pick applies the changes from one specific commit onto the current branch without merging the entire branch.

---

# ⭐ Final Memory Trick

```text
MERGE        = JOIN
REBASE       = REPLAY
SQUASH       = COMBINE
STASH        = SAVE
CHERRY-PICK  = SELECT
```

If I remember these five words, I can recall the purpose of all the major Day 24 commands.
