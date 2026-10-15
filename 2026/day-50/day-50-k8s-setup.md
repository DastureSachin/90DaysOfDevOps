
# Day 50 – Kubernetes Architecture and Cluster Setup

> 90DaysOfDevOps | Kubernetes Fundamentals

## Objective

Understand Kubernetes architecture, set up a local Kubernetes cluster using kind, explore cluster components, and practise essential kubectl commands.

By completing this task, I should be able to:

- Explain why Kubernetes is needed.
- Understand Control Plane and Worker Node components.
- Explain what happens when `kubectl apply -f pod.yaml` runs.
- Install and verify kubectl and kind.
- Create and inspect a Kubernetes cluster.
- Understand kube-system Pods.
- Practise cluster lifecycle commands.
- Answer basic Kubernetes interview questions.

---

## Task 1: The Kubernetes Story

### What is Kubernetes?

Kubernetes is an open-source container orchestration platform. It automates the deployment, scaling, networking, and management of containerized applications.

Docker helps build images and run containers. However, managing many containers across multiple machines requires scheduling, recovery, scaling, networking, and desired-state management.

Kubernetes helps automate these operations across a cluster.

### History

Kubernetes was originally developed at Google and inspired by Google's internal Borg and Omega cluster-management systems. Google open-sourced Kubernetes in 2014, and it later became a Cloud Native Computing Foundation (CNCF) project.

The name Kubernetes comes from Greek and means "helmsman" or "pilot."

### Docker vs Kubernetes

| Docker | Kubernetes |
|---|---|
| Builds container images and runs containers. | Orchestrates containerized applications across a cluster. |
| Provides container-level operations. | Provides scheduling, scaling, and workload management. |
| Runs containers using a container runtime. | Coordinates workloads across cluster nodes. |
| Does not by itself provide Kubernetes-style cluster orchestration. | Helps maintain the desired state of applications. |

### Interview Answer

Docker packages and runs containers, while Kubernetes orchestrates containerized applications across a cluster. Kubernetes helps manage scheduling, scaling, networking, and recovery.

### Recall Questions

Before checking the documentation, write your own answers:

1. Why was Kubernetes created?
2. Who created Kubernetes, and what inspired it?
3. What does the name Kubernetes mean?

Official reference:
https://kubernetes.io/docs/concepts/overview/

---

## Task 2: Kubernetes Architecture

A Kubernetes cluster contains a Control Plane and one or more Worker Nodes.

The Control Plane manages the cluster, while Worker Nodes run application workloads.

### Architecture Diagram

```text
                    ADMIN / DEVELOPER
                 kubectl apply -f pod.yaml
                           |
                           v
+--------------------------------------------------+
|                  CONTROL PLANE                   |
|                                                  |
|  +-------------+        +------------------+     |
|  | API Server  |<------>|      etcd        |     |
|  | Front Door  |        | Cluster Database |     |
|  +------+------+        +------------------+     |
|         |                                        |
|  +------v------+         +-------------------+   |
|  |  Scheduler  |         | Controller Manager|   |
|  | Selects Node|         | Reconciles State  |   |
|  +-------------+         +-------------------+   |
+---------------------------+----------------------+
                            |
                  Cluster Management
                            |
             +--------------+--------------+
             |                             |
             v                             v
+---------------------------+ +---------------------------+
|       WORKER NODE         | |       WORKER NODE         |
|                           | |                           |
|  kubelet                  | |  kubelet                  |
|  kube-proxy (if used)     | |  kube-proxy (if used)     |
|  Container Runtime        | |  Container Runtime        |
|          |                | |          |                |
|          v                | |          v                |
|  +---------------------+  | |  +---------------------+  |
|  | Pod                 |  | |  | Pod                 |  |
|  | Container(s)        |  | |  | Container(s)        |  |
|  +---------------------+  | |  +---------------------+  |
+---------------------------+ +---------------------------+
```

Note: "Control Plane" is the preferred modern term instead of "Master Node."

### Control Plane Components

#### 1. API Server

- The front door of the Kubernetes cluster.
- Receives requests from kubectl and other clients.
- Authenticates, authorizes, validates, and processes API requests.
- Other Kubernetes components communicate with the cluster through the API.

Interview keyword: API endpoint.

#### 2. etcd

- A consistent key-value store.
- Stores Kubernetes cluster data and state.
- Helps preserve the cluster's recorded configuration.

Interview keyword: Cluster state database.

#### 3. Scheduler

- Finds Pods that do not have a node assigned.
- Selects a suitable Worker Node based on resource availability and scheduling requirements.

Interview keyword: Pod placement.

#### 4. Controller Manager

- Runs Kubernetes controllers.
- Watches cluster state.
- Works to make the actual state match the desired state.

Interview keyword: Reconciliation loop.

### Worker Node Components

#### 1. kubelet

- An agent running on each node.
- Ensures that Pods assigned to the node are running as specified.
- Communicates with the API Server.

#### 2. kube-proxy

- Implements Kubernetes Service networking rules on many clusters.
- Helps route traffic to the appropriate endpoints.
- Some networking solutions replace its functionality.

#### 3. Container Runtime

- Responsible for running containers.
- Examples include containerd and CRI-O.

#### 4. Pod

- The smallest deployable unit in Kubernetes.
- Contains one or more containers.
- Containers in a Pod share certain resources, such as networking.

---

## What Happens When We Run kubectl apply?

Command:

```bash
kubectl apply -f pod.yaml
```

Request flow:

1. kubectl reads the YAML manifest.
2. kubectl sends the request to the API Server.
3. The API Server authenticates and authorizes the request, validates it, and processes the object.
4. The cluster state is recorded in etcd through the API Server.
5. The Scheduler identifies an unscheduled Pod and chooses a suitable node.
6. The scheduling decision is recorded through the API Server.
7. The kubelet on the selected node detects the assigned Pod.
8. The kubelet works with the container runtime to pull images if necessary and start the containers.
9. Networking components configure connectivity as required.
10. The kubelet reports Pod status through the API Server.

Important: A successful `kubectl apply` does not guarantee that the application is already running or ready.

### What If the API Server Goes Down?

- New API requests and many management operations fail.
- Existing containers may continue running for some time.
- Scheduling and controller operations that depend on the API Server are disrupted.
- The impact depends on the cluster architecture and failure.

### What If a Worker Node Goes Down?

- Kubernetes may mark the node unhealthy after a detection delay.
- Pods on the node may become unavailable.
- Controllers such as Deployments can create replacement Pods on healthy nodes when capacity and scheduling constraints allow.
- Recovery is not instant.
- A standalone Pod does not receive the same automatic replacement behavior as a Deployment-managed Pod.

---

## Task 3: Install kubectl

kubectl is the command-line tool used to communicate with a Kubernetes cluster.

### Install on Ubuntu/Linux

Follow the official instructions for your CPU architecture:

https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/

Example for Linux AMD64:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

chmod +x kubectl

sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

For ARM64 or another architecture, use the matching binary from the official documentation.

### Verify Installation

```bash
kubectl version --client
```

Expected result: kubectl displays client version information.

---

## Task 4: Set Up a Local Cluster Using kind

### What Is kind?

kind stands for Kubernetes in Docker.

It runs local Kubernetes clusters using Docker containers as nodes. It is useful for learning, development, and testing.

Official documentation:
https://kind.sigs.k8s.io/docs/user/quick-start/

### Why I Chose kind

I chose kind because:

- It uses Docker containers as Kubernetes nodes.
- It is useful for local Kubernetes practice.
- It makes cluster creation and deletion straightforward.
- It helps me learn Kubernetes architecture and kubectl commands.

### Step 1: Verify Docker

kind requires Docker to be running.

```bash
docker --version
docker info
```

If `docker info` fails, resolve the Docker service or permission issue before creating the cluster.

### Step 2: Install kind

Example for Linux AMD64:

```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64

chmod +x ./kind

sudo install ./kind /usr/local/bin/kind
```

Verify:

```bash
kind version
```

### Step 3: Create the Cluster

```bash
kind create cluster --name devops-cluster
```

This creates a local Kubernetes cluster named `devops-cluster`.

### Step 4: Verify the Cluster

```bash
kind get clusters

kubectl config current-context

kubectl cluster-info

kubectl get nodes
```

Expected output will look similar to this:

```text
NAME                           STATUS   ROLES           AGE   VERSION
devops-cluster-control-plane   Ready    control-plane   1m    v1.xx.x
```

The version, node name, and age will vary.

The important thing is that the node reaches `Ready` status.

Use your real terminal output as proof of completion.

---

## Task 5: Explore the Cluster

### Cluster Information

```bash
kubectl cluster-info
```

Shows information about the Kubernetes cluster endpoints.

### List Nodes

```bash
kubectl get nodes
```

Lists the nodes in the cluster.

### Detailed Node Information

```bash
kubectl get nodes -o wide
```

Shows additional node information, including IP addresses and OS details.

```bash
kubectl describe node <node-name>
```

Replace `<node-name>` with the actual node name from `kubectl get nodes`.

This command displays node conditions, capacity, resource allocation, labels, and assigned Pods.

### List Namespaces

```bash
kubectl get namespaces
```

Namespaces group namespaced resources within a cluster.

### List Pods

```bash
kubectl get pods
```

Lists Pods in the current namespace.

```bash
kubectl get pods -A
```

Lists Pods across all namespaces.

The `-A` flag means `--all-namespaces`.

### Explore kube-system

```bash
kubectl get pods -n kube-system
```

This namespace contains important Kubernetes system components and add-ons.

### Common kube-system Components

| Component | Purpose |
|---|---|
| etcd | Stores Kubernetes cluster state. |
| kube-apiserver | Exposes the Kubernetes API. |
| kube-scheduler | Selects nodes for unscheduled Pods. |
| kube-controller-manager | Runs controllers that reconcile cluster state. |
| coredns | Provides DNS-based service discovery inside the cluster. |
| kube-proxy | Maintains Service networking rules when used. |
| kindnet or another network component | Provides Pod networking in a typical kind setup. |

The exact list depends on cluster configuration and version. Not every cluster uses the same networking components.

### Inspect System Pods

```bash
kubectl get pods -n kube-system -o wide
```

```bash
kubectl describe pod <pod-name> -n kube-system
```

Replace `<pod-name>` with an actual Pod name.

### Screenshot Requirements

Capture genuine screenshots from your own terminal.

Screenshot 1:

```bash
kubectl get nodes
```

The output should show the node with `Ready` status.

Suggested filename:

`day-50-kubectl-get-nodes.png`

Screenshot 2:

```bash
kubectl get pods -n kube-system
```

Suggested filename:

`day-50-kube-system-pods.png`

Save the screenshots in your Day 50 directory.

---

## Task 6: Cluster Lifecycle

### Check Current Context

```bash
kubectl config current-context
```

Shows the Kubernetes context currently used by kubectl.

### List Contexts

```bash
kubectl config get-contexts
```

Shows the configured contexts and indicates the current context.

### View kubeconfig

```bash
kubectl config view
```

Displays Kubernetes connection configuration. Review it carefully because configuration may contain sensitive authentication details.

### What Is kubeconfig?

A kubeconfig file tells kubectl how to connect to Kubernetes clusters.

It can contain:

- Cluster API server information.
- User authentication information.
- Contexts that combine a cluster, user, and default namespace.

Default Linux/macOS location:

```text
~/.kube/config
```

The `KUBECONFIG` environment variable or `--kubeconfig` flag can specify another configuration file.

Never commit credentials or tokens to GitHub.

### Delete the Cluster

Warning: deleting a cluster removes its local Kubernetes resources.

Only perform this step if you are ready to remove the current cluster.

```bash
kind delete cluster --name devops-cluster
```

Verify:

```bash
kind get clusters
```

### Recreate the Cluster

```bash
kind create cluster --name devops-cluster
```

Verify:

```bash
kubectl get nodes
```

The node should return to `Ready` after the cluster has finished starting.

---

## Troubleshooting

### Problem 1: kubectl Cannot Connect

Check:

```bash
kind get clusters

kubectl config current-context

kubectl cluster-info
```

Possible causes:

- The cluster is stopped or does not exist.
- kubectl is using the wrong context.
- Cluster creation failed.

### Problem 2: Docker Error During Cluster Creation

Check:

```bash
docker --version

docker info

docker ps
```

Ensure Docker is running and the current user has permission to access it.

### Problem 3: Node Is NotReady

Check:

```bash
kubectl get nodes -o wide

kubectl describe node <node-name>

kubectl get pods -A
```

Review node conditions, events, networking, and system Pod status.

### Problem 4: A Pod Is Not Running

Check:

```bash
kubectl get pods -A

kubectl describe pod <pod-name> -n <namespace>

kubectl get events -A --sort-by=.metadata.creationTimestamp
```

Look for image-pull errors, scheduling problems, failed probes, and configuration issues.

### Problem 5: Command Not Found

Check:

```bash
command -v kubectl

command -v kind

echo "$PATH"
```

Verify that the binaries are installed and their installation directory is available in `PATH`.

---

## Interview Questions and Answers

### Q1. What is Kubernetes?

Kubernetes is an open-source container orchestration platform used to manage containerized workloads across a cluster.

### Q2. Why do we need Kubernetes if we have Docker?

Docker builds and runs containers. Kubernetes coordinates containerized applications across multiple nodes and helps manage scheduling, scaling, networking, and recovery.

### Q3. What is a Kubernetes cluster?

A Kubernetes cluster consists of a Control Plane and one or more Worker Nodes that run workloads.

### Q4. What is the Control Plane?

The Control Plane manages the cluster through components such as the API Server, etcd, Scheduler, and Controller Manager.

### Q5. What is etcd?

etcd is a consistent key-value store that stores Kubernetes cluster data.

### Q6. What does the Scheduler do?

It selects a suitable node for Pods that have not yet been assigned to a node.

### Q7. What does the kubelet do?

The kubelet is a node agent that ensures Pods assigned to its node are running as specified.

### Q8. What happens when kubectl apply runs?

kubectl sends the manifest to the API Server. The API Server processes the object, the state is recorded in etcd, the Scheduler selects a node, and the node's kubelet works with the container runtime to start the Pod.

### Q9. What is a namespace?

A namespace groups namespaced Kubernetes resources within a cluster.

### Q10. What is kubeconfig?

It is the configuration kubectl uses to identify clusters, authentication information, and contexts.

### Q11. What is kind?

kind is a tool for running local Kubernetes clusters using Docker containers as nodes.

### Q12. What is the difference between a Pod and a container?

A container runs an application process. A Pod is Kubernetes' smallest deployable unit and can contain one or more containers.

### Q13. Does Kubernetes instantly replace every Pod after a node failure?

No. Detection and recovery take time. Replacement behavior depends on workload controllers, available capacity, and scheduling constraints.

### Q14. What does kubectl get pods -A do?

It lists Pods across all namespaces.

### Q15. What is the difference between kubectl get and kubectl describe?

`get` provides a concise resource listing or representation. `describe` gives detailed information about a resource, including conditions and events where available.

---

## Day 50 Completion Checklist

- [ ] Wrote my Kubernetes recall answers.
- [ ] Understood the architecture diagram.
- [ ] Installed kubectl.
- [ ] Verified kubectl with `kubectl version --client`.
- [ ] Installed kind.
- [ ] Verified Docker is running.
- [ ] Created `devops-cluster`.
- [ ] Confirmed `kubectl get nodes` shows Ready.
- [ ] Explored namespaces and Pods.
- [ ] Inspected `kube-system`.
- [ ] Understood kubeconfig.
- [ ] Checked the current context.
- [ ] Practised cluster deletion and recreation safely.
- [ ] Captured the node screenshot.
- [ ] Captured the kube-system screenshot.
- [ ] Revised the interview questions.

## My Notes

**Tool selected:** kind

**Reason:** Local Kubernetes practice using Docker containers as nodes.

**Cluster name:** `devops-cluster`

**Current context:** Write the output of `kubectl config current-context`.

**Node status:** Write the output of `kubectl get nodes`.

**What I learned:**
- 
- 
- 

**Issue faced and solution:**
- 

## Official References

- Kubernetes Overview: https://kubernetes.io/docs/concepts/overview/
- Kubernetes Components: https://kubernetes.io/docs/concepts/overview/components/
- Install kubectl on Linux: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
- kind Quick Start: https://kind.sigs.k8s.io/docs/user/quick-start/
- kubectl Command Reference: https://kubernetes.io/docs/reference/kubectl/

---

## Day 50 Takeaway

Kubernetes accepts the desired state through the API Server, stores cluster data in etcd, schedules Pods onto nodes, and uses node agents and controllers to move the cluster toward the desired state.
