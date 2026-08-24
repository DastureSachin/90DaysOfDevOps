# 🐧 Linux Commands Cheat Sheet

## 90 Days of DevOps — Day 03

> **Goal:** A practical Linux command reference for daily use, troubleshooting, revision, and interviews.

---

# 📁 1. File System Commands

| Command | What it does | Example |
|---|---|---|
| `pwd` | Shows the current working directory | `pwd` |
| `ls` | Lists files and directories | `ls` |
| `ls -la` | Lists detailed info including hidden files | `ls -la` |
| `cd <dir>` | Changes directory | `cd /var/log` |
| `cd ~` | Goes to the home directory | `cd ~` |
| `mkdir <name>` | Creates a directory | `mkdir project` |
| `mkdir -p a/b/c` | Creates nested directories | `mkdir -p project/src` |
| `touch <file>` | Creates an empty file | `touch notes.txt` |
| `cp <src> <dest>` | Copies a file | `cp app.txt backup/` |
| `cp -r <src> <dest>` | Copies a directory recursively | `cp -r project backup/` |
| `mv <src> <dest>` | Moves or renames files/directories | `mv old.txt new.txt` |
| `rm <file>` | Deletes a file | `rm notes.txt` |
| `rm -r <dir>` | Deletes a directory and contents | `rm -r old_project` |
| `rmdir <dir>` | Removes an empty directory | `rmdir empty_dir` |
| `cat <file>` | Displays file contents | `cat notes.txt` |
| `less <file>` | Views large files page by page | `less /var/log/syslog` |
| `head <file>` | Shows first 10 lines | `head file.txt` |
| `tail <file>` | Shows last 10 lines | `tail file.txt` |
| `grep <pattern> <file>` | Searches text for a pattern | `grep "error" app.log` |
| `find . -name "<file>"` | Searches for a file by name | `find . -name "app.log"` |

### 💾 Disk & File Details

| Command | What it does | Example |
|---|---|---|
| `df -h` | Shows free/used disk space | `df -h` |
| `du -sh <dir>` | Shows directory size | `du -sh Downloads/` |
| `lsblk` | Lists disks and block devices | `lsblk` |
| `stat <file>` | Shows detailed file metadata | `stat file.txt` |
| `chmod 755 <file>` | Changes file permissions | `chmod 755 script.sh` |
| `chown user:group <file>` | Changes file ownership | `sudo chown user:group app` |
| `tar -czvf file.tar.gz dir/` | Creates a compressed archive | `tar -czvf backup.tar.gz app/` |

> ⚠️ Be careful with `rm -r` and especially `rm -rf`. Deleted files may not be recoverable.

---

# ⚙️ 2. Process Management

A **process** is a running instance of a program. Each process has a **PID (Process ID)**.

| Command | What it does | Example |
|---|---|---|
| `ps` | Shows processes for the current shell | `ps` |
| `ps aux` | Shows detailed system-wide processes | `ps aux` |
| `ps -ef` | Shows all processes | `ps -ef` |
| `ps -ef --forest` | Shows parent-child process relationships | `ps -ef --forest` |
| `top` | Monitors CPU, memory, and processes live | `top` |
| `htop` | Interactive process monitor | `htop` |
| `pgrep <name>` | Finds PID by process name | `pgrep nginx` |
| `pstree` | Shows processes as a tree | `pstree` |
| `kill <PID>` | Gracefully terminates a process | `kill 1234` |
| `kill -9 <PID>` | Forcefully terminates a process | `kill -9 1234` |
| `pkill <name>` | Kills processes by name | `pkill nginx` |
| `jobs` | Lists background/stopped jobs | `jobs` |
| `bg` | Resumes a stopped job in background | `bg` |
| `fg` | Brings a background job to foreground | `fg` |
| `command &` | Runs a command in background | `python app.py &` |
| `nohup command &` | Keeps a process running after logout | `nohup app.py &` |

### 🔹 Useful Process Signals

- `kill -15 <PID>` → **SIGTERM** — polite/graceful termination.
- `kill -9 <PID>` → **SIGKILL** — forceful termination; use as a last resort.
- `Ctrl + C` → Stops the foreground process.
- `Ctrl + Z` → Suspends the foreground process.

### 🔹 Process States

- **R — Running:** Process is running or ready to run.
- **S — Sleeping:** Waiting for an event/resource.
- **D — Uninterruptible sleep:** Usually waiting for I/O.
- **T — Stopped:** Process is paused.
- **Z — Zombie:** Process finished but parent has not collected its exit status.

> 💡 In `top`, press `q` to exit.

---

# ⚙️ 3. Services & systemd

`systemd` is the system and service manager used by most modern Linux distributions.

| Command | What it does |
|---|---|
| `systemctl status <service>` | Checks service status |
| `systemctl start <service>` | Starts a service |
| `systemctl stop <service>` | Stops a service |
| `systemctl restart <service>` | Restarts a service |
| `systemctl enable <service>` | Starts service automatically at boot |
| `systemctl disable <service>` | Prevents automatic startup |
| `systemctl is-active <service>` | Checks if service is active |

### Example

```bash
systemctl status nginx
systemctl restart nginx


# 🌐 Networking Troubleshooting Commands

| Command | Usage |
|---|---|
| `ping <host>` | Check network connectivity |
| `ip addr` | Display IP address and network interfaces |
| `curl <url>` | Test a website or API response |
| `dig <domain>` | Perform a DNS lookup |

### Simple Troubleshooting Flow

```text
ping <host>
    ↓
ip addr
    ↓
dig <domain>
    ↓
curl <url>
