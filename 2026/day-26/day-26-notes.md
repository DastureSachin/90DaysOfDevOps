# Day 26 – GitHub CLI (`gh`) Notes

## What is GitHub CLI?

GitHub CLI (`gh`) is a command-line tool that lets us manage GitHub directly from the terminal.

Normally:

* `git` → works mainly with Git repositories, commits, branches, push, pull, fetch, etc.
* `gh` → works with GitHub features such as repositories, issues, pull requests, Actions, releases, and the GitHub API.

### Simple Example

Instead of opening GitHub in the browser to create an issue:

```bash
gh issue create --title "Bug found" --body "Login is not working"
```

We can create the issue directly from the terminal.

This is useful for DevOps because terminal commands can be repeated and automated in Bash scripts and CI/CD pipelines.

---

# Task 1: Install and Authenticate

## 1. Install GitHub CLI

On Ubuntu/Debian:

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

Check installation:

```bash
gh --version
```

Example:

```text
gh version 2.x.x
```

---

## 2. Login to GitHub

```bash
gh auth login
```

The interactive setup asks about:

1. GitHub.com or GitHub Enterprise
2. HTTPS or SSH
3. Browser login or Personal Access Token
4. Whether Git should also use the GitHub CLI credentials

---

## 3. Check Login Status

```bash
gh auth status
```

This shows:

* Logged-in GitHub account
* Authentication method
* Authentication status

If you have multiple accounts:

```bash
gh auth switch
```

---

## Authentication Methods

GitHub CLI supports these common authentication approaches:

### 1. Browser Login

The easiest method for normal interactive use.

```bash
gh auth login
```

Choose the browser option and follow the instructions.

### 2. Personal Access Token

A PAT can be useful when working on a server where a browser is not available.

### 3. SSH Key

SSH can be configured for Git operations such as:

```bash
git clone
git push
git pull
```

GitHub CLI API operations still use token-based authentication.

### 4. Environment Token

For CI/CD and automation:

```bash
GH_TOKEN
```

or:

```bash
GITHUB_TOKEN
```

can be used.

---

# Task 2: Working with Repositories

## 1. Create a New Public Repository

```bash
gh repo create day26-test-repo --public --add-readme
```

This creates:

```text
Repository: day26-test-repo
Visibility: Public
README: Added
```

### Useful Options

Create a private repository:

```bash
gh repo create day26-test-repo --private
```

Add a description:

```bash
gh repo create day26-test-repo \
  --public \
  --description "Day 26 GitHub CLI practice"
```

Create and clone:

```bash
gh repo create day26-test-repo --public --add-readme --clone
```

---

## 2. Clone a Repository Using `gh`

Instead of:

```bash
git clone https://github.com/OWNER/REPO.git
```

we can use:

```bash
gh repo clone OWNER/REPO
```

Example:

```bash
gh repo clone DastureSachin/90DaysOfDevOps
```

The main advantage is that we can use the simple:

```text
OWNER/REPO
```

format.

---

## 3. View Repository Details

```bash
gh repo view OWNER/REPO
```

Example:

```bash
gh repo view DastureSachin/90DaysOfDevOps
```

Open the repository in the browser:

```bash
gh repo view DastureSachin/90DaysOfDevOps --web
```

---

## 4. List Repositories

```bash
gh repo list
```

List up to 50 repositories:

```bash
gh repo list DastureSachin --limit 50
```

---

## 5. Open Repository in Browser

If you are inside the repository:

```bash
gh repo view --web
```

Or:

```bash
gh repo view OWNER/REPO --web
```

---

## 6. Delete the Test Repository

```bash
gh repo delete OWNER/day26-test-repo --yes
```

Example:

```bash
gh repo delete DastureSachin/day26-test-repo --yes
```

**Important:** Be very careful with this command because repository deletion is destructive.

---

# Task 3: GitHub Issues

An **Issue** is used to track:

* Bugs
* Tasks
* Feature requests
* Questions
* Other work

## 1. Create an Issue

```bash
gh issue create \
  --title "Bug: login is not working" \
  --body "Login fails when using an expired token." \
  --label bug
```

Example:

```text
Title: Bug: login is not working
Body: Login fails when using an expired token.
Label: bug
```

---

## 2. List Open Issues

```bash
gh issue list
```

Or:

```bash
gh issue list --state open
```

---

## 3. View an Issue

For example, issue number `12`:

```bash
gh issue view 12
```

Open it in the browser:

```bash
gh issue view 12 --web
```

---

## 4. Close an Issue

```bash
gh issue close 12
```

Reopen it:

```bash
gh issue reopen 12
```

---

## How Can `gh issue` Be Used in Automation?

A monitoring script can automatically create an issue when a problem is detected.

Example:

```bash
gh issue create \
  --title "Server backup failed" \
  --body "The backup script failed at $(date)" \
  --label bug
```

This can be useful for:

* Monitoring
* Incident management
* Log analysis
* Automated bug reporting
* Release checklists
* ChatOps

We can also get structured data:

```bash
gh issue list --json number,title,labels
```

This makes it easier for scripts to process GitHub Issues.

---

# Task 4: Pull Requests

A **Pull Request (PR)** is used to propose changes from one branch to another.

### Simple PR workflow

```text
Create branch
      ↓
Make changes
      ↓
Commit changes
      ↓
Push branch
      ↓
Create PR
      ↓
Review
      ↓
CI checks
      ↓
Merge
```

---

## 1. Create a Branch

```bash
git checkout -b feature/day26-notes
```

---

## 2. Make a Change

Example:

```bash
echo "GitHub CLI practice" >> notes.md
```

---

## 3. Add and Commit

```bash
git add notes.md
```

```bash
git commit -m "docs: add day 26 notes"
```

---

## 4. Push the Branch

```bash
git push -u origin feature/day26-notes
```

---

## 5. Create the Pull Request

```bash
gh pr create --fill
```

`--fill` can automatically use information from the commits to fill the PR title and body.

You can also write the title and body yourself:

```bash
gh pr create \
  --title "Add Day 26 GitHub CLI notes" \
  --body "Added GitHub CLI commands and explanations."
```

---

## 6. List Open Pull Requests

```bash
gh pr list
```

---

## 7. View Pull Request Details

```bash
gh pr view 15
```

Check CI/status checks:

```bash
gh pr checks 15
```

---

## 8. Merge a Pull Request

Squash merge:

```bash
gh pr merge 15 --squash --delete-branch
```

The `--delete-branch` option deletes the PR branch after merging.

---

# Pull Request Merge Methods

## 1. Merge Commit

```bash
gh pr merge 15 --merge
```

Creates a normal merge commit and keeps the branch commits.

## 2. Squash Merge

```bash
gh pr merge 15 --squash
```

Combines the PR commits into one commit.

## 3. Rebase Merge

```bash
gh pr merge 15 --rebase
```

Replays the commits onto the base branch without creating a merge commit.

---

# How to Review Someone Else's PR

View the PR:

```bash
gh pr view 15
```

View the changes:

```bash
gh pr diff 15
```

Checkout the PR locally:

```bash
gh pr checkout 15
```

Read comments:

```bash
gh pr view 15 --comments
```

Approve:

```bash
gh pr review 15 --approve -b "Looks good."
```

Request changes:

```bash
gh pr review 15 \
  --request-changes \
  -b "Please add a test for this change."
```

Add a general comment:

```bash
gh pr review 15 \
  --comment \
  -b "Looks good overall."
```

### Simple Review Flow

```text
gh pr view
     ↓
gh pr diff
     ↓
gh pr checkout
     ↓
Test the code
     ↓
gh pr review
```

---

# Task 5: GitHub Actions and Workflows

GitHub Actions is used to automate CI/CD.

Example:

```text
Developer pushes code
        ↓
GitHub Actions starts
        ↓
Build
        ↓
Test
        ↓
Deploy
```

## 1. List Workflow Runs

```bash
gh run list --repo cli/cli
```

---

## 2. View a Workflow Run

```bash
gh run view RUN_ID --repo cli/cli
```

Example:

```bash
gh run view 123456789 --repo cli/cli
```

View complete logs:

```bash
gh run view 123456789 --repo cli/cli --log
```

View only failed logs:

```bash
gh run view 123456789 --repo cli/cli --log-failed
```

---

## 3. Watch a Workflow

```bash
gh run watch RUN_ID
```

This lets us watch the workflow progress from the terminal.

---

## 4. Run a Workflow Manually

If the workflow supports `workflow_dispatch`:

```bash
gh workflow run WORKFLOW_NAME
```

With an input:

```bash
gh workflow run deploy.yml -f environment=staging
```

---

## How Can `gh run` and `gh workflow` Help in CI/CD?

They can be used to:

* Check build status
* Watch workflow progress
* Get failed job logs
* Re-run failed jobs
* Trigger manual deployments
* Automate release workflows
* Check whether CI passed before deployment

Example:

```text
Code pushed
    ↓
CI workflow runs
    ↓
gh run checks status
    ↓
CI passed?
   / \
 Yes  No
  ↓    ↓
Deploy  Stop
```

---

# Task 6: Useful `gh` Tricks

## 1. `gh api`

Used to communicate directly with the GitHub API.

```bash
gh api repos/OWNER/REPO
```

Example:

```bash
gh api repos/DastureSachin/90DaysOfDevOps
```

This is useful when a specific GitHub operation does not have a dedicated `gh` command.

---

## 2. `gh gist`

A Gist is useful for sharing small files, code snippets, or notes.

Create a public Gist:

```bash
gh gist create notes.md --public
```

---

## 3. `gh release`

Create a GitHub release:

```bash
gh release create v1.0.0 \
  --notes "First release"
```

Releases can also contain build artifacts.

---

## 4. `gh alias`

Aliases allow us to create shortcuts for commands we use often.

Example:

```bash
gh alias set prs 'pr list --author @me'
```

Now instead of:

```bash
gh pr list --author @me
```

we can use:

```bash
gh prs
```

---

## 5. `gh search repos`

Search GitHub repositories directly from the terminal:

```bash
gh search repos "devops"
```

Search with filters:

```bash
gh search repos "devops" \
  --language=python \
  --stars=">100"
```

---

# Useful `gh` Command Cheat Sheet

| Command             | Purpose                  |
| ------------------- | ------------------------ |
| `gh --version`      | Check GitHub CLI version |
| `gh help`           | Show help                |
| `gh auth login`     | Login to GitHub          |
| `gh auth status`    | Check login status       |
| `gh auth switch`    | Switch account           |
| `gh repo create`    | Create repository        |
| `gh repo clone`     | Clone repository         |
| `gh repo view`      | View repository          |
| `gh repo list`      | List repositories        |
| `gh repo delete`    | Delete repository        |
| `gh issue create`   | Create issue             |
| `gh issue list`     | List issues              |
| `gh issue view`     | View issue               |
| `gh issue close`    | Close issue              |
| `gh pr create`      | Create PR                |
| `gh pr list`        | List PRs                 |
| `gh pr view`        | View PR                  |
| `gh pr diff`        | View PR changes          |
| `gh pr checkout`    | Checkout PR locally      |
| `gh pr review`      | Review PR                |
| `gh pr checks`      | Check PR status          |
| `gh pr merge`       | Merge PR                 |
| `gh run list`       | List workflow runs       |
| `gh run view`       | View workflow run        |
| `gh run watch`      | Watch workflow           |
| `gh workflow run`   | Trigger workflow         |
| `gh api`            | Call GitHub API          |
| `gh gist create`    | Create Gist              |
| `gh release create` | Create release           |
| `gh alias set`      | Create shortcut          |
| `gh search repos`   | Search repositories      |

---

# `git` vs `gh`

This is one of the most important concepts from Day 26.

| `git`               | `gh`                       |
| ------------------- | -------------------------- |
| Git version control | GitHub platform management |
| Commit              | Issues                     |
| Branch              | Pull Requests              |
| Push                | GitHub Actions             |
| Pull                | Releases                   |
| Fetch               | GitHub API                 |
| Merge branches      | Manage GitHub features     |

### Easy Way to Remember

```text
git = Git version control
gh  = GitHub platform management
```

They work together.

Example:

```bash
git checkout -b feature/login
git add .
git commit -m "fix login"
git push -u origin feature/login
gh pr create --fill
```

---

# `--json` and `--jq` for Automation

One powerful feature of GitHub CLI is structured output.

Example:

```bash
gh issue list --json number,title
```

We can also filter the result:

```bash
gh issue list --json number,title --jq '.[].title'
```

This is useful in Bash scripts because the output can be processed automatically.

For example:

```bash
gh pr list --json number,title,state
```

A script can use this information to make decisions.

---

# Why `gh` Is Important for DevOps

GitHub CLI makes GitHub operations scriptable.

For example:

```bash
gh issue create \
  --title "Server backup failed" \
  --body "Backup failed at $(date)" \
  --label bug
```

A DevOps engineer could put this inside a monitoring script.

Other possible uses:

* CI/CD automation
* Deployment scripts
* Monitoring
* Automated issue creation
* Pull Request automation
* Release automation
* ChatOps
* GitHub Actions management

---

# Overall Day 26 Takeaways

1. `gh` lets me manage GitHub directly from the terminal.
2. `git` is mainly for Git version control.
3. `gh` manages GitHub features such as Issues, PRs, Actions, and Releases.
4. I can create and manage repositories from the terminal.
5. I can create, view, and close Issues using `gh issue`.
6. I can create, review, check, and merge PRs using `gh pr`.
7. `gh run` and `gh workflow` are useful for GitHub Actions and CI/CD.
8. `gh api` gives access to the GitHub API.
9. `--json` and `--jq` are useful for automation.
10. `gh alias` can save time for frequently used commands.
11. GitHub CLI reduces the need to switch between the terminal and browser.
12. GitHub CLI is especially useful for DevOps because GitHub operations can be scripted and automated.

---

# Day 26 Practice Flow

```text
Install gh
    ↓
gh auth login
    ↓
gh auth status
    ↓
Create test repository
    ↓
Clone repository
    ↓
Create issue
    ↓
Create branch
    ↓
Make a change
    ↓
Commit + push
    ↓
Create Pull Request
    ↓
Check PR
    ↓
Check GitHub Actions
    ↓
Merge PR
    ↓
Delete test repository
```

## Final Note

Before running commands that create, merge, or delete GitHub resources, always check the repository name and active account.

Especially be careful with:

```bash
gh repo delete
```

because deleting a repository is a destructive operation.
