Day 50 – Kubernetes Architecture and Cluster Setup
90DaysOfDevOps | Kubernetes Fundamentals
Goal: Understand the Kubernetes architecture, create a local cluster, inspect its components, and practise the essential kubectl commands.

1. What I should be able to explain
By the end of this task, I should be able to:
- Explain why Kubernetes is needed when Docker is already available.
- Identify the main Control Plane and Worker Node components.
- Trace what happens after kubectl apply -f pod.yaml.
- Install and verify kubectl.
- Create and inspect a local cluster using kind.
- Explain the purpose of common kube-system pods.
- Delete and recreate a cluster, and explain what a kubeconfig does.
2. Kubernetes story: history and purpose
In simple words
Docker can build and run containers, but running many containers reliably across multiple machines creates additional work. We need to schedule workloads, recover from failures, scale applications, and manage networking and desired state. Kubernetes (K8s) is an open-source container orchestration platform that automates many of these tasks.
Kubernetes was originally developed at Google and was influenced by Google's internal Borg and Omega cluster-management systems. Google open-sourced Kubernetes in 2014, and it later became a Cloud Native Computing Foundation (CNCF) project. The name comes from the Greek word kubernetes, meaning helmsman or pilot—someone who steers a ship.
Docker vs Kubernetes
Docker / container runtime tools	Kubernetes
Build images and run containers.	Coordinates containerized workloads across a cluster.
Run a container with commands such as docker run.	Declare the desired state; Kubernetes works to maintain it.
A single container does not automatically provide cluster-level scheduling or recovery.	Can schedule Pods, restart or replace workloads, scale replicas, and support service discovery.
Useful for packaging and running containers.	Useful for operating containerized applications reliably at scale.


Interview answer: Docker packages and runs containers. Kubernetes orchestrates containerized applications across a cluster and helps maintain the desired state. They solve related but different problems.
Recall before looking it up
Write your own first attempt, then compare it with the verified explanation above.
- Why was Kubernetes created? Write my answer here:
- Who created it, and what inspired it? Write my answer here:
- What does “Kubernetes” mean? Write my answer here:
Verification source: Kubernetes official documentation
3. Kubernetes architecture
A Kubernetes cluster has a Control Plane and one or more Worker Nodes. A Pod is the smallest deployable unit in Kubernetes and can contain one or more closely related containers.
                         ADMIN / DEVELOPER
                    kubectl apply -f pod.yaml
                                |
                                v
+----------------------------------------------------------------+
|                         CONTROL PLANE                           |
|                                                                |
|  +----------------+     +----------------+                     |
|  |  API Server    |<--->|      etcd      |                     |
|  |  Front door    |     | Cluster state  |                     |
|  +-------+--------+     +----------------+                     |
|          ^                                                     |
|          |                                                     |
|  +-------+--------+     +----------------------+               |
|  |   Scheduler    |     | Controller Manager   |               |
|  | Chooses a node |     | Reconciles state     |               |
|  +----------------+     +----------------------+               |
+------------------------------+---------------------------------+
                               |
                     API requests / cluster state
                               |
             +-----------------+------------------+
             |                                    |
             v                                    v
+-----------------------------+    +-----------------------------+
|         WORKER NODE         |    |         WORKER NODE         |
|                             |    |                             |
|  kubelet                    |    |  kubelet                    |
|  kube-proxy (if deployed)   |    |  kube-proxy (if deployed)   |
|  Container runtime          |    |  Container runtime          |
|       |                     |    |       |                     |
|       v                     |    |       v                     |
|  +----------------------+  |    |  +----------------------+   |
|  | Pod                  |  |    |  | Pod                  |   |
|  | Container(s)         |  |    |  | Container(s)         |   |
|  +----------------------+  |    |  +----------------------+   |
+-----------------------------+    +-----------------------------+
Terminology note: “Master node” is older terminology; “Control Plane” is preferred. In a local kind cluster, Kubernetes nodes themselves run as Docker containers. The diagram is a logical view, not a promise that every component is a normal Pod on every cluster. For example, Control Plane components in kind commonly run as static Pods managed by the kubelet.

Control Plane components
Component	Easy explanation	Interview keyword
API Server (kube-apiserver)	The front door of Kubernetes. kubectl sends requests to it; it validates and processes API requests.	API endpoint
etcd	A consistent key-value store that holds Kubernetes cluster data and state.	Cluster state
Scheduler (kube-scheduler)	Selects a suitable node for Pods that do not yet have one assigned.	Pod placement
Controller Manager (kube-controller-manager)	Runs controllers that observe the cluster and work to bring actual state closer to desired state.	Reconciliation loop


Worker Node components
Component	Easy explanation	Interview keyword
kubelet	Node agent that makes sure the Pods assigned to the node are running as specified.	Node agent
kube-proxy	Implements Service networking rules on many Kubernetes clusters. Some cluster networking solutions replace its role.	Service networking
Container runtime	Runs containers. Common runtimes include containerd and CRI-O.	CRI runtime
Pod	Smallest deployable Kubernetes unit; contains one or more containers that share certain resources.	Workload unit


What happens when I run kubectl apply -f pod.yaml?
1. kubectl reads the YAML manifest and sends the request to the API Server.
2. The API Server authenticates and authorizes the request, validates it, and processes the object.
3. The cluster's state is recorded in etcd through the API Server.
4. The Scheduler notices a Pod that has no node assigned and selects a suitable Worker Node.
5. The scheduling decision is recorded through the API Server.
6. The kubelet on the selected node notices the assigned Pod and asks the container runtime to pull images if needed and start the containers.
7. Networking components configure the required connectivity. The kubelet reports status back to the API Server.
8. Controllers continue watching the cluster and reconciling desired state where applicable.
Important: kubectl apply submitting a manifest does not guarantee that the application is immediately ready. Check the Pod's status and events.
What if the API Server goes down?
- New API requests and many management operations fail while the API Server is unavailable.
- Running containers may continue running on their nodes for some time; they do not all instantly stop just because the API Server is down.
- Controllers, scheduling, and other control-plane operations that depend on the API Server are disrupted.
- The exact impact depends on the failure and cluster setup. A highly available cluster may have multiple API Server instances.
What if a Worker Node goes down?
- The Control Plane may detect that the node is unhealthy after a delay.
- Pods on that node can become unavailable.
- If they are managed by a controller such as a Deployment, Kubernetes can schedule replacement Pods on healthy nodes when capacity and constraints allow.
- A bare Pod created without a workload controller is not automatically recreated in the same way as a Deployment-managed Pod.
- Recovery is not instant; detection, scheduling, image pulling, and readiness checks take time.
4. Install and verify the tools
These instructions target Ubuntu/Linux. Use the official installation pages if the operating system or CPU architecture differs.
A. Verify Docker first
kind uses Docker containers as Kubernetes nodes.
docker --version
docker info
If docker info fails, start or repair Docker before creating the cluster. If Docker is installed but the command is unavailable, check the installation and your PATH.
B. Install kubectl
Use the current official instructions for your architecture: Install kubectl on Linux.
A direct download method for Linux AMD64 is:
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
For ARM64 or another architecture, use the matching official download. Do not blindly use the AMD64 binary on a different architecture.

Verify:
kubectl version --client
Expected: client version information is displayed. The exact version will vary.
C. Install kind
Official guide: kind Quick Start.
For Linux AMD64:
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x ./kind
sudo install ./kind /usr/local/bin/kind
Verify:
kind version
5. Create the local Kubernetes cluster
Choice: kind
I choose kind (Kubernetes in Docker) because it is convenient for local Kubernetes learning and uses Docker containers as cluster nodes. It is a good fit for practising cluster creation, kubectl, and Kubernetes architecture on a development machine.
Create the cluster
Make sure Docker is running first.
kind create cluster --name devops-cluster
This creates a local cluster named devops-cluster and normally configures a matching kubectl context.
Verify the cluster:
kind get clusters
kubectl config current-context
kubectl cluster-info
kubectl get nodes
Expected node output will look similar to this (your actual node name, version, and status may differ):
NAME                           STATUS   ROLES           AGE   VERSION
devops-cluster-control-plane   Ready    control-plane   1m    v1.xx.x
The important sign is STATUS = Ready. Do not copy this sample as proof that your own cluster is running; save your real terminal output.
If you already use a different local cluster or context, inspect kubectl config current-context before changing or deleting anything.
6. Explore the cluster
Run these commands one at a time and note what each one tells you.
Cluster and node information
# Show the API endpoints for the cluster
kubectl cluster-info

# List cluster nodes
kubectl get nodes

# Include extra details such as node IP and OS image
kubectl get nodes -o wide

# Replace <node-name> with the name shown by kubectl get nodes
kubectl describe node <node-name>
kubectl describe node provides details such as labels, capacity, allocated resources, conditions, and the Pods assigned to that node.
Namespaces and Pods
# List namespaces
kubectl get namespaces

# List Pods in the current namespace
kubectl get pods

# List Pods across all namespaces
kubectl get pods -A

# List system Pods
kubectl get pods -n kube-system
A namespace groups namespaced resources inside a cluster. kube-system is used for important Kubernetes system components and add-ons.
Match kube-system Pods to architecture
The exact list varies by cluster and version. In a typical kind cluster, you may see components such as these:
Pod/component	What it does
etcd-...	Stores Kubernetes cluster state.
kube-apiserver-...	Exposes the Kubernetes API.
kube-scheduler-...	Selects nodes for unscheduled Pods.
kube-controller-manager-...	Runs controllers that reconcile desired and actual state.
coredns-...	Provides DNS-based service discovery inside the cluster.
kube-proxy-...	Maintains Service networking rules when the cluster uses kube-proxy.
kindnet-... or another network component	Provides Pod networking in a typical kind setup; exact implementation can vary.


Do not expect every cluster to show the exact same list. Some components may be configured differently, and some networking implementations replace kube-proxy.
Useful inspection commands:
kubectl get pods -n kube-system -o wide
kubectl describe pod <pod-name> -n kube-system
Replace <pod-name> with an actual name from your output.
Save the required screenshots
Take genuine screenshots from your own terminal after these commands succeed:
1. kubectl get nodes showing the node in Ready state.
2. kubectl get pods -n kube-system showing the system Pods and their statuses.
Suggested filenames:
day-50-kubectl-get-nodes.png
day-50-kube-system-pods.png
Store them in your Day 50 folder and link them in this Markdown file. Do not use example output as a substitute for a real screenshot.
7. Practise the cluster lifecycle
Warning: Deleting a cluster removes that local cluster and its Kubernetes resources. Do not run the delete command against a cluster containing work you need to keep.

Check current context
# Show the context kubectl is currently using
kubectl config current-context

# List configured contexts
kubectl config get-contexts

# Display kubeconfig settings (review before sharing; it may contain credentials)
kubectl config view
What is kubeconfig?
A kubeconfig file tells kubectl how to connect to Kubernetes clusters. It can contain cluster API endpoint details, user authentication information, and contexts that combine a cluster, user, and default namespace.
- Default path on Linux/macOS: ~/.kube/config
- kubectl can also use another file through the KUBECONFIG environment variable or the --kubeconfig option.
- Treat kubeconfig contents as sensitive. Do not commit credentials or tokens to GitHub or paste them into public posts.
Delete and recreate the kind cluster
Only do this if you are ready to remove the cluster's current resources.
kind delete cluster --name devops-cluster
kind get clusters

kind create cluster --name devops-cluster
kubectl get nodes
The final command should again show the node as Ready once cluster setup finishes.
8. Troubleshooting checklist
kubectl cannot connect to the server
kind get clusters
kubectl config current-context
kubectl cluster-info
Check that the cluster exists and that kubectl is using the intended context. If necessary, inspect Docker and the cluster creation logs.
kind create cluster fails with a Docker error
docker --version
docker info
docker ps
Make sure Docker is running and your user can access it. On Linux, permission or service configuration may be the cause. Avoid blindly changing permissions; follow the Docker installation guidance for your setup.
Node is NotReady
kubectl get nodes -o wide
kubectl describe node <node-name>
kubectl get pods -A
Read the node conditions and Events. Check whether system Pods are starting, images are pulling, and the container runtime/networking is healthy.
A Pod is not Running
kubectl get pods -A
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -A --sort-by=.metadata.creationTimestamp
Look for image-pull errors, scheduling issues, failed probes, or configuration problems. Replace the placeholders with actual Pod and namespace names.
kubectl or kind command is not found
command -v kubectl
command -v kind
echo "$PATH"
Confirm the binaries were installed and their install directory is on your PATH. Re-open the terminal if needed.
9. Interview revision: quick questions and answers
Q1. What is Kubernetes?
Kubernetes is an open-source platform for orchestrating containerized workloads. It automates tasks such as scheduling, scaling, service discovery, and maintaining desired state.
Q2. Why is Kubernetes needed if we have Docker?
Docker builds and runs containers. Kubernetes coordinates containerized workloads across a cluster and helps manage availability, scaling, and recovery.
Q3. What is a Kubernetes cluster?
A cluster is a set of machines or nodes managed by Kubernetes. It includes the Control Plane and the nodes that run workloads.
Q4. What is the Control Plane?
It manages the cluster. Key components include the API Server, etcd, Scheduler, and Controller Manager.
Q5. What is etcd?
It is the consistent key-value store used to hold Kubernetes cluster data.
Q6. What is the role of the Scheduler?
It chooses an appropriate node for a Pod that has not yet been assigned to a node.
Q7. What does the kubelet do?
It is the node agent that ensures the Pods assigned to its node are running as specified.
Q8. What happens after kubectl apply -f pod.yaml?
The request goes to the API Server, the object is validated and stored, the Scheduler selects a node, and the node's kubelet works with the container runtime to start the Pod. Status is reported back through the API Server.
Q9. What is a namespace?
A way to group namespaced Kubernetes resources within a cluster. default and kube-system are common namespaces.
Q10. What is kubeconfig?
Configuration used by kubectl to identify clusters, credentials, and contexts. Its default Linux path is ~/.kube/config.
Q11. What is kind?
A tool for running local Kubernetes clusters using Docker containers as nodes.
Q12. What is the difference between a Pod and a container?
A container is a running application process packaged with its dependencies. A Pod is Kubernetes' smallest deployable unit and can contain one or more containers that share certain resources.
Q13. Does Kubernetes instantly recover every Pod if a node fails?
No. Detection and recovery take time, and behavior depends on how the workload is managed. A Deployment can replace failed replicas when the cluster has suitable capacity and constraints allow it.
Q14. What does kubectl get pods -A mean?
It lists Pods across all namespaces. -A is short for --all-namespaces.
Q15. What is the difference between kubectl get and kubectl describe?
get provides a concise resource listing or representation. describe provides more detailed information, including conditions and Events where available.
10. My Day 50 completion checklist
- [ ] Wrote my first-recall answers before checking documentation.
- [ ] Understood the Control Plane and Worker Node diagram.
- [ ] Installed kubectl and verified it with kubectl version --client.
- [ ] Installed kind and checked Docker.
- [ ] Created devops-cluster.
- [ ] Verified kubectl get nodes shows Ready.
- [ ] Explored namespaces, all Pods, and kube-system.
- [ ] Understood kubeconfig and checked my current context.
- [ ] Practised deleting and recreating the cluster (only if safe).
- [ ] Saved a real node screenshot.
- [ ] Saved a real kube-system Pod screenshot.
- [ ] Reviewed the interview questions.
My notes
- Tool selected: kind
- Why I selected it: Local Kubernetes practice using Docker containers as nodes.
- Cluster name: devops-cluster
- Current kubectl context: Fill in after running kubectl config current-context
- Node status: Fill in after running kubectl get nodes
- What I learned: Write 2–3 points in my own words
- Issue faced and solution: Write here, or enter “None”
Screenshots
After saving the screenshots in the same directory as this Markdown file, update the paths below if needed.

Screenshot 1: Replace/add the actual kubectl get nodes screenshot.

Screenshot 2: Replace/add the actual kubectl get pods -n kube-system screenshot.
11. Official references
- Kubernetes overview
- Kubernetes components
- Install kubectl on Linux
- kind Quick Start
- kubectl command reference
Day 50 takeaway: Kubernetes accepts the desired state through the API Server, stores cluster data in etcd, schedules Pods onto nodes, and relies on node agents and controllers to keep workloads moving toward the desired state.
