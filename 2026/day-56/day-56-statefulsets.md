# Day 56 – Kubernetes StatefulSets

## Objective

Understand how Kubernetes StatefulSets manage stateful applications that need stable Pod identities, ordered deployment, stable network identities, and persistent storage.

## Why StatefulSets?

Deployments are ideal for stateless applications such as web servers. Their Pods are interchangeable and typically receive generated names. Stateful applications such as databases often need predictable identities and dedicated storage.

A StatefulSet provides:

- Stable, ordered Pod names such as `web-0`, `web-1`, and `web-2`
- Ordered Pod creation and termination
- Stable network identity through a Headless Service
- Dedicated persistent storage for each Pod through `volumeClaimTemplates`

## Deployment vs StatefulSet

| Feature | Deployment | StatefulSet |
|---|---|---|
| Pod names | Generated names, such as `app-7f6d8-abcde` | Stable ordinal names, such as `web-0` |
| Pod identity | Pods are interchangeable | Each Pod has a stable identity |
| Startup and shutdown | No guaranteed ordinal order | Ordered by default |
| Storage | Often uses shared or separately configured claims | Can create one PVC per Pod with `volumeClaimTemplates` |
| Network identity | Usually accessed through a Service | Stable per-Pod DNS identity with a Headless Service |
| Typical use | Stateless web applications and APIs | Databases, Kafka, and other stateful workloads |

---

## Task 1: Understand the Problem

A Deployment with three replicas creates interchangeable Pods with generated names. When a Pod is deleted, its replacement generally has a different name.

This works well for stateless web applications, but stateful cluster members may need predictable identities to discover peers and associate data with the correct replica.

**Verification:** Record the Deployment Pod names before and after deleting one Pod.

**Expected observation:** The replacement Pod has a different generated name.

## Task 2: Create a Headless Service

A Headless Service uses `clusterIP: None`. Instead of providing one virtual ClusterIP for load balancing, it supports DNS records for individual endpoints.

StatefulSets use this Service to establish predictable network identities for their Pods.

**Verification command:**

```bash
kubectl get svc
