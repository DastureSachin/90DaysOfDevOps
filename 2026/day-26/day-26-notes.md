Day 26 – GitHub CLI (gh) Notes

What is GitHub CLI?

GitHub CLI (gh) is a command-line tool that lets us manage GitHub directly from the terminal.

Normally:

git → works mainly with Git repositories, commits, branches, push, pull, fetch, etc.

gh → works with GitHub features such as repositories, issues, pull requests, Actions, releases, and the GitHub API.

Simple example

Instead of opening GitHub in the browser to create an issue:

gh issue create --title "Bug found" --body "Login is not working"

We can create the issue directly from the terminal.

This is useful for DevOps because terminal commands can be repeated and automated in Bash scripts and CI/CD pipelines.

Task 1: Install and Authenticate

1. Install GitHub CLI

On Ubuntu/Debian, install GitHub CLI using GitHub's official package repository:

(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y

Check installation:

gh --version

Example:

gh version 2.x.x

2. Login to GitHub

gh auth login

The interactive setup asks about:

GitHub.com or GitHub Enterprise

HTTPS or SSH

Browser login or personal access token

Whether Git should also use the GitHub CLI credentials

3. Check login status

gh auth status

This shows the active GitHub account and authentication information.

If you have multiple accounts:

gh auth switch

Authentication methods

GitHub CLI supports these common authentication approaches:

Browser/device login – easiest for normal interactive use.

Personal Access Token (PAT) – useful on servers or systems without a browser.

SSH key setup – useful for Git operations over SSH; GitHub CLI API requests still use token-based authentication internally.

Environment tokens – GH_TOKEN or GITHUB_TOKEN can be used in automated/CI environments.

Task 2: Working with Repositories

1. Create a new public repository

gh repo create day26-test-repo --public --add-readme

This creates:

Repository name: day26-test-repo
Visibility: Public
README: Added

Useful options

--private

Creates a private repository.

--description "My Day 26 practice repository"

Adds a description.

--clone

Clones the repository after creating it.

2. Clone a repository

Instead of:

git clone https://github.com/OWNER/REPO.git

we can use:

gh repo clone OWNER/REPO

Example:

gh repo clone DastureSachin/90DaysOfDevOps

The gh command can use the authentication already configured with GitHub CLI.

3. View repository details

gh repo view OWNER/REPO

Example:

gh repo view DastureSachin/90DaysOfDevOps

Open the repository in the browser:

gh repo view DastureSachin/90DaysOfDevOps --web

4. List repositories

gh repo list

To list more repositories:

gh repo list DastureSachin --limit 50

5. Delete the test repository

gh repo delete OWNER/day26-test-repo --yes

Example:

gh repo delete DastureSachin/day26-test-repo --yes

Be careful: repository deletion is destructive and should only be used for a test repository you no longer need.

Task 3: GitHub Issues

An Issue is used to track a bug, task, feature request, question, or other work.

1. Create an issue

gh issue create \
  --title "Bug: login is not working" \
  --body "Login fails when using an expired token." \
  --label bug

If you don't provide the title/body, GitHub CLI can ask for them interactively.

2. List open issues

gh issue list

Or:

gh issue list --state open

3. View an issue

For example, issue number 12:

gh issue view 12

Open it in the browser:

gh issue view 12 --web

4. Close an issue

gh issue close 12

Reopen it if needed:

gh issue reopen 12

How can gh issue help in automation?

A script can automatically create an issue when something goes wrong.

Example:

gh issue create \
  --title "Server backup failed" \
  --body "The backup script failed at $(date)" \
  --label bug

A monitoring or log-analysis script could run this command when it detects a failure.

Another useful option is structured output:

gh issue list --json number,title,labels

This is useful when another script needs to process the issue information.

Task 4: Pull Requests

A Pull Request (PR) is used to propose changes from one branch to another.

A simple workflow is:

Create branch
     ↓
Make changes
     ↓
Commit
     ↓
Push branch
     ↓
Create PR
     ↓
Review / CI checks
     ↓
Merge

1. Create a branch

git checkout -b feature/day26-notes

2. Make a change

Example:

echo "GitHub CLI practice" >> notes.md

3. Add and commit

git add notes.md
git commit -m "docs: add day 26 notes"

4. Push the branch

git push -u origin feature/day26-notes

5. Create the PR

gh pr create --fill

--fill can use information from the commits to fill the PR title and description.

For a more detailed PR, you can specify them yourself:

gh pr create \
  --title "Add Day 26 GitHub CLI notes" \
  --body "Added GitHub CLI commands and explanations."

6. List open PRs

gh pr list

7. View a PR

gh pr view 15

Check CI/status checks:

gh pr checks 15

8. Merge a PR

Example using squash merge:

gh pr merge 15 --squash --delete-branch

--delete-branch removes the PR branch after the merge.

Merge methods

gh pr merge supports three main merge methods:

1. Merge commit

gh pr merge 15 --merge

Keeps the branch commits and creates a merge commit.

2. Squash merge

gh pr merge 15 --squash

Combines the PR commits into one commit.

3. Rebase merge

gh pr merge 15 --rebase

Replays the commits on top of the base branch without creating a merge commit.

Review someone else's PR

First, view the PR:

gh pr view 15

See the changes:

gh pr diff 15

Checkout the PR locally:

gh pr checkout 15

Read comments:

gh pr view 15 --comments

Approve:

gh pr review 15 --approve -b "Looks good."

Request changes:

gh pr review 15 \
  --request-changes \
  -b "Please add a test for this change."

Add a normal review comment:

gh pr review 15 --comment -b "Looks good overall."

Simple PR review workflow

gh pr view
     ↓
gh pr diff
     ↓
gh pr checkout
     ↓
Test the code
     ↓
gh pr review

Task 5: GitHub Actions and Workflows

GitHub Actions is used for CI/CD automation.

For example:

Developer pushes code
        ↓
GitHub Actions starts
        ↓
Build
        ↓
Test
        ↓
Deploy

1. List workflow runs

For a public repository:

gh run list --repo cli/cli

2. View a specific workflow run

gh run view RUN_ID --repo cli/cli

Example:

gh run view 123456789 --repo cli/cli

View logs:

gh run view 123456789 --repo cli/cli --log

View only failed logs:

gh run view 123456789 --repo cli/cli --log-failed

3. Watch a workflow run

gh run watch RUN_ID

This lets us watch the workflow progress from the terminal.

4. Run a workflow manually

If the workflow supports workflow_dispatch:

gh workflow run WORKFLOW_NAME

It can also accept inputs:

gh workflow run deploy.yml -f environment=staging

How are gh run and gh workflow useful in CI/CD?

They can be used to:

Check whether builds passed or failed.

Watch workflow progress.

Get logs for failed jobs.

Re-run failed jobs.

Trigger manual deployments.

Build scripts that wait for CI to finish successfully.

Automate release and deployment workflows.

Task 6: Useful gh Tricks

1. gh api

Used to make GitHub API requests.

gh api repos/OWNER/REPO

Example:

gh api repos/DastureSachin/90DaysOfDevOps

This is useful when the normal gh command does not provide the exact operation you need.

2. gh gist

A Gist is useful for sharing small pieces of code, notes, or configuration.

Create a public Gist:

gh gist create notes.md --public

3. gh release

Create a release:

gh release create v1.0.0 --notes "First release"

A release can also contain build files/artifacts.

4. gh alias

Aliases create shortcuts for commands we use frequently.

Example:

gh alias set prs 'pr list --author @me'

Now instead of:

gh pr list --author @me

we can use:

gh prs

5. Search GitHub repositories

gh search repos "devops"

Search with filters:

gh search repos "devops" --language=python --stars=">100"

This can be useful for finding projects and learning from open-source repositories.

Useful Commands Cheat Sheet

Command

Purpose

gh --version

Check GitHub CLI version

gh help

Show help

gh auth login

Login to GitHub

gh auth status

Check login status

gh auth switch

Switch account

gh repo create

Create repository

gh repo clone

Clone repository

gh repo view

View repository

gh repo list

List repositories

gh repo delete

Delete repository

gh issue create

Create issue

gh issue list

List issues

gh issue view

View issue

gh issue close

Close issue

gh pr create

Create PR

gh pr list

List PRs

gh pr view

View PR

gh pr diff

View PR changes

gh pr checkout

Checkout PR locally

gh pr review

Review PR

gh pr checks

Check PR CI status

gh pr merge

Merge PR

gh run list

List workflow runs

gh run view

View workflow run

gh run watch

Watch workflow

gh workflow run

Trigger workflow

gh api

Call GitHub API

gh gist create

Create Gist

gh release create

Create release

gh alias set

Create command shortcut

gh search repos

Search repositories

git vs gh

This is one of the most important things to remember.

git

gh

Local Git repository

GitHub platform

Commit

Issues

Branch

Pull Requests

Push

GitHub Actions

Pull

Releases

Fetch

GitHub API

Merge branches

Manage GitHub features

Easy way to remember

git = Git version control
gh  = GitHub platform management

They work together.

Example:

git checkout -b feature/login
git add .
git commit -m "fix login"
git push -u origin feature/login
gh pr create --fill

Automation: Why gh is important for DevOps

The biggest advantage is that gh commands can be used inside scripts.

For example:

if gh run list --json conclusion --jq '.[0].conclusion' | grep -q success
then
    echo "CI passed - continue deployment"
else
    echo "CI failed - stop deployment"
fi

Structured output is especially useful:

gh issue list --json number,title

or:

gh pr list --json number,title,state

--json gives machine-readable data, and --jq can filter that data.

This makes GitHub CLI useful for:

Bash scripts

CI/CD pipelines

Deployment automation

Monitoring

Release automation

ChatOps

DevOps tooling

My Day 26 Takeaways

gh allows me to manage GitHub without constantly opening the browser.

git is mainly for Git version control, while gh manages GitHub platform features.

I can create and manage repositories from the terminal.

I can create, view, and close GitHub Issues using gh issue.

I can create, review, check, and merge Pull Requests using gh pr.

gh run and gh workflow are useful for CI/CD and GitHub Actions.

gh api provides direct access to GitHub's API.

--json and --jq make gh useful in automation scripts.

gh alias can save time when commands are used frequently.

GitHub CLI is a useful DevOps tool because GitHub operations can be scripted and automated.

Practice Flow

I can practice Day 26 using this simple flow:

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
Merge PR
   ↓
Check GitHub Actions
   ↓
Delete test repository

Important: Before running commands that create, merge, or delete GitHub resources, verify the repository name and account. In particular, be very careful with gh repo delete.
