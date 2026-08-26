# Day 14 - Networking Fundamentals & Hands-on Checks

---

## 📚 Quick Concepts

### OSI Model (L1-L7) vs TCP/IP Stack

| OSI Layer | Name         | TCP/IP Layer | Examples               |
| --------- | ------------ | ------------ | ---------------------- |
| L7        | Application  | Application  | HTTP, HTTPS, DNS, SSH  |
| L6        | Presentation | Application  | Encryption, encoding   |
| L5        | Session      | Application  | Session management     |
| L4        | Transport    | Transport    | TCP, UDP               |
| L3        | Network      | Internet     | IP, ICMP, routing      |
| L2        | Data Link    | Link         | Ethernet, MAC, ARP     |
| L1        | Physical     | Link         | Cables, Wi-Fi, signals |

### Easy understanding

* **OSI** has 7 layers and is mainly useful for understanding and troubleshooting networking.
* **TCP/IP** is the practical model used by the Internet.
* TCP/IP combines the OSI Application, Presentation and Session layers into the Application layer.

### Important idea

```text
OSI                         TCP/IP

L7 Application       ┐
L6 Presentation      ├──→ Application
L5 Session           ┘

L4 Transport         ───→ Transport

L3 Network           ───→ Internet

L2 Data Link         ┐
L1 Physical          ┴──→ Link
```

---

## 🌐 Where Protocols Sit

| Protocol | OSI Layer | TCP/IP Layer | Purpose                           |
| -------- | --------- | ------------ | --------------------------------- |
| IP       | L3        | Internet     | Addressing and routing            |
| ICMP     | L3        | Internet     | Network diagnostics               |
| TCP      | L4        | Transport    | Reliable communication            |
| UDP      | L4        | Transport    | Fast connectionless communication |
| DNS      | L7        | Application  | Domain → IP resolution            |
| HTTP     | L7        | Application  | Web communication                 |
| HTTPS    | L7        | Application  | Secure web communication          |
| SSH      | L7        | Application  | Remote server access              |

### Common ports

```text
22   → SSH
53   → DNS
80   → HTTP
443  → HTTPS
```

---

## 🔗 Real-World Example

When I run:

```bash
curl https://example.com
```

multiple networking layers work together:

```text
curl
 ↓
HTTPS
 ↓
TCP
 ↓
IP
 ↓
Network Interface
```

### In simple words

```text
DNS
 ↓
Find IP address

TCP
 ↓
Create reliable connection

TLS
 ↓
Encrypt HTTPS traffic

HTTP
 ↓
Send web request

IP
 ↓
Route packets to destination
```

---

# Hands-on Networking Checks

> **Target used for testing:** `amazon.com` / `google.com`

---

## 1. Identity - Check IP Address

### Command

```bash
hostname -I
```

Alternative:

```bash
ip addr show
```

### Purpose

Shows the IP addresses assigned to the machine.

### My EC2 server

The server has a private IP in the AWS VPC:

```text
172.31.33.91
```

### Observation

* `hostname -I` gives a quick view of the machine's IP.
* `ip addr show` provides more detailed interface information.
* `172.31.x.x` is a private IP address used inside the AWS VPC.

### Easy understanding

```text
EC2 Server
   ↓
Private IP
   ↓
AWS VPC
   ↓
Internet through AWS networking/NAT
```

---

# 2. Reachability - ping

### Command

```bash
ping -c 4 amazon.com
```

### Output

```text
PING amazon.com (3.33.192.77) 56(84) bytes of data.

64 bytes from 3.33.192.77: icmp_seq=1 ttl=250 time=3.04 ms
64 bytes from 3.33.192.77: icmp_seq=2 ttl=250 time=3.05 ms
64 bytes from 3.33.192.77: icmp_seq=3 ttl=250 time=3.06 ms
64 bytes from 3.33.192.77: icmp_seq=4 ttl=250 time=3.09 ms

--- amazon.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
```

### Observation

* **4 packets sent**
* **4 packets received**
* **0% packet loss**
* Average latency was approximately **3 ms**

### Conclusion

The destination was reachable and the connection was stable during this test.

### Easy understanding

```text
My EC2
   ↓
ICMP packet
   ↓
amazon.com
   ↓
ICMP reply
   ↓
My EC2
```

`ping` mainly tests **basic network reachability**, not whether an application is healthy.

---

# 3. Path - traceroute

### Command

```bash
traceroute amazon.com
```

### Purpose

`traceroute` shows the network hops between my server and the destination.

Example:

```text
My EC2
  ↓
Hop 1
  ↓
Hop 2
  ↓
Hop 3
  ↓
...
  ↓
Destination
```

### My observation

The first few hops responded, while many later hops showed:

```text
* * *
```

### What does `* * *` mean?

It does **not automatically mean the network is broken**.

A router may:

* Ignore traceroute probes
* Filter ICMP responses
* Be configured not to respond

### Important lesson

```text
* * *
```

does not always mean a network failure.

If the final destination is reachable and applications work, intermediate traceroute timeouts may simply be filtering.

---

# 4. Ports - ss

### Command

```bash
ss -tulpn
```

### Purpose

Shows:

* TCP sockets
* UDP sockets
* Listening ports
* Processes using the ports

### My output

Important entries included:

```text
tcp   LISTEN   0.0.0.0:22
tcp   LISTEN   [::]:22
```

### Observation

Port `22` is listening.

```text
22 → SSH
```

This means the SSH service is accepting connections on the server.

I also observed DNS listeners on:

```text
127.0.0.53:53
127.0.0.54:53
```

### Important `ss` options

```text
-t → TCP
-u → UDP
-l → Listening
-p → Process
-n → Don't resolve names
```

### Easy understanding

```text
ss -tulpn
     ↓
What ports are open/listening?
     ↓
Which process owns them?
```

---

# 5. Name Resolution - DNS

## Using dig

### Command

```bash
dig amazon.com
```

### Purpose

Checks whether DNS can resolve a domain name into an IP address.

### My result

```text
amazon.com → 3.33.192.77
amazon.com → 15.197.245.13
```

### DNS flow

```text
amazon.com
     ↓
DNS Resolver
     ↓
IP Address
```

### My DNS server

The output showed:

```text
SERVER: 127.0.0.53#53
```

This is the local DNS stub resolver.

### Easy understanding

Instead of remembering:

```text
3.33.192.77
```

we use:

```text
amazon.com
```

DNS performs the translation.

---

# 6. HTTP Check - curl

### Command

```bash
curl -I https://www.linkedin.com/
```

### Purpose

`curl -I` sends a HEAD request and displays HTTP response headers.

### My result

```text
HTTP/2 200
```

### Meaning

```text
200 → Successful HTTP response
```

This means the server responded successfully at the HTTP level.


# 7. Connections Snapshot - netstat

### Command

```bash
netstat -an | head
```

### Purpose

Shows active network connections and listening sockets.

My output contained states such as:

```text
LISTEN
ESTABLISHED
TIME_WAIT
```

### LISTEN

A service is waiting for incoming connections.

Example:

```text
0.0.0.0:22
```

means SSH is listening on port 22.

### ESTABLISHED

A connection is currently active.

Example:

```text
172.31.33.91:22
```

indicates an active SSH connection.

### TIME_WAIT

A TCP connection has recently closed and is waiting for cleanup.



# Mini Task - Port Probe & Interpret

## Step 1: Identify a listening port

From:

```bash
ss -tulpn
```

I identified:

```text
22 → SSH
```

---

## Step 2: Test the port

```bash
nc -zv localhost 22
```

### Result

```text
Connection to localhost 22 port [tcp/ssh] succeeded!
```

### Meaning

Port 22 is reachable locally and the SSH service is responding.

---

## Step 3: If the port was not reachable

I would check:

### 1. Is SSH running?

```bash
systemctl status ssh
```

### 2. Is the port listening?

```bash
ss -tulpn | grep :22
```

### 3. Is the firewall blocking it?

```bash
sudo ufw status
```

For AWS, I would also check the **EC2 Security Group** rules.

---

# Reflection



### Useful commands

```bash
hostname -I
ip addr
ping <host>
dig <domain>
traceroute <host>
ss -tulpn
nc -zv <host> <port>
systemctl status <service>
curl -I <url>
```

---

#  Two Follow-up Checks in a Real Incident

## 1. Check service logs

```bash
journalctl -u <service>
```

This can show errors such as:

```text
connection refused
permission denied
service failed
configuration error
```

---

## 2. Check the listening port

```bash
ss -tulpn
```

Then test the service locally:

```bash
curl -I http://localhost:<port>
```

### Why?

If:

```text
localhost works
      ↓
but remote access fails
```

I would investigate:

* Firewall
* AWS Security Group
* Network routing
* Load balancer
* External connectivity

---

# Command Quick Reference

| Command            | What it checks               | Layer               |
| ------------------ | ---------------------------- | ------------------- |
| `hostname -I`      | Local IP address             | L3                  |
| `ip addr`          | Network interface/IP details | L3                  |
| `ping`             | Host reachability            | L3                  |
| `traceroute`       | Network path                 | L3                  |
| `dig`              | DNS resolution               | L7                  |
| `nslookup`         | DNS resolution               | L7                  |
| `ss -tulpn`        | Listening ports              | L4                  |
| `netstat -an`      | Active connections           | L4                  |
| `nc -zv`           | TCP port connectivity        | L4                  |
| `curl -I`          | HTTP response                | L7                  |
| `systemctl status` | Service status               | Service             |
| `journalctl`       | Service logs                 | Application/Service |

---


# My Key Takeaways

Today I practiced the core Linux networking troubleshooting commands:

```text
ping
traceroute
ss
dig
curl
netstat
nc
```

The biggest lesson was that networking troubleshooting should be **systematic** instead of guessing.

```text
IP
 ↓
Connectivity
 ↓
DNS
 ↓
Route
 ↓
Port
 ↓
Service
 ↓
Firewall
 ↓
Application
```

These commands give me quick signals about where a problem may exist.

---

##  One-Line Memory Trick

```text
ping     → Can I reach it?
dig      → Can I resolve it?
trace    → How do I reach it?
ss       → What is listening?
nc       → Can I reach the port?
curl     → Does the application respond?
systemctl → Is the service running?
journalctl → Why is the service failing?
```

