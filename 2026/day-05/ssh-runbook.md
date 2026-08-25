
# 🛠️ Linux Troubleshooting Runbooks

**Day:** 05
**Date:** 25-08-2026
**Purpose:** Practice a repeatable Linux troubleshooting process for common DevOps services.

---

# 🔐 1. SSH Service — Linux Troubleshooting Runbook

**Target Service:** `ssh` / `sshd` (OpenSSH Daemon)

SSH provides secure remote access to Linux systems. During this drill, I checked the SSH service, process resources, network port, connectivity, configuration, and logs.

---

## 1.1 Environment Basics

### Check Kernel

```bash
uname -a
```

**Example Output:**

```text
Linux ubuntu 6.8.0-generic x86_64 GNU/Linux
```

> **Observation:** The system is running a 64-bit Linux kernel.

### Check OS

```bash
cat /etc/os-release
```

**Example Output:**

```text
PRETTY_NAME="Ubuntu 24.04 LTS"
VERSION_ID="24.04"
VERSION="24.04 LTS (Noble Numbat)"
```

> **Observation:** The machine is running Ubuntu Linux.

---

## 1.2 SSH Service Health

### Check SSH status

```bash
sudo systemctl status ssh --no-pager
```

**Example Output:**

```text
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded
     Active: active (running)
   Main PID: 800 (sshd)
```

> **Observation:** SSH is active and running. The main SSH daemon PID is `800`.

### Check service state

```bash
systemctl is-active ssh
```

**Output:**

```text
active
```

> **Observation:** The SSH service is currently healthy.

---

## 1.3 CPU & Memory

### Check SSH process

```bash
pgrep sshd
```

**Output:**

```text
800
```

### Check resource usage

```bash
ps -o pid,pcpu,pmem,comm -p 800
```

**Output:**

```text
    PID %CPU %MEM COMMAND
    800  0.0  0.1 sshd
```

> **Observation:** SSH is using very little CPU and memory.

### Check system memory

```bash
free -h
```

**Output:**

```text
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.1Gi       3.8Gi       120Mi       1.8Gi       5.2Gi
Swap:          2.0Gi          0B       2.0Gi
```

> **Observation:** There is sufficient available memory and no significant swap usage.

---

## 1.4 Disk & I/O

```bash
df -h
```

**Output:**

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2        50G   18G   30G  38% /
```

> **Observation:** The root filesystem has sufficient free space.

### Check logs size

```bash
sudo du -sh /var/log
```

**Output:**

```text
250M    /var/log
```

> **Observation:** The log directory is using approximately 250 MB and should be monitored for growth.

### Check I/O

```bash
vmstat 1 3
```

**Output:**

```text
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r b swpd free buff cache si so bi bo in cs us sy id wa
 1 0 0 3980000 180000 1800000 0 0 2 5 120 220 2 1 97 0
 0 0 0 3978000 180000 1800000 0 0 1 3 115 210 1 1 98 0
 0 0 0 3975000 180000 1800000 0 0 0 0 110 205 1 1 98 0
```

> **Observation:** CPU idle time is high and there is no significant swap or I/O pressure.

---

## 1.5 Network

### Check SSH port

```bash
sudo ss -tulpn | grep ':22'
```

**Output:**

```text
tcp LISTEN 0 128 0.0.0.0:22 0.0.0.0:* users:(("sshd",pid=800,fd=3))
tcp LISTEN 0 128 [::]:22 [::]:* users:(("sshd",pid=800,fd=4))
```

> **Observation:** SSH is listening on port `22` for IPv4 and IPv6.

### Test local network

```bash
ping -c 3 localhost
```

**Output:**

```text
3 packets transmitted, 3 received, 0% packet loss
rtt min/avg/max = 0.070/0.075/0.080 ms
```

> **Observation:** Local network connectivity is working with 0% packet loss.

### Test SSH

```bash
ssh localhost
```

**Observation:** The SSH authentication prompt appeared successfully, confirming that the SSH service is reachable.

---

## 1.6 SSH Logs

```bash
sudo journalctl -u ssh -n 50 --no-pager
```

**Example Output:**

```text
Aug 25 12:00:10 ubuntu systemd[1]: Started OpenBSD Secure Shell server.
Aug 25 12:00:10 ubuntu sshd[800]: Server listening on 0.0.0.0 port 22.
Aug 25 12:00:10 ubuntu sshd[800]: Server listening on :: port 22.
```

> **Observation:** SSH started successfully and is listening on port 22.

### Authentication log

```bash
sudo tail -n 50 /var/log/auth.log
```

**Example Output:**

```text
Aug 25 12:05:21 ubuntu sshd[1250]: Accepted password for user from 127.0.0.1 port 42150 ssh2
Aug 25 12:05:21 ubuntu sshd[1250]: pam_unix(sshd:session): session opened
```

> **Observation:** A successful SSH authentication is visible in the log.

---

## 1.7 SSH Configuration

```bash
sudo sshd -t
```

**Output:**

```text
```

> **Observation:** No output indicates that the SSH configuration syntax is valid.

---

## 🔎 SSH Quick Findings

| Check         | Status | Finding           |
| ------------- | ------ | ----------------- |
| Service       | ✅      | SSH active        |
| CPU           | ✅      | Low usage         |
| Memory        | ✅      | Healthy           |
| Disk          | ✅      | Sufficient space  |
| Port          | ✅      | Listening on 22   |
| Network       | ✅      | 0% packet loss    |
| Logs          | ✅      | No critical issue |
| Configuration | ✅      | Valid             |

---

## 🚨 If SSH Worsens

### 1. Check failed login attempts

```bash
sudo grep "Failed password" /var/log/auth.log | tail -n 50
```

### 2. Increase logging temporarily

```text
LogLevel VERBOSE
```

Then:

```bash
sudo sshd -t
sudo systemctl restart ssh
```

### 3. Collect deeper diagnostics

```bash
sudo strace -p $(pgrep -o sshd) -e trace=network,read,write -o /tmp/sshd-trace.txt
```

---

