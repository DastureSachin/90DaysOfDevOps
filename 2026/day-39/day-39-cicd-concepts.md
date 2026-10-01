# Day 39 – What is CI/CD?

## 🎯 Goal

Before writing a CI/CD pipeline, understand **why CI/CD exists, what problems it solves, and how a CI/CD pipeline works**.

Today is focused on concepts, research, and understanding the pipeline structure.

---

# 1. The Problem

Imagine a team of 5 developers working on the same application.

```text
Developer 1 ─┐
Developer 2 ─┤
Developer 3 ─┼──> GitHub Repository ──> Manual Deployment ──> Production
Developer 4 ─┤
Developer 5 ─┘
```

If every developer writes code and the team manually tests and deploys everything, many problems can occur.

## What can go wrong?

### 1. Integration conflicts

Multiple developers may modify the same parts of the application.

This can result in merge conflicts or unexpected behavior when their changes are combined.

### 2. Bugs can reach production

If testing is done manually, developers may forget to test some functionality.

A bug can therefore reach the production environment.

### 3. Human errors

Manual deployment requires people to execute commands and follow deployment steps correctly.

A wrong command, wrong configuration, or wrong server can cause a deployment failure.

### 4. Different environments

The development environment and production environment may have different:

- Operating system versions
- Programming language versions
- Dependencies
- Environment variables
- Configuration
- Installed software

This can cause an application to work locally but fail on the server.

### 5. Slow deployments

If every deployment requires several manual steps, releasing small changes becomes time-consuming.

### 6. Difficult rollback

If a deployment breaks the application, manually identifying and restoring the previous working version can take time.

---

## What does "It works on my machine" mean?

"It works on my machine" usually means that the application works correctly in one developer's local environment but fails in another environment.

For example:

```text
Developer Machine

Python 3.12
Flask 3.x
Windows
Dependency Version A

        ↓

Application works ✅
```

But the server might have:

```text
Production Server

Python 3.10
Different Flask version
Linux
Dependency Version B

        ↓

Application fails ❌
```

The underlying problem is often **environment inconsistency**.

Containers such as Docker can help reduce this problem by packaging an application together with its required dependencies and environment.

---

## How many times a day can a team safely deploy manually?

There is no universal number of manual deployments that is considered safe.

The safety of deployment depends on:

- Testing
- Deployment process
- Team practices
- Automation
- Monitoring
- Rollback strategy
- Application complexity

However, frequent manual deployments increase the number of opportunities for human error.

This is one of the problems CI/CD tries to solve by automating repetitive parts of the software delivery process.

---

# 2. CI vs CD

CI/CD is not a single tool.

It is a set of software development and delivery practices.

Tools such as:

- GitHub Actions
- Jenkins
- GitLab CI/CD
- CircleCI

can be used to implement CI/CD workflows.

---

# Continuous Integration (CI)

## Definition

**Continuous Integration** is the practice of frequently integrating code changes into a shared repository and automatically building and testing those changes.

The goal is to detect integration problems and bugs as early as possible.

A typical CI flow is:

```text
Developer
    ↓
git push
    ↓
Shared Repository
    ↓
Build
    ↓
Automated Tests
    ↓
PASS / FAIL
```

### What happens during CI?

A CI system may:

1. Checkout the source code
2. Install dependencies
3. Run linting
4. Run unit tests
5. Build the application
6. Report whether the changes passed or failed

### What does CI catch?

CI can help detect:

- Broken builds
- Failed tests
- Integration problems
- Code quality issues
- Dependency problems
- Some bugs before they reach production

### Real-world example

A developer modifies a React application and pushes the code to GitHub.

The CI system automatically runs:

```text
npm install
npm test
npm run build
```

If the tests fail:

```text
❌ CI Failed
```

The team can fix the problem before the change moves further through the delivery process.

---

# Continuous Delivery

## Definition

**Continuous Delivery** extends CI by keeping the application in a release-ready state.

The application is automatically built and tested and can be deployed when the team decides to release it.

A simplified flow is:

```text
Code
 ↓
Build
 ↓
Test
 ↓
Package
 ↓
Staging
 ↓
Ready for Production
 ↓
Manual Approval
 ↓
Production
```

The important idea is that the software is **always ready to be deployed**.

Production deployment may still require a manual approval or action.

### Real-world example

A company automatically:

```text
Push Code
    ↓
Run Tests
    ↓
Build Docker Image
    ↓
Deploy to Staging
    ↓
Run Verification
```

After the team approves the release:

```text
Approval
    ↓
Production Deployment
```

---

# Continuous Deployment

## Definition

**Continuous Deployment** takes automation one step further.

When a code change passes the required automated checks, it can be automatically deployed to production without a separate manual approval for each change.

A simplified flow is:

```text
Code
 ↓
Build
 ↓
Test
 ↓
Deploy
 ↓
Production
```

### Real-world example

A developer pushes code:

```text
git push
    ↓
Automated Tests
    ↓
Build
    ↓
Security / Quality Checks
    ↓
Production Deployment
```

If all required checks pass, the system automatically deploys the change.

---

# CI vs Continuous Delivery vs Continuous Deployment

| Practice | Main Idea | Production Deployment |
|---|---|---|
| Continuous Integration | Integrate and test code frequently | Not the main focus |
| Continuous Delivery | Keep software ready to deploy | Usually requires a release/approval action |
| Continuous Deployment | Automatically deploy successful changes | Automatically deployed |

### Easy way to remember

```text
CI
↓
Integrate + Test

Continuous Delivery
↓
Integrate + Test + Ready to Deploy

Continuous Deployment
↓
Integrate + Test + Automatically Deploy
```

> Delivery and Deployment are not the same thing.

---

# 3. Pipeline Anatomy

A CI/CD pipeline is made up of several concepts.

The main concepts are:

```text
Trigger
   ↓
Stage
   ↓
Job
   ↓
Step
   ↓
Runner
   ↓
Artifact
```

---

# Trigger

A **trigger** is an event that starts a pipeline.

Common triggers include:

- Push to a repository
- Pull request
- Scheduled event
- Manual workflow execution
- Release creation

For example:

```yaml
on:
  push:
    branches:
      - main
```

This means a push to the `main` branch can trigger the workflow.

### In our Day 39 example:

```text
Developer
    ↓
git push
    ↓
GitHub
    ↓
Pipeline Triggered
```

---

# Stage

A **stage** is a logical phase of a pipeline.

For our application:

```text
Stage 1 → Test
Stage 2 → Build
Stage 3 → Deploy
```

Stages help organize the pipeline into meaningful phases.

---

# Job

A **job** is a unit of work executed by the CI/CD system.

For example:

```text
TEST STAGE

Job:
Run Automated Tests
```

Another example:

```text
BUILD STAGE

Job:
Build Docker Image
```

A stage can contain one or multiple jobs.

Example:

```text
Test Stage
├── Unit Tests
├── Integration Tests
└── Linting
```

---

# Step

A **step** is an individual command or action inside a job.

Example:

```text
Job: Run Tests

Step 1 → Checkout code
Step 2 → Install dependencies
Step 3 → Run tests
```

The relationship can be understood as:

```text
Pipeline
   ↓
Stage
   ↓
Job
   ↓
Step
```

---

# Runner

A **runner** is the machine or execution environment where a job runs.

For example, GitHub Actions can run a job on an Ubuntu environment.

Example:

```yaml
runs-on: ubuntu-latest
```

This tells GitHub Actions to execute the job using an Ubuntu runner.

The runner executes the commands defined in the workflow.

```text
GitHub Actions
       ↓
    Runner
       ↓
Commands Execute
```

---

# Artifact

An **artifact** is an output produced during the pipeline.

Examples include:

- Docker image
- Compiled application
- Build directory
- Test reports
- Binary files
- Packages

For our pipeline:

```text
Source Code
    ↓
Build
    ↓
Docker Image
```

The Docker image can be treated as a build output that can be used during deployment.

Another example:

```text
npm run build
      ↓
dist/
```

The generated `dist/` directory is also a build output.

---

# 4. CI/CD Pipeline

## Scenario

A developer pushes code to GitHub.

The application is:

1. Tested
2. Built into a Docker image
3. Deployed to a staging server

The pipeline looks like:

```text
┌──────────────┐
│  Developer   │
└──────┬───────┘
       │
       │ git push
       ↓
┌──────────────┐
│    GitHub    │
│  Repository  │
└──────┬───────┘
       │
       │ Trigger
       ↓
┌─────────────────────────┐
│       STAGE 1           │
│          TEST            │
│                         │
│  Checkout Code          │
│  Install Dependencies   │
│  Run Automated Tests    │
└───────────┬─────────────┘
            │
            │ Tests Pass
            ↓
┌─────────────────────────┐
│       STAGE 2           │
│         BUILD            │
│                         │
│  Build Application      │
│  Create Docker Image    │
│  Tag Docker Image       │
└───────────┬─────────────┘
            │
            │ Docker Image
            ↓
┌─────────────────────────┐
│       STAGE 3           │
│        DEPLOY            │
│                         │
│  Deploy Docker Image    │
└───────────┬─────────────┘
            │
            ↓
┌─────────────────────────┐
│     STAGING SERVER      │
│                         │
│   Application Running   │
└─────────────────────────┘
```

If the tests fail:

```text
Tests
  ↓
❌ Failed
  ↓
Pipeline Stops
```

The deployment stage should not continue when required tests fail.

---

## Pipeline Diagram

The visual pipeline diagram for this task is stored separately:

```text
cicd-pipeline.png
```

![CI/CD Pipeline](./cicd-pipeline.png)

---

# 5. Explore CI/CD in the Wild

For this task, I explored a popular open-source GitHub repository and inspected a workflow inside:

```text
.github/workflows/
```

## Repository

**Repository:** FastAPI

## Workflow Directory

```text
.github/workflows/
```

The `.github/workflows/` directory contains GitHub Actions workflow YAML files.

These files describe automated workflows used by the repository.

---

## What to look for in a workflow

When inspecting a workflow YAML file, identify these sections:

### 1. Trigger

Look for:

```yaml
on:
```

This tells us what event starts the workflow.

Common examples:

```yaml
on:
  push:
  pull_request:
```

This means the workflow can run when code is pushed or when a pull request event occurs.

---

### 2. Jobs

Look for:

```yaml
jobs:
```

Everything defined under `jobs` represents work that GitHub Actions can execute.

Example structure:

```yaml
jobs:
  test:
    ...

  build:
    ...
```

In this example there are two jobs:

```text
1. test
2. build
```

---

### 3. Steps

Inside a job, look for:

```yaml
steps:
```

Typical steps may include:

```text
Checkout source code
       ↓
Set up programming language
       ↓
Install dependencies
       ↓
Run tests
```

---

### 4. Runner

Look for:

```yaml
runs-on:
```

For example:

```yaml
runs-on: ubuntu-latest
```

This tells us which environment executes the job.

---

## Best-Guess Understanding

When reading an unfamiliar workflow, it is not necessary to understand every line immediately.

The main goal is to identify:

```text
Trigger
   ↓
Jobs
   ↓
Steps
   ↓
Runner
   ↓
Output
```

This helps connect a real GitHub Actions workflow to the CI/CD concepts learned today.

---

# 6. CI/CD and Docker

Docker fits naturally into modern CI/CD pipelines.

Without Docker:

```text
Code
 ↓
Test
 ↓
Build
 ↓
Deploy
 ↓
Server Environment
```

With Docker:

```text
Code
 ↓
Test
 ↓
Build
 ↓
Docker Image
 ↓
Deploy Container
 ↓
Staging Server
```

The Docker image packages the application and its required dependencies.

This can help make the application environment more consistent between development, testing, and deployment.

---

# 7. Why CI/CD Matters

Without automation:

```text
Developer
    ↓
Manual Testing
    ↓
Manual Build
    ↓
Manual Deployment
    ↓
Production
```

With CI/CD:

```text
Developer
    ↓
Push Code
    ↓
Automatic Trigger
    ↓
Automated Tests
    ↓
Automated Build
    ↓
Docker Image
    ↓
Automated Deployment
```

The main benefit is not simply "faster deployment."

CI/CD helps teams create a **repeatable, automated, and consistent software delivery process**.

---

# 8. Key Takeaways

- CI/CD is a software development and delivery practice, not a single tool.
- Continuous Integration focuses on frequently integrating and testing code.
- Continuous Delivery keeps software in a release-ready state.
- Continuous Deployment automatically deploys successful changes to production.
- A trigger starts a pipeline.
- A stage represents a logical phase of a pipeline.
- A job is a unit of work inside a stage.
- A step is an individual action inside a job.
- A runner is the environment where a job executes.
- An artifact is an output produced during the pipeline.
- GitHub Actions is one tool that can implement CI/CD.
- Docker images can be used as build outputs and deployment artifacts.
- A failed pipeline is not necessarily a bad thing.
- A pipeline failure can prevent a bad change from moving further.
- CI/CD helps detect problems earlier and reduce repetitive manual work.

---

# 9. Day 39 Pipeline Summary

The complete concept can be remembered as:

```text
Developer
    ↓
Push Code
    ↓
GitHub Repository
    ↓
Trigger
    ↓
┌───────────────┐
│ TEST          │
│ Build + Test  │
└───────┬───────┘
        ↓
┌───────────────┐
│ BUILD         │
│ Docker Image  │
└───────┬───────┘
        ↓
┌───────────────┐
│ DEPLOY        │
│ Staging       │
└───────┬───────┘
        ↓
   Application
    Running
```

## Final Learning

Before Day 39:

```text
CI/CD = Something related to deployment
```

After Day 39:

```text
CI/CD
  ↓
Automated software delivery process
  ↓
Trigger
  ↓
Stages
  ↓
Jobs
  ↓
Steps
  ↓
Runner
  ↓
Artifacts
  ↓
Deployment
```

**Day 39 complete. 🚀**
