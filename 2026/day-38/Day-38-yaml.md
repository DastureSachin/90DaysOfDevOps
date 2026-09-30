# Day 38 – YAML Basics

## Goal

Learn YAML syntax, indentation, lists, nested objects, multi-line strings, and YAML validation before starting GitHub Actions.

---

##  Files

- `person.yaml` – Key-value pairs and lists
- `server.yaml` – Nested objects and multi-line strings
- `practice.yaml` – Additional YAML practice

---

## 1. Key-Value Pairs

Basic YAML structure:

```yaml
name: Sachin
role: DevOps Learner
experience_years: 0
learning: true
```

`key: value` is the basic YAML structure.

`true` is a boolean, while `"true"` is a string.

---

## 2. Lists

### Block Style

```yaml
tools:
  - Linux
  - Git
  - Docker
  - AWS
  - GitHub Actions
```

### Inline Style

```yaml
hobbies: [Coding, Learning, Tech Events]
```

YAML supports both block and inline lists.

---

## 3. Nested Objects

```yaml
server:
  name: web-server
  ip: 192.168.1.10
  port: 8080

database:
  host: localhost
  name: devops_db
  credentials:
    user: admin
    password: secret123
```

**Key point:** indentation defines the hierarchy.

```text
database
 └── credentials
      ├── user
      └── password
```

Use **spaces, not tabs** for indentation.

---

## 4. Multi-line Strings

### `|` – Preserve Lines

```yaml
startup_script: |
  echo "Starting server"
  echo "Installing dependencies"
  echo "Starting application"
```

`|` preserves line breaks. Useful for scripts and formatted text.

### `>` – Fold Lines

```yaml
startup_message: >
  Server is starting
  and application will
  be deployed soon.
```

`>` folds multiple lines into a single logical line. Useful for long messages or paragraphs.

### Easy Rule

```text
| → preserve newlines
> → fold newlines
```

---

## 5. YAML Validation

Used `yamllint` to validate the YAML files:

```bash
yamllint person.yaml
yamllint server.yaml
yamllint practice.yaml
```

I also intentionally broke indentation, observed the validation error, and fixed it.

Example:

```yaml
# Broken
server:
  name: web-server
    ip: 192.168.1.10

# Correct
server:
  name: web-server
  ip: 192.168.1.10
```

---

## 6. What I Learned

1. YAML is **indentation-sensitive**.
2. YAML supports **key-value pairs, lists, and nested objects**.
3. `|` preserves line breaks, while `>` folds them.
4. YAML should be validated before using it in automation.

---

##  DevOps Connection

GitHub Actions workflows use YAML:

```yaml
name: CI

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
```

The YAML concepts learned today will be used directly in **GitHub Actions and CI/CD pipelines**.
