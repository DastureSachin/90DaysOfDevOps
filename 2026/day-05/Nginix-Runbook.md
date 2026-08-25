# 🌐 2. Nginx Service — Linux Troubleshooting Runbook

**Target Service:** `nginx`

Nginx is a web server and reverse proxy. The troubleshooting drill checks service health, resource usage, ports, HTTP connectivity, configuration, and logs.

---

## 2.1 Nginx Service Health

### Check status

```bash
sudo systemctl status nginx --no-pager
```

**Example Output:**

```text
● nginx.service - A high performance web server
     Loaded: loaded
     Active: active (running)
   Main PID: 1254 (nginx)
```

> **Observation:** Nginx is active and running.

### Check state

```bash
systemctl is-active nginx
```

**Output:**

```text
active
```

> **Observation:** Nginx is currently healthy.

---

## 2.2 CPU & Memory

```bash
ps -o pid,pcpu,pmem,comm -C nginx
```

**Output:**

```text
    PID %CPU %MEM COMMAND
   1254  0.0  0.1 nginx
   1255  0.0  0.1 nginx
   1256  0.0  0.1 nginx
```

> **Observation:** Nginx processes are using minimal CPU and memory.

### System memory

```bash
free -h
```

**Output:**

```text
Mem: 7.7Gi 2.1Gi 3.8Gi 120Mi 1.8Gi 5.2Gi
Swap: 2.0Gi 0B 2.0Gi
```

> **Observation:** The system has sufficient available memory.

---

## 2.3 Disk & I/O

```bash
df -h
```

**Output:**

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2        50G   18G   30G  38% /
```

> **Observation:** Disk space is healthy.

### Nginx logs

```bash
sudo du -sh /var/log/nginx
```

**Output:**

```text
12M     /var/log/nginx
```

> **Observation:** Nginx logs are using approximately 12 MB.

### I/O

```bash
vmstat 1 3
```

**Output:**

```text
r b swpd free buff cache si so bi bo us sy id wa
1 0 0 3980000 180000 1800000 0 0 2 5 2 1 97 0
0 0 0 3978000 180000 1800000 0 0 1 3 1 1 98 0
0 0 0 3975000 180000 1800000 0 0 0 0 1 1 98 0
```

> **Observation:** There is no significant CPU, memory, or I/O pressure.

---

## 2.4 Network

### Check Nginx port

```bash
sudo ss -tulpn | grep nginx
```

**Output:**

```text
tcp LISTEN 0 511 0.0.0.0:80 0.0.0.0:* users:(("nginx",pid=1254,fd=6))
```

> **Observation:** Nginx is listening on HTTP port `80`.

### Test HTTP

```bash
curl -I http://localhost
```

**Output:**

```text
HTTP/1.1 200 OK
Server: nginx/1.24.0
Content-Type: text/html
Connection: keep-alive
```

> **Observation:** HTTP status `200 OK` confirms that Nginx is responding successfully.

---

## 2.5 Nginx Logs

```bash
sudo journalctl -u nginx -n 50 --no-pager
```

**Example Output:**

```text
Aug 25 12:00:10 ubuntu systemd[1]: Starting nginx.service...
Aug 25 12:00:10 ubuntu systemd[1]: Started nginx.service.
```

> **Observation:** Nginx started successfully without a critical service error.

### Error log

```bash
sudo tail -n 50 /var/log/nginx/error.log
```

**Example Output:**

```text
2026/08/25 12:05:10 [notice] nginx/1.24.0
2026/08/25 12:05:10 [notice] using the "epoll" event method
```

> **Observation:** No critical error is visible in the reviewed entries.

### Access log

```bash
sudo tail -n 50 /var/log/nginx/access.log
```

**Example Output:**

```text
127.0.0.1 - - [25/Aug/2026:12:10:20 +0530] "HEAD / HTTP/1.1" 200 0 "-" "curl"
```

> **Observation:** The HTTP request was successfully processed with status code `200`.

---

## 2.6 Configuration Test

```bash
sudo nginx -t
```

**Output:**

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

> **Observation:** Nginx configuration syntax is valid.

---

## 🔎 Nginx Quick Findings

| Check         | Status | Finding           |
| ------------- | ------ | ----------------- |
| Service       | ✅      | Nginx active      |
| CPU           | ✅      | Low usage         |
| Memory        | ✅      | Healthy           |
| Disk          | ✅      | Sufficient        |
| Port          | ✅      | Listening on 80   |
| HTTP          | ✅      | 200 OK            |
| Logs          | ✅      | No critical error |
| Configuration | ✅      | Valid             |

---

## 🚨 If Nginx Worsens

### 1. Test configuration

```bash
sudo nginx -t
```

### 2. Restart service

```bash
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
```

### 3. Collect detailed logs

```bash
sudo journalctl -u nginx -n 100 --no-pager
sudo tail -n 100 /var/log/nginx/error.log
sudo ss -tulpn | grep -E ':80|:443'
```

---

