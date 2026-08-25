# 🐳 3. Docker Service — Linux Troubleshooting Runbook

**Target Service:** `docker`

Docker is a containerization platform used to package and run applications in isolated containers.

---

## 3.1 Docker Service Health

### Check Docker status

```bash
sudo systemctl status docker --no-pager
```

**Example Output:**

```text
● docker.service - Docker Application Container Engine
     Loaded: loaded
     Active: active (running)
   Main PID: 950 (dockerd)
```

> **Observation:** Docker daemon is active and running.

### Check state

```bash
systemctl is-active docker
```

**Output:**

```text
active
```

> **Observation:** Docker service is healthy.

### Check Docker version

```bash
docker --version
```

**Output:**

```text
Docker version 28.x.x, build xxxxxxx
```

> **Observation:** Docker CLI is installed and available.

### Check Docker daemon

```bash
docker info
```

**Example Output:**

```text
Containers: 3
 Running: 2
 Paused: 0
 Stopped: 1
Images: 5
Server Version: 28.x.x
```

> **Observation:** The Docker daemon is responding and reporting container and image information.

---

## 3.2 CPU & Memory

### Check running containers

```bash
docker ps
```

**Example Output:**

```text
CONTAINER ID   IMAGE       STATUS          PORTS
a1b2c3d4e5f6   nginx       Up 20 minutes   0.0.0.0:8080->80/tcp
```

> **Observation:** The container is running successfully.

### Check container resources

```bash
docker stats --no-stream
```

**Example Output:**

```text
CONTAINER ID   NAME    CPU %   MEM USAGE / LIMIT
a1b2c3d4e5f6   web     0.15%   8MiB / 1GiB
```

> **Observation:** Container CPU and memory usage are low.

### Check system memory

```bash
free -h
```

**Output:**

```text
Mem: 7.7Gi 2.1Gi 3.8Gi 120Mi 1.8Gi 5.2Gi
Swap: 2.0Gi 0B 2.0Gi
```

> **Observation:** The host system has sufficient memory available.

---

## 3.3 Disk & I/O

### Check filesystem

```bash
df -h
```

**Output:**

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2        50G   18G   30G  38% /
```

> **Observation:** The host filesystem has sufficient free space.

### Check Docker disk usage

```bash
docker system df
```

**Example Output:**

```text
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          5         2         2.1GB     800MB
Containers      3         2         150MB     50MB
Local Volumes   2         1         500MB     200MB
Build Cache     4         0         300MB     300MB
```

> **Observation:** Docker is consuming disk space through images, containers, volumes, and build cache. Unused resources can be cleaned if disk pressure increases.

---

## 3.4 Network

### Check Docker containers and ports

```bash
docker ps
```

**Output:**

```text
CONTAINER ID   IMAGE   PORTS
a1b2c3d4e5f6   nginx   0.0.0.0:8080->80/tcp
```

> **Observation:** The Nginx container is exposing port `8080` on the host and forwarding it to port `80` inside the container.

### Check listening ports

```bash
ss -tulpn
```

**Example Output:**

```text
tcp LISTEN 0 4096 0.0.0.0:8080 0.0.0.0:*
```

> **Observation:** The application port is listening on the host.

---

## 3.5 Docker Logs

### Docker service logs

```bash
sudo journalctl -u docker -n 50 --no-pager
```

**Example Output:**

```text
Aug 25 12:00:10 ubuntu systemd[1]: Started docker.service.
Aug 25 12:00:10 ubuntu dockerd[950]: Docker daemon started successfully.
```

> **Observation:** The Docker daemon started successfully and no critical error is visible in the recent entries.

### Container logs

```bash
docker logs <container_id> --tail 50
```

**Example Output:**

```text
2026-08-25 12:10:10 Server started
2026-08-25 12:10:15 GET / 200
```

> **Observation:** The container application started successfully and processed an HTTP request.

---

## 3.6 Docker Container Inspection

```bash
docker ps -a
```

**Example Output:**

```text
CONTAINER ID   IMAGE   STATUS
a1b2c3d4e5f6   nginx   Up 20 minutes
f6e5d4c3b2a1   redis   Exited (0) 2 hours ago
```

> **Observation:** Running and stopped containers can be identified. A container with an unexpected `Exited` status should be investigated using `docker logs`.

---

## 🔎 Docker Quick Findings

| Check          | Status | Finding                    |
| -------------- | ------ | -------------------------- |
| Docker Service | ✅      | Docker active              |
| Daemon         | ✅      | Responding                 |
| CPU            | ✅      | Low usage                  |
| Memory         | ✅      | Healthy                    |
| Disk           | ⚠️     | Monitor Docker storage     |
| Containers     | ✅      | Running containers healthy |
| Network        | ✅      | Ports mapped correctly     |
| Logs           | ✅      | No critical daemon error   |

---

## 🚨 If Docker Worsens

### 1. Investigate Docker service logs

```bash
sudo journalctl -u docker -n 100 --no-pager
```

### 2. Check containers and resources

```bash
docker ps -a
docker stats --no-stream
docker system df
```

### 3. Restart Docker

```bash
sudo systemctl restart docker
sudo systemctl status docker --no-pager
```

After restarting, verify important containers:

```bash
docker ps
```

---

# 📊 Final Comparison

| Area                | 🔐 SSH                 | 🌐 Nginx          | 🐳 Docker                        |
| ------------------- | ---------------------- | ----------------- | -------------------------------- |
| Main Purpose        | Remote access          | Web server        | Containers                       |
| Default Port        | 22                     | 80 / 443          | Depends on application           |
| Main Process        | `sshd`                 | `nginx`           | `dockerd`                        |
| Service Manager     | systemd                | systemd           | systemd                          |
| Main Logs           | `/var/log/auth.log`    | `/var/log/nginx/` | `journalctl` + container logs    |
| Health Check        | `systemctl status ssh` | `curl localhost`  | `docker info`                    |
| Resource Check      | `ps`                   | `ps`              | `docker stats`                   |
| Network Check       | `ss :22`               | `ss :80`          | Container port mapping           |
| Configuration Check | `sshd -t`              | `nginx -t`        | `docker info` / container config |

---

# 🧠 What I Learned

This troubleshooting drill helped me understand that troubleshooting a Linux/DevOps service is not only about checking whether the service is running.

A repeatable troubleshooting process is:

**Service → Process → CPU/Memory → Disk/I/O → Network → Logs → Configuration → Recovery**

### Key Takeaways

* `systemctl` helps manage and inspect Linux services.
* `ps`, `free`, and `vmstat` help identify resource problems.
* `df` and `du` help identify disk-related problems.
* `ss` helps identify listening ports and network services.
* `journalctl` helps investigate systemd service logs.
* Application-specific logs provide deeper troubleshooting information.
* Configuration validation should happen before restarting services.
* A runbook makes troubleshooting repeatable during incidents.

---

# 📝 Note

The outputs shown above are **example outputs for documentation**.

For the actual Day 5 submission, I should replace the example outputs with outputs collected from my own Linux system. This keeps the troubleshooting runbook based on real hands-on practice rather than generic copy/paste.
