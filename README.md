# Kubernetes To-Do App with NestJS

This project demonstrates a NestJS-based to-do list REST API deployed on a Kubernetes cluster, For getting familliar and learning Kubernetes concepts. The application is containerized with Docker, managed with Kubernetes Deployments for high availability, and exposed via a Service for reliable networking. The project is designed to be extended with configuration management, persistent storage, autoscaling, and monitoring, aligning with production-grade DevOps practices.

## Features

- **Backend**: NestJS REST API with a simple endpoint (to be extended with CRUD operations for to-do items).
- **Kubernetes**:
  - Deployment with 3 replicas for high availability and rolling updates.
  - ClusterIP Service for stable internal access to the NestJS app.
  - ConfigMap for non-sensitive configuration (e.g., port, database URL).
  - Secret for sensitive data (e.g., mock database password).
  - MongoDB Deployment with a Persistent Volume Claim (PVC) for data persistence.
  - MongoDB Service for database connectivity.
  - Horizontal Pod Autoscaler (HPA) for automatic scaling.
  - Prometheus and Grafana for monitoring and observability.
- **Containerization**: Dockerized NestJS app hosted on Docker Hub (`kamranmiadi/todo-backend:latest`).
- **Planned Features** (to be implemented):
   - Elk stack or Grafana Loki for logging.

## Prerequisites

- **Minikube**: For running a local Kubernetes cluster.
- **kubectl**: Kubernetes command-line tool.
- **Docker**: For building and pushing container images.
- **Node.js**: For local development of the NestJS app.
- **Git**: For cloning and managing the repository.
- **Helm**: For installing Grafana and Prometheus with helm charts

## Setup Instructions

1.**Clone the Repository**:

   ```bash
   git clone git@github.com:KamranMiadi/todo-backend.git
   cd todo-backend
   ```

2.**Start Minikube**:

   ```bash
   minikube start
   ```

3.**Build and Deploy the App**:

- Build the Docker image:

  ```bash
  cd backend
  docker build -t kamranmiadi/todo-backend:latest .
  docker push kamranmiadi/todo-backend:latest
  ```

  - Apply Kubernetes manifests:

   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   kubectl apply -f k8s/app-nodeport.yaml #use if you want to use nodeport for exposing the app to the outside of cluster
   kubectl apply -f k8s/hpa.yaml
   kubectl apply -f k8s/mongodb-deployment.yaml
   kubectl apply -f k8s/mongodb-service.yaml
   kubectl apply -f k8s/mongodb-pvc.yaml
   ```

4.**Deploy Prometheus and Grafana**:

- Add Helm repository:

   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   ```

- Install kube-prometheus-stack:

   ```bash
   helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
   ```

- Apply ServiceMonitor:

   ```bash
   kubectl apply -f k8s/prometheus-config.yaml
   ```

5.**Configure Ingress**:
- Apply Ingress:

   ```bash
   kubectl apply -f k8s/monitoring-ingress.yaml
   ```

6.**Verify Deployment**:

   ```bash
   kubectl get deployments
   kubectl get pods -l app=todo-backend
   kubectl get pods -l app=mongodb   kubectl get services
   kubectl get configmaps
   kubectl get secrets
   kubectl get pvc
   kubectl get servicemonitor
   ```

- Expect 3 NestJS replicas, 1 MongoDB pod, ClusterIP Services, a ConfigMap, a Secret, a PVC, and a ServiceMonitor.

7.**Test the Application**:

  ```bash
  kubectl port-forward svc/todo-backend-service 3000:80
  ```

  In another terminal:

  ```bash
   curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Test Todo","description":"Test Description"}'

   curl http://localhost:3000/todos
  ```

  Expected response: "Hello from NestJS!" (or your updated response).

8.**Update the Deployment**:
   To deploy a new image version:

   ```bash
   docker build -t kamranmiadi/todo-backend:latest .
   docker push kamranmiadi/todo-backend:latest
   kubectl apply -f k8s/deployment.yaml
   kubectl rollout status deployment/todo-backend-deployment
   ```

- The Deployment performs a rolling update to minimize downtime.

## Accessing the Application and Monitoring

- NestJS App:
      -Via Ingress: `<http://todo.154.91.170.176.nip.io>`
      -Via NodePort: `<http://154.91.170.176:30000>`

   Example: `curl <http://todo.154.91.170.176.nip.io/todos>`

- Prometheus:
      -Via Ingress: `<http://prometheus.154.91.170.176.nip.io/query>`
      -Via NodePort: `<http://154.91.170.176:30090>`

- Grafana:
      -Via Ingress: <http://grafana.154.91.170.176.nip.io/login>
      -Via NodePort: <http://154.91.170.176:30080>
      -Credentials: `admin/prom-operator`

   > You may need to use port forwarding to access the urls.
   > e.g. : `kubectl port-forward svc/prometheus-grafana 80:80 --address 0.0.0.0`

## Verifying Monitoring

- Metrics Endpoint:

   ```bash
   curl http://todo.154.91.170.176.nip.io/metrics
   ```

- Expected output:

   ```text
   # HELP http_requests_total Total number of HTTP requests
   # TYPE http_requests_total counter
   http_requests_total{method="GET",path="/todos",status="200"} 10
   ```

- ServiceMonitor:

   ```bash
   kubectl get servicemonitor -n default todo-backend-monitor
   ```

   > Note: Configured with `release: prometheus` label for discovery by `kube-prometheus-stack`.

- Prometheus Targets:

   Open <http://prometheus.154.91.170.176.nip.io>
   Go to Status > Targets and verify `default/todo-backend-service/80` is `UP`.
   Query `http_requests_total_custom` to see app metrics.

Grafana Dashboard:

Log in to <http://grafana.154.91.170.176.nip.io/login>.

## Testing Scaling and Persistence

- **Horizontal Pod Autoscaler (HPA)**:

   ```bash
   kubectl get hpa
   kubectl get pods -l app=todo-backend
   ```

  - Simulate load:

   ```bash
   kubectl run -i --tty --rm load-test --image=alpine -- sh
   apk add curl
   while true; do curl http://todo-backend-service.default/stress; sleep 0.1; done
   ```

- **MongoDB Persistence**:

   ```bash
   kubectl delete pod -l app=mongodb
   curl http://todo.154.91.170.176.nip.io/todos
   ```

## Kubernetes Concepts Demonstrated

- **Deployment**: Manages 3 replicas of the NestJS app, ensuring high availability and enabling rolling updates. The imagePullPolicy: Always ensures the latest image is pulled from Docker Hub.
- **Service**: Provides a stable ClusterIP for accessing the NestJS app, abstracting pod IPs and enabling load balancing across replicas.
- **ConfigMap**: Stores non-sensitive configuration (e.g., APP_PORT, DB_URL) for easy updates.
- **Secret**: Securely stores sensitive data (e.g., database password) in base64-encoded format.
- **Persistent Volume Claim**: Ensures MongoDB data persists across pod restarts.
- **Rolling Updates**: Updates to the Docker image are applied without downtime, as Kubernetes gradually replaces old pods with new ones.
- **Networking**: NGINX Ingress for domain-based access (`*.154.91.170.176.nip.io`).
- **Scaling**: HPA for automatic pod scaling based on CPU.
- **Observability**: Prometheus and Grafana for monitoring, with a fixed /metrics endpoint and ServiceMonitor.

> **Rolling Updates**:
> The Deployment uses a rolling update strategy to apply changes (e.g., new image or environment variables) without downtime. When the > `deployment.yaml` is updated, Kubernetes creates a new ReplicaSet, gradually replacing old pods with new ones while maintaining
> availability. The `todo-backend-service` ensures continuous access by load-balancing traffic across healthy pods, leveraging the`app: > todo-backend` selector.

## Planned Enhancements

- Logging: Add **ELK stack** or **Grafana Loki** for logging .

## Contributing

This is a learning project to enhance Kubernetes and DevOps skills. Contributions or suggestions are welcome via pull requests or issues on the GitHub repository.

## Contact

- Kamran Miadi
- Email: <kamy.mia74@gmail.com>
- LinkedIn: linkedin.com/in/kamran-miadi-068392131
- GitHub: <https://github.com/KamranMiadi>
