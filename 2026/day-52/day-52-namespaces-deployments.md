
# Day 52 – Kubernetes Namespaces and Deployments

## Overview

**Day:** 52 of #90DaysOfDevOps  
**Topic:** Kubernetes Namespaces and Deployments  
**Learning Goal:** Organize Kubernetes resources using Namespaces and manage applications using Deployments, replicas, scaling, self-healing, rolling updates, and rollbacks.

## Objectives

- Understand Kubernetes default and custom Namespaces.
- Create and use `dev`, `staging`, and `production` Namespaces.
- Deploy applications using Kubernetes Deployments.
- Understand how Deployments maintain the desired number of replicas.
- Test self-healing by deleting a Pod managed by a Deployment.
- Scale Deployments up and down.
- Perform rolling updates and rollbacks.
- Practice Kubernetes resource management using `kubectl`.

---

## Task 1: Explore Default Namespaces

Kubernetes uses Namespaces to organize resources inside a cluster. Every Kubernetes cluster comes with several default Namespaces.

### List Namespaces

```bash
kubectl get namespaces
```

### Important Default Namespaces

| Namespace | Purpose |
|---|---|
| `default` | Holds resources when no Namespace is specified. |
| `kube-system` | Contains Kubernetes system components. |
| `kube-public` | Intended for publicly readable cluster information. |
| `kube-node-lease` | Contains Lease objects used for node heartbeat tracking. |

### Check System Pods

```bash
kubectl get pods -n kube-system
```

This command lists Pods in the `kube-system` Namespace. Depending on the cluster setup, these may include CoreDNS, networking components, and other Kubernetes system services.

**Observation:** The number and names of system Pods depend on the Kubernetes distribution and cluster configuration. I inspected the Pods running in `kube-system` without modifying or deleting system resources.

---

## Task 2: Create and Use Custom Namespaces

Custom Namespaces help organize resources by environment, team, or application.

I created separate Namespaces for development and staging.

### Create Namespaces

```bash
kubectl create namespace dev
kubectl create namespace staging
```

Verify the Namespaces:

```bash
kubectl get namespaces
```

### Create a Namespace Using YAML

Create a file named `namespace.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
```

Apply the manifest:

```bash
kubectl apply -f namespace.yaml
```

Verify:

```bash
kubectl get namespaces
```

### Run Pods in Different Namespaces

Create an Nginx Pod in the development Namespace:

```bash
kubectl run nginx-dev --image=nginx:latest -n dev
```

Create an Nginx Pod in the staging Namespace:

```bash
kubectl run nginx-staging --image=nginx:latest -n staging
```

### List Pods

```bash
# Pods in the default Namespace
kubectl get pods

# Pods in the development Namespace
kubectl get pods -n dev

# Pods in the staging Namespace
kubectl get pods -n staging

# Pods across all Namespaces
kubectl get pods -A
```

**Key Learning:** Running `kubectl get pods` without `-n` or `-A` shows Pods only in the current Namespace, which is `default` unless the current context specifies otherwise.

The `-n` flag targets a specific Namespace, while `-A` lists resources across all Namespaces.

---

## Task 3: Create the First Deployment

A Kubernetes Deployment manages an application by maintaining the desired number of Pod replicas. If a managed Pod is deleted or fails, Kubernetes works to replace it.

### Create the Deployment Manifest

Create a file named `nginx-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: dev
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.24
          ports:
            - containerPort: 80
```

### Explanation of the Manifest

| Field | Explanation |
|---|---|
| `apiVersion: apps/v1` | API version used for Deployments. |
| `kind: Deployment` | Defines the resource as a Deployment. |
| `metadata.name` | Sets the Deployment name. |
| `metadata.namespace` | Places the Deployment in the `dev` Namespace. |
| `metadata.labels` | Adds identifying labels to the Deployment. |
| `spec.replicas: 3` | Specifies the desired number of Pod replicas. |
| `selector.matchLabels` | Identifies the Pods managed by the Deployment. |
| `template` | Defines the Pod blueprint used to create replicas. |
| `containers` | Lists the containers that run inside each Pod. |
| `image: nginx:1.24` | Specifies the Nginx container image and version. |
| `containerPort: 80` | Documents the container port used by Nginx. It does not expose the application externally by itself. |

**Important:** `spec.selector.matchLabels` must match the labels under `spec.template.metadata.labels`. Otherwise, the Deployment manifest will be rejected or will not correctly identify its intended Pods.

### Apply the Deployment

```bash
kubectl apply -f nginx-deployment.yaml
```

Check the Deployment:

```bash
kubectl get deployments -n dev
kubectl get replicasets -n dev
kubectl get pods -n dev
```

### Understand Deployment Status

| Column | Meaning |
|---|---|
| `READY` | Number of ready replicas compared with the desired number. |
| `UP-TO-DATE` | Number of replicas updated to match the latest Deployment specification. |
| `AVAILABLE` | Number of replicas available to serve the application according to Kubernetes availability rules. |

For a healthy Deployment with three replicas, the output will commonly show `3/3` under READY, `3` under UP-TO-DATE, and `3` under AVAILABLE.

---

## Task 4: Test Self-Healing

One of the main advantages of Deployments is that they maintain the desired number of replicas.

### List the Pods

```bash
kubectl get pods -n dev
```

Copy the name of one Pod managed by `nginx-deployment`.

### Delete One Managed Pod

Replace `<pod-name>` with the actual Pod name:

```bash
kubectl delete pod <pod-name> -n dev
```

Immediately check the Pods again:

```bash
kubectl get pods -n dev
```

Watch the replacement process:

```bash
kubectl get pods -n dev -w
```

Press `Ctrl+C` to stop watching.

### What Happens?

The Deployment manages a ReplicaSet, and the ReplicaSet works to maintain the desired replica count.

When one Pod is deleted:

1. Kubernetes detects that the available Pod count no longer matches the desired state.
2. The ReplicaSet controller requests a replacement Pod.
3. The replacement Pod receives a new name.
4. Kubernetes attempts to bring the cluster back to three replicas.

**Key Learning:** A replacement Pod normally has a different name because Kubernetes creates a new Pod object rather than restoring the deleted Pod object.

---

## Task 5: Scale the Deployment

Scaling changes the desired number of Pod replicas.

### Scale Up to Five Replicas

```bash
kubectl scale deployment nginx-deployment --replicas=5 -n dev
```

Verify:

```bash
kubectl get deployments -n dev
kubectl get pods -n dev
```

Kubernetes creates additional Pods until it reaches the desired count, assuming the cluster has sufficient resources and the Pods can start successfully.

### Scale Down to Two Replicas

```bash
kubectl scale deployment nginx-deployment --replicas=2 -n dev
```

Verify:

```bash
kubectl get deployments -n dev
kubectl get pods -n dev
```

When scaling down from five replicas to two, Kubernetes terminates three excess Pods so the Deployment can converge to the requested count.

### Imperative Scaling

Imperative scaling changes the replica count directly through a command:

```bash
kubectl scale deployment nginx-deployment --replicas=4 -n dev
```

### Declarative Scaling

Declarative scaling updates the desired state in the YAML manifest.

Change:

```yaml
spec:
  replicas: 4
```

Apply the updated manifest:

```bash
kubectl apply -f nginx-deployment.yaml
```

**Important:** The manifest specifies `replicas: 3` initially. If I scale the Deployment imperatively to five and later apply that unchanged manifest, the desired replica count will return to three. To keep four replicas declaratively, I must update the YAML to `replicas: 4`.

---

## Task 6: Perform a Rolling Update

A rolling update lets Kubernetes replace old Pods with new ones gradually when the Deployment's Pod template changes.

### Update the Nginx Image

```bash
kubectl set image deployment/nginx-deployment nginx=nginx:1.25 -n dev
```

Check the rollout:

```bash
kubectl rollout status deployment/nginx-deployment -n dev
```

Inspect the Deployment:

```bash
kubectl describe deployment nginx-deployment -n dev
```

Verify the container image:

```bash
kubectl describe deployment nginx-deployment -n dev | grep Image
```

### How Rolling Updates Work

1. The Deployment detects a change in the Pod template.
2. Kubernetes creates a new ReplicaSet for the updated template.
3. New Pods are started using the updated image.
4. Kubernetes gradually replaces old Pods according to the Deployment's rolling-update strategy.
5. The rollout completes when the desired updated replicas are available.

**Important:** Rolling updates are designed to reduce downtime, but zero downtime is not guaranteed automatically. Application health, readiness probes, replica availability, and update strategy all matter. This exercise does not configure a Service or readiness probe.

### Check Rollout History

```bash
kubectl rollout history deployment/nginx-deployment -n dev
```

This command displays the available Deployment revisions.

### Roll Back to the Previous Revision

```bash
kubectl rollout undo deployment/nginx-deployment -n dev
```

Wait for the rollback:

```bash
kubectl rollout status deployment/nginx-deployment -n dev
```

Verify the image:

```bash
kubectl describe deployment nginx-deployment -n dev | grep Image
```

If the previous revision used `nginx:1.24`, the rollback should restore that image, provided it was the previous recorded Pod-template revision.

**Key Learning:** A rollback restores the previous Deployment revision. It does not necessarily restore a particular image version unless that version belongs to the previous revision.

---

## Task 7: Clean Up Resources

After completing the practice, remove the resources created during this exercise.

### Delete the Deployment

```bash
kubectl delete deployment nginx-deployment -n dev
```

### Delete the Standalone Pods

```bash
kubectl delete pod nginx-dev -n dev
kubectl delete pod nginx-staging -n staging
```

### Delete the Custom Namespaces

```bash
kubectl delete namespace dev staging production
```

**Warning:** Deleting a Namespace deletes the namespaced resources inside it. Always verify the target Namespace before deleting it, especially in production.

### Verify Cleanup

```bash
kubectl get namespaces
kubectl get pods -A
kubectl get deployments -A
```

The custom Namespaces should no longer appear, and their namespaced resources should be removed. System resources and unrelated workloads will remain.

---

## Standalone Pod vs Deployment

| Feature | Standalone Pod | Deployment-managed Pod |
|---|---|---|
| Creation | Created directly as a Pod | Created through a Deployment and ReplicaSet |
| Self-healing after Pod deletion | No controller recreates that standalone Pod automatically | ReplicaSet works to create a replacement |
| Replica management | No built-in replica management | Desired replica count is maintained |
| Scaling | Requires creating or deleting Pods manually | Supports scaling through replica changes |
| Rolling updates | No Deployment-managed rollout | Supports controlled Pod-template updates |
| Rollback | No Deployment revision history | Supports rollout history and rollback |

---

## Important Kubernetes Commands

| Command | Purpose |
|---|---|
| `kubectl get namespaces` | Lists Namespaces. |
| `kubectl get pods -A` | Lists Pods across all Namespaces. |
| `kubectl get pods -n dev` | Lists Pods in `dev`. |
| `kubectl apply -f <file>.yaml` | Creates or updates resources from a manifest. |
| `kubectl get deployments -n dev` | Lists Deployments in `dev`. |
| `kubectl get replicasets -n dev` | Lists ReplicaSets in `dev`. |
| `kubectl describe deployment <name> -n dev` | Shows Deployment details and events. |
| `kubectl scale deployment <name> --replicas=N -n dev` | Changes the desired replica count. |
| `kubectl set image deployment/<name> <container>=<image> -n dev` | Updates a container image. |
| `kubectl rollout status deployment/<name> -n dev` | Checks rollout progress. |
| `kubectl rollout history deployment/<name> -n dev` | Shows Deployment revision history. |
| `kubectl rollout undo deployment/<name> -n dev` | Rolls back to the previous revision. |
| `kubectl delete namespace <name>` | Deletes a Namespace and its namespaced resources. |

---

## Screenshots and Evidence

Add screenshots from your own Kubernetes cluster to demonstrate the completed work.

Suggested screenshots:

1. **Namespaces:** Output of `kubectl get namespaces` showing `dev`, `staging`, and `production`.
2. **Pods Across Namespaces:** Output of `kubectl get pods -A`.
3. **Deployment Status:** Output of `kubectl get deployments -n dev`.
4. **Replica Pods:** Output of `kubectl get pods -n dev` showing multiple replicas.
5. **Self-Healing:** Terminal output showing a deleted Pod being replaced by a Pod with a new name.
6. **Scaling:** Deployment and Pod output after scaling up and down.
7. **Rolling Update:** Output of `kubectl rollout status deployment/nginx-deployment -n dev`.
8. **Rollback:** Output of `kubectl describe deployment nginx-deployment -n dev | grep Image`.

Suggested documentation structure:

```text
2026/
└── day-52/
    ├── day-52-namespaces-deployments.md
    ├── namespace.yaml
    ├── nginx-deployment.yaml
    └── screenshots/
        ├── namespaces.png
        ├── pods-across-namespaces.png
        ├── deployment-status.png
        ├── scaling.png
        └── rollout-rollback.png
```

Only include screenshots that you have actually captured.

---

## Key Takeaways

- Namespaces organize resources within a Kubernetes cluster.
- `kubectl get pods` shows Pods in the current Namespace, while `kubectl get pods -A` shows Pods across all Namespaces.
- Deployments manage applications through ReplicaSets and Pod templates.
- ReplicaSets work to maintain the desired number of Pods.
- Scaling changes the desired number of replicas.
- Rolling updates gradually replace Pods after a Pod-template change.
- Rollbacks restore a previous Deployment revision.
- Deleting a Namespace removes its namespaced resources, so cleanup commands must be used carefully.

## Interview Questions

**1. What is a Kubernetes Namespace?**

A Namespace logically organizes namespaced Kubernetes resources within a cluster. It helps separate environments, teams, or applications.

**2. What is a Deployment?**

A Deployment manages application rollouts and replica counts by controlling ReplicaSets, which in turn manage Pods.

**3. What is a ReplicaSet?**

A ReplicaSet ensures that a specified number of matching Pod replicas exist.

**4. What happens if a Pod managed by a Deployment is deleted?**

The ReplicaSet controller works to create a replacement Pod and restore the desired replica count.

**5. What is the difference between imperative and declarative scaling?**

Imperative scaling uses a command such as `kubectl scale`. Declarative scaling updates the desired replica count in a YAML manifest and applies it.

**6. What is a rolling update?**

A rolling update gradually replaces old Pods with new Pods when the Deployment's Pod template changes.

**7. What is a rollback?**

A rollback returns a Deployment to a previous recorded revision.

**8. Does `containerPort: 80` expose Nginx to the internet?**

No. It documents the container port. External or cluster access generally requires an appropriate Service, Ingress, or another networking configuration.

**9. Why must `selector.matchLabels` match the Pod template labels?**

The selector identifies the Pods managed by the Deployment. Matching labels connect the Deployment to the intended Pod replicas.

**10. What happens when a Namespace is deleted?**

Kubernetes deletes namespaced resources inside that Namespace. Cluster-scoped resources are not deleted merely because a Namespace is removed.

---

## Final Summary

On Day 52 of my #90DaysOfDevOps journey, I practiced Kubernetes Namespaces and Deployments.

I explored built-in Namespaces, created custom environments, deployed multiple Nginx replicas, tested self-healing, scaled workloads, performed a rolling update, and practiced rollback.

This hands-on session helped me understand how Kubernetes maintains the desired state of applications and makes workload management more reliable.

**Next Step:** Commit the documentation and YAML manifests to the `2026/day-52/` directory in my 90DaysOfDevOps repository.

#90DaysOfDevOps #DevOpsKaJosh #TrainWithShubham #Kubernetes #DevOps #CloudComputing #LearningInPublic
