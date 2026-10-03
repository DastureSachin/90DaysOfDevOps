# Day 40 – Your First GitHub Actions Workflow

## 🎯 Goal

Today I created my first GitHub Actions workflow and watched a real CI workflow run on a GitHub-hosted Ubuntu runner.

The basic flow was:

```text
Local Ubuntu / WSL
       |
       | git push
       ↓
GitHub Repository
       |
       | push trigger
       ↓
GitHub Actions
       |
       ↓
Ubuntu Runner
       |
       ├── Checkout repository
       ├── Run shell commands
       ├── Show logs
       └── Display result
       |
       ↓
🟢 Success
```

---

# Task 1 – Repository Setup

I created a public GitHub repository called:

```text
github-actions-practice
```

I cloned the repository locally and created the workflow directory:

```text
.github/workflows/
```

The workflow file is:

```text
.github/workflows/hello.yml
```

I connected my local Git repository with GitHub using SSH.

---

# Task 2 – Hello GitHub Actions Workflow

My first workflow was created inside:

```text
.github/workflows/hello.yml
```

## Workflow

```yaml
name: Hello GitHub Actions

on: push

jobs:
  greet:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Say Hello
        run: echo "Hello from GitHub Actions! Day 40 🚀"

      - name: Show date and time
        run: date

      - name: Show branch name
        run: echo "Branch: ${{ github.ref_name }}"

      - name: List repository files
        run: ls -la

      - name: Show operating system
        run: uname -a
```

After pushing the workflow to GitHub, I opened the **Actions** tab and inspected the workflow run and its logs.

---

# Task 3 – Understanding GitHub Actions Anatomy

## `name:`

Defines the name of the workflow.

```yaml
name: Hello GitHub Actions
```

This name appears in the GitHub Actions interface.

---

## `on:`

Defines when the workflow should run.

```yaml
on: push
```

This means the workflow runs whenever a push event occurs.

So:

```text
git push
   ↓
GitHub
   ↓
Workflow starts
```

---

## `jobs:`

Defines the jobs that the workflow needs to execute.

```yaml
jobs:
  greet:
```

Here, the job ID is:

```text
greet
```

A workflow can contain multiple jobs.

---

## `runs-on:`

Defines the environment where the job will execute.

```yaml
runs-on: ubuntu-latest
```

GitHub provides a hosted Ubuntu runner for the job.

Important:

The commands in the workflow run on the **GitHub Actions runner**, not on my local WSL machine.

---

## `steps:`

Defines the individual tasks inside a job.

Example:

```yaml
steps:
  - name: Say Hello
    run: echo "Hello"
```

Steps execute in order.

---

## `uses:`

Allows the workflow to use an existing reusable GitHub Action.

Example:

```yaml
uses: actions/checkout@v5
```

The `actions/checkout` action checks out the repository code into the runner workspace.

This allows later commands to access the repository files.

---

## `run:`

Executes a shell command on the GitHub Actions runner.

Example:

```yaml
run: date
```

This executes the Linux `date` command.

Other examples:

```yaml
run: ls -la
```

and:

```yaml
run: uname -a
```

---

## Step `name:`

Gives an individual step a readable name.

Example:

```yaml
- name: Show date and time
```

This makes the workflow logs easier to understand.

---

# Task 4 – Additional Workflow Steps

## 1. Show Date and Time

```yaml
- name: Show date and time
  run: date
```

The `date` command displays the current date and time of the runner.

---

## 2. Show Branch Name

```yaml
- name: Show branch name
  run: echo "Branch: ${{ github.ref_name }}"
```

GitHub provides built-in context variables.

```text
${{ github.ref_name }}
```

provides the branch or ref name associated with the workflow run.

For example:

```text
Branch: master
```

or:

```text
Branch: main
```

depending on the repository branch.

---

## 3. List Repository Files

```yaml
- name: List repository files
  run: ls -la
```

The command:

```bash
ls -la
```

lists files and directories.

The `-a` option also shows hidden files.

This is useful for verifying that the repository was checked out correctly.

---

## 4. Show Operating System

```yaml
- name: Show operating system
  run: uname -a
```

This displays system and kernel information from the GitHub Actions runner.

---

# Task 5 – Break the Pipeline on Purpose

To understand pipeline failures, I added an intentional failure step.

```yaml
- name: Intentional failure
  run: exit 1
```

The command:

```bash
exit 1
```

returns a non-zero exit status.

Generally:

```text
exit 0 → Success
exit 1 → Failure
```

When this step runs, GitHub Actions marks the step and job as failed.

---

# 🔴 Understanding a Failed Pipeline

After pushing the intentional failure, I opened:

```text
GitHub
   ↓
Actions
   ↓
Workflow Run
   ↓
greet
```

I inspected the failed step and its logs.

The important information is the command that failed and the exit code.

For example:

```text
Process completed with exit code 1.
```

The debugging process is:

```text
Failed Workflow
      ↓
Open failed Job
      ↓
Find failed Step
      ↓
Read logs
      ↓
Understand error
      ↓
Fix workflow
      ↓
git push
      ↓
New workflow run
      ↓
🟢 Success
```

After testing the failure, I removed the intentional failure step so the final workflow could pass successfully.

---

# 🧠 Local Environment vs GitHub Actions Runner

One important concept I learned is that my local Ubuntu/WSL environment and the GitHub Actions runner are different environments.

## Local

I use my local environment for:

```text
Edit files
     ↓
git add
     ↓
git commit
     ↓
git push
```

Then GitHub receives the changes.

## GitHub Actions

GitHub then performs:

```text
GitHub Repository
       ↓
Push Event
       ↓
GitHub Actions
       ↓
Ubuntu Runner
       ↓
Checkout Code
       ↓
Execute Steps
       ↓
Generate Logs
       ↓
Success / Failure
```

This helped me understand how CI starts working after a code push.

---

# 🔍 GitHub Actions Workflow Structure

The basic structure is:

```text
Workflow
│
├── name
│
├── on
│
└── jobs
    │
    └── greet
        │
        ├── runs-on
        │
        └── steps
            │
            ├── checkout
            ├── hello
            ├── date
            ├── branch
            ├── files
            └── operating system
```

---

# 📚 What I Learned

Today I learned:

- What GitHub Actions is
- What a workflow is
- How a workflow is triggered
- How `on: push` works
- What jobs are
- What `runs-on` does
- What steps are
- How `uses` works
- How `run` executes commands
- How `actions/checkout` works
- How to use GitHub Actions variables
- How to inspect workflow logs
- How to intentionally fail a workflow
- How to debug a failed workflow
- How to fix and rerun a workflow
- Difference between my local environment and the GitHub Actions runner

---

# 🔄 CI Flow Learned Today

```text
Developer
    |
    | git push
    ↓
GitHub
    |
    | Push Event
    ↓
GitHub Actions
    |
    ↓
Ubuntu Runner
    |
    ├── Checkout
    ├── Execute Commands
    ├── Generate Logs
    └── Test Result
    |
    ↓
🟢 Success
```

---

# ✅ Day 40 Checklist

- [x] Created `github-actions-practice` repository
- [x] Connected local Git with GitHub using SSH
- [x] Created `.github/workflows/hello.yml`
- [x] Used `on: push`
- [x] Created `greet` job
- [x] Used `ubuntu-latest`
- [x] Used `actions/checkout`
- [x] Printed Hello message
- [x] Printed date and time
- [x] Printed branch name
- [x] Listed repository files
- [x] Printed operating system information
- [x] Checked workflow logs
- [x] Practiced intentional pipeline failure
- [x] Fixed the failed workflow
- [x] Verified a successful workflow run

---

# 📸 Green Pipeline Screenshot

Add the screenshot of my successful GitHub Actions workflow here.

```markdown
![Day 40 Green Pipeline](./day-40-green-run.png)
```

---

# 💡 Key Takeaway

Day 40 was the point where CI/CD became practical for me.

I pushed code from my local environment, GitHub detected the push, GitHub Actions started an Ubuntu runner, executed my workflow steps, displayed the logs, and reported the final result.

The complete flow:

```text
Code
 ↓
Git Push
 ↓
GitHub
 ↓
GitHub Actions
 ↓
Ubuntu Runner
 ↓
Workflow Steps
 ↓
Logs
 ↓
Success / Failure
```

---

# 🚀 Day 40 Complete

My first GitHub Actions workflow is now working.

Next step is to continue building deeper CI/CD knowledge and start connecting GitHub Actions with real DevOps workflows.

#90DaysOfDevOps #DevOpsKaJosh #TrainWithShubham #GitHubActions #CICD #DevOps
