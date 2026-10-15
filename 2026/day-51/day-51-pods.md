
# Day 51 – Kubernetes Manifests and Your First Pods

## Objective

Learn how Kubernetes manifests define resources, create Pods using YAML, inspect Pod status, work with labels, and understand imperative and declarative approaches.

By the end of this task, I should be able to:

- Explain the structure of a Kubernetes manifest.
- Write three Pod manifests from scratch.
- Create and inspect Pods using kubectl.
- Understand labels and selectors.
- Validate manifests before applying them.
- Explain why standalone Pods are not automatically recreated after deletion.

---

## 1. What Is a Kubernetes Manifest?

A Kubernetes manifest is a YAML file that describes the desired state of a Kubernetes resource.

Instead of manually creating resources every time, we can define them in YAML and apply them to a cluster.

Example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx
      image: nginx:latest
```

### Four Required Top-Level Fields

| Field | Purpose |
|---|---|
| `apiVersion` | Specifies the API version. For Pods, it is `v1`. |
| `kind` | Specifies the resource type, such as Pod or Deployment. |
| `metadata` | Contains the resource name, labels, and other identity information. |
| `spec` | Defines the desired configuration of the resource. |

### Easy Way to Remember

- `apiVersion` → Which API version?
- `kind` → What resource?
- `metadata` → What is its name and identity?
- `spec` → What should it do?

---

## 2. What Is a Pod?

A Pod is the smallest deployable unit in Kubernetes.

A Pod can contain one or more containers that share certain resources, including network access.

### Why Do We Need Pods?

Docker runs containers, but Kubernetes needs a unit for scheduling and managing application workloads.

Pods provide that unit. Kubernetes schedules Pods onto nodes and manages their lifecycle.

### Important Pod Concepts

- A Pod can contain one or more containers.
- Containers in the same Pod share a network namespace.
- A Pod receives an IP address within the cluster network.
- A standalone Pod is not automatically recreated after deletion.
- Deployments help manage replicas and replace failed or missing Pods.

---

## 3. Task 1: Create Your First Nginx Pod

Create a practice directory:

```bash
mkdir -p ~/kubernetes-practice/day-51
cd ~/kubernetes-practice/day-51
```

Create the file:

```bash
nano nginx-pod.yaml
```

Add the following manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

Save the file in Nano using `Ctrl + O`, press Enter, and exit with `Ctrl + X`.

### Apply the Manifest

```bash
kubectl apply -f nginx-pod.yaml
```

This creates the Pod from the YAML file.

### Verify the Pod

```bash
kubectl get pods
kubectl get pods -o wide
```

Wait until the Pod status becomes `Running`.

### Inspect the Pod

```bash
kubectl describe pod nginx-pod
```

This displays configuration details, conditions, and events that are useful for troubleshooting.

### View Container Logs

```bash
kubectl logs nginx-pod
```

### Test Nginx Inside the Pod

```bash
kubectl exec -it nginx-pod -- /bin/sh
```

Inside the container, run:

```sh
curl localhost:80
exit
```

If `curl` is unavailable in the container, use another suitable debugging method.

Expected result: Nginx should return an HTTP response containing its welcome page HTML.

**Important:** `containerPort: 80` documents the container port; it does not automatically expose Nginx to your laptop or the public internet.

---

## 4. Task 2: Create a BusyBox Pod

BusyBox is a lightweight image that contains basic Linux utilities.

Unlike Nginx, BusyBox does not automatically run a long-lived web server. We will provide a command that prints a message and keeps the container running.

Create the file:

```bash
nano busybox-pod.yaml
```

Manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-pod
  labels:
    app: busybox
    environment: dev
spec:
  containers:
    - name: busybox
      image: busybox:latest
      command: ["sh", "-c", "echo Hello from BusyBox && sleep 3600"]
```

Apply the manifest:

```bash
kubectl apply -f busybox-pod.yaml
```

Verify:

```bash
kubectl get pods
kubectl logs busybox-pod
```

Expected log message:

```text
Hello from BusyBox
```

### Why Do We Use `sleep 3600`?

The `sleep 3600` command keeps the container process running for one hour.

If the main process exits, Kubernetes may restart the container according to the Pod's restart policy. Repeated failures can lead to `CrashLoopBackOff`.

---

## 5. Task 3: Create a Third Custom Pod

Create a third Pod with multiple labels to practise resource organization and filtering.

Create the file:

```bash
nano custom-pod.yaml
```

Manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: custom-pod
  labels:
    app: my-app
    environment: dev
    team: backend
spec:
  containers:
    - name: app-container
      image: nginx:latest
      ports:
        - containerPort: 80
```

Apply the manifest:

```bash
kubectl apply -f custom-pod.yaml
```

Verify:

```bash
kubectl get pods
kubectl get pods --show-labels
```

The third Pod uses three labels:

- `app: my-app`
- `environment: dev`
- `team: backend`

Labels help organize and select resources.

---

## 6. Task 4: Imperative vs Declarative

Kubernetes supports two common ways to create resources.

### Declarative Approach

Write the desired configuration in a YAML file and apply it.

```bash
kubectl apply -f nginx-pod.yaml
```

Advantages:

- Configuration is stored in a file.
- Changes can be reviewed and version-controlled.
- The same configuration can be reused.
- Suitable for repeatable workflows.

### Imperative Approach

Create a resource directly using a command.

```bash
kubectl run redis-pod --image=redis:latest
```

Verify:

```bash
kubectl get pods
```

Advantages:

- Quick to run.
- Useful for experiments and simple tasks.
- No manifest file is required to create the resource.

### Generate YAML Without Creating a Pod

```bash
kubectl run test-pod --image=nginx --dry-run=client -o yaml
```

Save the generated YAML to a file:

```bash
kubectl run test-pod --image=nginx --dry-run=client -o yaml > test-pod.yaml
```

This is useful for creating a starting template that you can customize.

### Comparison

| Declarative | Imperative |
|---|---|
| Uses YAML manifests. | Uses direct commands. |
| Uses `kubectl apply -f`. | Uses commands such as `kubectl run`. |
| Easy to review and maintain. | Quick for temporary experiments. |
| Preferred for repeatable project configuration. | Useful for quick testing and learning. |

---

## 7. Task 5: Validate a Manifest

Validation helps catch errors before creating or updating resources.

### Client-Side Dry Run

```bash
kubectl apply -f nginx-pod.yaml --dry-run=client
```

This checks the manifest locally without persisting the resource.

### Server-Side Dry Run

```bash
kubectl apply -f nginx-pod.yaml --dry-run=server
```

This sends a dry-run request to the API Server for server-side validation and processing without persisting the change.

### Important Note

A dry run does not guarantee that the container will start successfully. Runtime problems such as image-pull failures can still occur during actual deployment.

### Practise an Invalid Manifest

Make a temporary copy:

```bash
cp nginx-pod.yaml invalid-pod.yaml
```

Edit `invalid-pod.yaml` and remove the container's `image` field.

Then try:

```bash
kubectl apply -f invalid-pod.yaml --dry-run=server
```

Kubernetes should report a validation error because the required container image field is missing or invalid for the container specification.

The exact error text can vary by Kubernetes version.

Remove the temporary invalid file after practising:

```bash
rm invalid-pod.yaml
```

---

## 8. Task 6: Pod Labels and Selectors

Labels are key-value pairs attached to Kubernetes resources.

They help organize resources and allow us to select matching Pods.

### Display Labels

```bash
kubectl get pods --show-labels
```

### Filter Pods by Label

```bash
kubectl get pods -l app=nginx
```

This selects Pods with the label `app=nginx`.

```bash
kubectl get pods -l environment=dev
```

This selects Pods with the label `environment=dev`.

Filter the custom Pod by its team label:

```bash
kubectl get pods -l team=backend
```

### Add a Label

```bash
kubectl label pod nginx-pod environment=production
```

Verify:

```bash
kubectl get pods --show-labels
```

### Remove a Label

```bash
kubectl label pod nginx-pod environment-
```

The trailing hyphen removes the `environment` label from the Pod.

**Important:** Labels help organize and select resources; they do not directly change the application's behavior.

---

## 9. Useful Commands for Pod Management

| Command | Purpose |
|---|---|
| `kubectl apply -f nginx-pod.yaml` | Create or update resources from a manifest. |
| `kubectl get pods` | List Pods in the current namespace. |
| `kubectl get pods -o wide` | Show additional details such as node and Pod IP. |
| `kubectl describe pod nginx-pod` | Inspect a Pod and its events. |
| `kubectl logs nginx-pod` | Read container logs. |
| `kubectl exec -it nginx-pod -- /bin/sh` | Open a shell inside the container. |
| `kubectl get pods --show-labels` | Display Pod labels. |
| `kubectl get pods -l app=nginx` | Filter Pods using a label selector. |
| `kubectl get pod nginx-pod -o yaml` | View the Pod's YAML representation. |
| `kubectl delete pod nginx-pod` | Delete the standalone Pod. |

---

## 10. Troubleshooting

### Pod Is in Pending State

```bash
kubectl describe pod nginx-pod
```

Check scheduling events, node capacity, and resource constraints.

### Pod Is in ImagePullBackOff

```bash
kubectl describe pod nginx-pod
```

Check the image name, registry access, network connectivity, and events.

### Pod Is in CrashLoopBackOff

```bash
kubectl logs busybox-pod
kubectl describe pod busybox-pod
```

Check the container's main command, application logs, and restart events.

### Pod Is Not Running

```bash
kubectl get pods -o wide
kubectl get events --sort-by=.metadata.creationTimestamp
```

Inspect the status and recent events before changing the manifest.

---

## 11. Task 7: Clean Up

Delete the Pods created during practice.

### Delete by Name

```bash
kubectl delete pod nginx-pod
kubectl delete pod busybox-pod
kubectl delete pod custom-pod
kubectl delete pod redis-pod
```

If `redis-pod` was not created, Kubernetes will report that it cannot find that Pod.

### Delete Using Manifest Files

Alternatively, delete the Pods defined in your YAML files:

```bash
kubectl delete -f nginx-pod.yaml
kubectl delete -f busybox-pod.yaml
kubectl delete -f custom-pod.yaml
```

Use either the name-based or manifest-based method for each Pod; there is no need to delete the same resource twice.

Verify:

```bash
kubectl get pods
```

### What Happens When a Standalone Pod Is Deleted?

A standalone Pod is deleted and is not automatically recreated by a controller.

A Deployment manages the desired number of replicas and can create replacement Pods when necessary.

This is one reason Deployments are preferred for most production workloads.

---

## 12. Screenshots

Capture genuine screenshots from your own terminal after completing the practical work.

### Screenshot 1: Running Pods

Run:

```bash
kubectl get pods
```

Save the screenshot as:

`day-51-running-pods.png`

Capture it while your practice Pods are running, before cleanup.

### Screenshot 2: Pod Labels

Run:

```bash
kubectl get pods --show-labels
```

Save the screenshot as:

`day-51-pod-labels.png`

Add the screenshots to this directory and update the image paths if necessary.

![Running Pods](day-51-running-pods.png)

*Screenshot 1: Pods running in the Kubernetes cluster.*

![Pod labels](day-51-pod-labels.png)

*Screenshot 2: Pods and their labels.*

---

## 13. Interview Questions and Answers

### Q1. What is a Kubernetes manifest?

A YAML or JSON configuration that describes a Kubernetes resource and its desired state.

### Q2. What are the four required manifest fields?

`apiVersion`, `kind`, `metadata`, and `spec`.

### Q3. What is a Pod?

The smallest deployable unit in Kubernetes, containing one or more containers.

### Q4. What is the difference between a Pod and a container?

A container runs an application process, while a Pod is Kubernetes' deployable unit that can contain one or more containers.

### Q5. What does `kubectl apply -f` do?

It creates or updates resources using the configuration in a file.

### Q6. What is the difference between imperative and declarative approaches?

Imperative commands directly request an action, while declarative manifests describe the desired configuration that Kubernetes should maintain.

### Q7. Why do we use labels?

Labels organize and identify resources and allow selectors to filter matching resources.

### Q8. What is the purpose of `kubectl describe pod`?

It provides detailed information about a Pod, including its configuration, conditions, and events.

### Q9. Why does BusyBox need a long-running command in this exercise?

Without a long-running main process, the container exits after completing its command. Keeping it alive allows us to inspect and practise with the Pod.

### Q10. What happens when a standalone Pod is deleted?

It is deleted and is not automatically recreated because no workload controller manages it.

### Q11. Why use Deployments instead of standalone Pods?

Deployments manage replicas and help replace missing Pods, providing more reliable workload management.

### Q12. What is the purpose of a dry run?

It helps validate or preview a request without persisting the resource change.

---

## 14. Day 51 Completion Checklist

- [ ] Understood the four manifest fields.
- [ ] Created `nginx-pod.yaml`.
- [ ] Created `busybox-pod.yaml`.
- [ ] Created `custom-pod.yaml` with at least three labels.
- [ ] Applied the manifests successfully.
- [ ] Verified Pod status using `kubectl get pods`.
- [ ] Inspected Pod details and logs.
- [ ] Practised imperative and declarative approaches.
- [ ] Generated a manifest using `--dry-run=client -o yaml`.
- [ ] Tested client-side and server-side dry runs.
- [ ] Practised label filtering and modification.
- [ ] Captured screenshots of running Pods and labels.
- [ ] Cleaned up the practice resources.
- [ ] Revised the interview questions.

---

## My Notes

**Cluster used:** kind / minikube

**Pods created:** nginx-pod, busybox-pod, custom-pod

**What I learned:**
- 
- 
- 

**Issue faced and solution:**
- 

**Interview concept I need to revise:**
- 

---

## Official Documentation

- Pods: https://kubernetes.io/docs/concepts/workloads/pods/
- Pod Overview: https://kubernetes.io/docs/concepts/workloads/pods/
- Labels and Selectors: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
- kubectl Reference: https://kubernetes.io/docs/reference/kubectl/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

---

## Day 51 Key Takeaway

Kubernetes manifests describe the desired state of resources, Pods run containerized workloads, and kubectl helps create, inspect, validate, and manage them.

For production applications, Deployments provide replica management and help maintain the desired number of Pods.
