# Day 53 – Kubernetes Services

## 🎯 Objective

Understand how Kubernetes Services provide stable network access to Pods, discover applications through DNS, and expose applications using ClusterIP, NodePort, and LoadBalancer.

## 1. Why Do We Need Kubernetes Services?

### The Problem with Pods

In Kubernetes, Pods are temporary (ephemeral). They can be created, deleted, restarted, or replaced whenever required.

This creates two main problems:

- **Changing IP addresses:** A Pod can receive a new IP address when it is replaced.
- **Multiple replicas:** A Deployment may run multiple Pods, so clients need a reliable way to reach them without tracking individual Pod IPs.

### The Solution: Kubernetes Service

A Service provides a stable network endpoint for accessing a group of Pods.

Its main benefits are:

- Provides a stable IP address and DNS name.
- Routes traffic to matching Pods using label selectors.
- Distributes traffic across available backend Pods.
- Automatically updates its backend endpoints as Pods change.

### Real-World Example

Imagine an online shopping application running three backend Pods.

Instead of remembering three different IP addresses, such as:

- Pod 1: `10.244.0.5`
- Pod 2: `10.244.0.6`
- Pod 3: `10.244.0.7`

A client can simply access:

`http://web-app-clusterip`

Kubernetes routes the request through the Service to an appropriate backend Pod.

**Remember:** A Deployment manages Pods, while a Service provides a stable way to communicate with those Pods.

### How It Works

Client → Service → Available Backend Pod

The Service selects Pods using labels, such as `app: web-app`.

---

## 2. Task 1: Deploy the Application

Create `app-deployment.yaml`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
```

Apply the configuration:

```bash
kubectl apply -f app-deployment.yaml
kubectl get deployments
kubectl get pods -o wide
```

### What Did We Create?

- A Deployment named `web-app`.
- Three replicas of an Nginx application.
- Each Pod listens on container port 80.
- All Pods have the label `app: web-app`.

The label is important because our Services will use it to find the correct Pods.

**Verification:** Confirm that all three Pods reach the `Running` state and note their IP addresses.

---

## 3. Task 2: ClusterIP Service

### What Is ClusterIP?

ClusterIP is the default Kubernetes Service type. It exposes an application through an internal IP address that is normally accessible only from within the cluster.

It is commonly used for communication between application components.

### Create `clusterip-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-clusterip
spec:
  type: ClusterIP
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
```

Apply and inspect:

```bash
kubectl apply -f clusterip-service.yaml
kubectl get services
kubectl describe service web-app-clusterip
kubectl get endpoints web-app-clusterip
```

### Understanding the Important Fields

- `type: ClusterIP` — exposes the Service internally.
- `selector: app: web-app` — selects Pods carrying this label.
- `port: 80` — the port on which the Service accepts traffic.
- `targetPort: 80` — the destination port on the selected Pods.

### Test Communication from Inside the Cluster

Run a temporary client Pod:

```bash
kubectl run test-client \
  --image=busybox:latest \
  --rm -it \
  --restart=Never \
  -- sh
```

Inside the Pod, run:

```sh
wget -qO- http://web-app-clusterip
```

You should see the Nginx welcome page. Then exit:

```sh
exit
```

### Simple Example

Think of ClusterIP as an internal office extension. Employees inside the organization can use it to contact a department, but people outside cannot directly use that internal extension.

**Key takeaway:** ClusterIP provides internal access without requiring clients to know individual Pod IP addresses.

---

## 4. Task 3: Kubernetes DNS and Service Discovery

Kubernetes includes a DNS system, usually powered by CoreDNS. It automatically creates DNS records for Services.

A Service in the `default` namespace can be accessed using its short name:

`web-app-clusterip`

Its fully qualified DNS name is:

`web-app-clusterip.default.svc.cluster.local`

The general format is:

`<service-name>.<namespace>.svc.cluster.local`

### Test DNS Resolution

Start a temporary Pod:

```bash
kubectl run dns-test \
  --image=busybox:latest \
  --rm -it \
  --restart=Never \
  -- sh
```

Inside the Pod:

```sh
wget -qO- http://web-app-clusterip

wget -qO- http://web-app-clusterip.default.svc.cluster.local

nslookup web-app-clusterip
```

Then exit:

```sh
exit
```

Check the Service IP separately:

```bash
kubectl get service web-app-clusterip
```

The IP returned by `nslookup` should match the Service's ClusterIP.

### How DNS Works

1. A client Pod requests `web-app-clusterip`.
2. Kubernetes DNS resolves the Service name to its ClusterIP.
3. The request reaches the Service.
4. The Service routes traffic to a suitable backend Pod.
5. The application responds to the client.

### Real-World Example

Imagine saving a website as a contact name instead of remembering its IP address. DNS allows applications to use a meaningful Service name rather than a changing Pod IP.

**Important:** DNS resolves the Service name to the Service's ClusterIP for a typical ClusterIP Service. The Service then routes the traffic to a backend Pod.

---

## 5. Task 4: NodePort Service

### What Is NodePort?

NodePort exposes a Service on a designated port on each Kubernetes node.

It allows clients to access the application through:

`<NodeIP>:<NodePort>`

The default NodePort allocation range is `30000–32767`.

### Create `nodeport-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

Apply and verify:

```bash
kubectl apply -f nodeport-service.yaml
kubectl get services
kubectl describe service web-app-nodeport
```

### Traffic Flow

Client → Node IP on port 30080 → Service → Pod on port 80

### Test NodePort Access

The correct access method depends on your local Kubernetes environment.

**For Minikube:**

```bash
minikube service web-app-nodeport --url
```

Open the returned URL or test it with `curl`.

**For Docker Desktop:**

If the node port is exposed to the host by your cluster configuration, test:

```bash
curl http://localhost:30080
```

**For Kind:**

Check the node details:

```bash
kubectl get nodes -o wide
```

With Kind, a NodePort is not automatically accessible through the host machine in every setup. Host access may require port mappings in the Kind cluster configuration or another supported access method.

### Real-World Example

Think of NodePort as a reception desk available at a specific entrance of a building. Visitors know the building's address and the designated entrance port to reach the application.

**Key takeaway:** NodePort offers node-level access, but the node IP must be reachable and the environment must permit the connection.

---

## 6. Task 5: LoadBalancer Service

### What Is LoadBalancer?

A LoadBalancer Service exposes an application through an external load balancer when the Kubernetes environment supports provisioning one.

In cloud environments, an integration with a cloud provider can create a load balancer and assign an external IP address or hostname.

### Create `loadbalancer-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
```

Apply and inspect:

```bash
kubectl apply -f loadbalancer-service.yaml
kubectl get services
kubectl describe service web-app-loadbalancer
```

### What Happens on a Local Cluster?

In Kind or another local cluster without a configured load balancer implementation, the `EXTERNAL-IP` may remain:

`<pending>`

This is expected because Kubernetes does not automatically create a real cloud load balancer on every local installation.

With Minikube, you can try:

```bash
minikube tunnel
```

Keep the tunnel process running in a separate terminal, then check:

```bash
kubectl get services
```

The exact result depends on the cluster setup.

### Real-World Example

Imagine a public entrance to a shopping mall. Customers access the public entrance, and the system directs them to an available service behind it.

A cloud load balancer plays a similar role by providing an external entry point and distributing incoming traffic.

**Key takeaway:** LoadBalancer is commonly used to expose applications externally in cloud environments, but a working external address requires suitable infrastructure and configuration.

---

## 7. Task 6: Compare the Three Service Types

Run:

```bash
kubectl get services -o wide
```

| Feature | ClusterIP | NodePort | LoadBalancer |
|---|---|---|---|
| Access | Inside the cluster | Through a reachable node IP and port | Through an external load balancer |
| Stable Service IP | Yes | Yes | Yes |
| External access | Not directly by default | Possible when network access is configured | Designed for external access |
| Typical use | Internal services | Development and testing | External application traffic in supported environments |
| Example | Internal API | `NodeIP:30080` | Cloud load balancer address |

### How They Relate

In the standard Kubernetes Service implementation:

- ClusterIP provides an internal Service endpoint.
- NodePort builds on the Service endpoint by exposing a port on nodes.
- LoadBalancer typically builds on the ClusterIP and NodePort mechanisms.

For a LoadBalancer Service, inspect:

```bash
kubectl describe service web-app-loadbalancer
```

You can also check the assigned ports:

```bash
kubectl get service web-app-loadbalancer -o wide
```

A typical LoadBalancer Service has a ClusterIP and a NodePort assigned. However, some cluster configurations can disable NodePort allocation, so it is not an absolute rule for every environment.

---

## 8. Task 7: Understanding Endpoints

### What Are Endpoints?

Endpoints represent the network addresses of backend Pods associated with a Service.

For example, the Service `web-app-clusterip` may route traffic to three Nginx Pods:

- `10.244.0.5:80`
- `10.244.0.6:80`
- `10.244.0.7:80`

These are illustrative addresses; your actual Pod IPs will differ.

Kubernetes updates the backend addresses as matching Pods become available or are removed.

Modern Kubernetes also uses EndpointSlices to represent backend endpoints efficiently.

### Inspect Endpoints

```bash
kubectl get endpoints
kubectl get endpoints web-app-clusterip
kubectl describe endpoints web-app-clusterip
```

To inspect EndpointSlices:

```bash
kubectl get endpointslices \
  -l kubernetes.io/service-name=web-app-clusterip
```

### Why Are Endpoints Important?

- They help confirm that the Service has backend Pods.
- They show the addresses and ports to which traffic can be directed.
- They help diagnose Services that are not responding.
- They reflect the Pods selected by the Service and their readiness.

If a Service has no usable endpoints, check its selector and the Pod labels:

```bash
kubectl get pods --show-labels
kubectl describe service web-app-clusterip
kubectl get endpoints web-app-clusterip
```

**Important:** A Service with a selector normally discovers its backend Pods automatically. If the selector does not match the Pod labels, the Service will not find those Pods.

---

## 9. Task 8: Clean Up Resources

After completing the tests, remove the resources created for this exercise.

```bash
kubectl delete -f app-deployment.yaml
kubectl delete -f clusterip-service.yaml
kubectl delete -f nodeport-service.yaml
kubectl delete -f loadbalancer-service.yaml
```

Verify the cleanup:

```bash
kubectl get pods
kubectl get deployments
kubectl get services
```

If these resources were created in the `default` namespace and no other user resources are present, the built-in `kubernetes` Service should remain.

---

## 10. Troubleshooting Notes

### Problem: Service has no endpoints

**Possible reason:** The Service selector does not match the Pod labels.

**Solution:**

```bash
kubectl get pods --show-labels
kubectl describe service web-app-clusterip
kubectl get endpoints web-app-clusterip
```

### Problem: ClusterIP cannot be accessed from my laptop

**Reason:** ClusterIP is intended for internal cluster access.

**Solution:** Test from a temporary Pod, or use an appropriate port-forwarding or external access method.

### Problem: NodePort does not work

**Possible reasons:**

- The node IP is not reachable.
- The local cluster does not expose the port to the host.
- The application Pods are not ready.
- The Service selector does not match the Pods.

**Solution:** Inspect the Service, endpoints, Pods, and cluster networking configuration.

### Problem: LoadBalancer external IP remains pending

**Reason:** No supported load balancer implementation is provisioning an external address.

**Solution:** Use the appropriate local-cluster mechanism or configure a supported cloud load balancer implementation.

---

## 11. Key Learnings

Today, I learned:

- Why Pods need Services for stable network communication.
- How Deployments manage application replicas.
- How ClusterIP enables internal communication.
- How NodePort exposes an application through a node port.
- How LoadBalancer exposes applications through supported external load balancers.
- How Kubernetes DNS provides Service discovery.
- How to inspect Endpoints and troubleshoot Service connectivity.
- How to verify and clean up Kubernetes resources.

## 12. Evidence and Screenshots

Add your actual screenshots below when documenting your completed practical work.

1. **Deployment and Pods:** Output of `kubectl get pods -o wide`.
2. **ClusterIP:** Output of `kubectl get services` and the successful Nginx response from the test Pod.
3. **DNS:** Output of `nslookup web-app-clusterip` matching the Service ClusterIP.
4. **NodePort:** Terminal or browser output showing the Nginx welcome page.
5. **LoadBalancer:** Output showing the Service type and external IP status.
6. **Endpoints:** Output of `kubectl get endpoints web-app-clusterip`.
7. **Cleanup:** Output of `kubectl get pods` and `kubectl get services` after cleanup.

## Conclusion

Kubernetes Services solve the problem of changing Pod IP addresses by providing stable network endpoints. ClusterIP supports internal communication, NodePort provides node-level access, and LoadBalancer enables external access through a supported load balancer.

Understanding Services is an essential step toward building and operating reliable Kubernetes applications.

#90DaysOfDevOps #DevOpsKaJosh #TrainWithShubham
