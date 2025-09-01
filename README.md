# Kubernetes To-Do App with NestJS

This project demonstrates a NestJS-based to-do list REST API deployed on a Kubernetes cluster, For getting familliar and learning Kubernetes concepts. The application is containerized with Docker, managed with Kubernetes Deployments for high availability, and exposed via a Service for reliable networking. The project is designed to be extended with configuration management, persistent storage, autoscaling, and monitoring, aligning with production-grade DevOps practices.

## Features

- **Backend**: NestJS REST API with a simple endpoint (to be extended with CRUD operations for to-do items).
- **Kubernetes**:
  - Deployment with 3 replicas for high availability and rolling updates.
  - ClusterIP Service for stable internal access to the NestJS app.
  - ConfigMap for non-sensitive configuration (e.g., port, database URL).
  - Secret for sensitive data (e.g., mock database password).
- **Containerization**: Dockerized NestJS app hosted on Docker Hub (`kamranmiadi/todo-backend:latest`).
- **Planned Features** (to be implemented):
  - MongoDB with Persistent Volume Claim (PVC) for data persistence.
  - Horizontal Pod Autoscaler (HPA) for automatic scaling.
  - Prometheus and Grafana for monitoring and observability.

## Prerequisites

- **Minikube**: For running a local Kubernetes cluster.
- **kubectl**: Kubernetes command-line tool.
- **Docker**: For building and pushing container images.
- **Node.js**: For local development of the NestJS app.
- **Git**: For cloning and managing the repository.

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

3.**Build and Push Docker Image**:

  ```bash
  cd backend
  docker build -t kamranmiadi/todo-backend:latest .
  docker push kamranmiadi/todo-backend:latest
  ```

4.**Deploy Kubernetes Resources**:

   ```bash
   kubectl apply -f k8s/configmap.yaml
   kubectl apply -f k8s/secret.yaml
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

5.**Verify Deployment**:

   ```bash
   kubectl get deployments
   kubectl get pods -l app=todo-backend
   kubectl get services
   kubectl get configmaps
   kubectl get secrets
   ```

- Expect 3 replicas running, a ClusterIP Service, a ConfigMap, and a Secret.

6.**Test the Application**:

  ```bash
  kubectl port-forward svc/todo-backend-service 3000:80
  ```

  In another terminal:

  ```bash
  curl http://localhost:3000
  ```

  Expected response: "Hello from NestJS! DB URL: mongodb://mongodb-service:27017/todo, DB Password: password123" (or your updated response).

7.**Update the Deployment**:
   To deploy a new image version:

   ```bash
   docker build -t kamranmiadi/todo-backend:latest .
   docker push kamranmiadi/todo-backend:latest
   kubectl apply -f k8s/deployment.yaml
   kubectl rollout status deployment/todo-backend-deployment
   ```

- The Deployment performs a rolling update to minimize downtime.

## Kubernetes Concepts Demonstrated

- Deployment: Manages 3 replicas of the NestJS app, ensuring high availability and enabling rolling updates. The imagePullPolicy: Always ensures the latest image is pulled from Docker Hub.
- Service: Provides a stable ClusterIP for accessing the NestJS app, abstracting pod IPs and enabling load balancing across replicas.
- Rolling Updates: Updates to the Docker image are applied without downtime, as Kubernetes gradually replaces old pods with new ones.

### Rolling Updates

The Deployment uses a rolling update strategy to apply changes (e.g., new image or environment variables) without downtime. When the `deployment.yaml` is updated, Kubernetes creates a new ReplicaSet, gradually replacing old pods with new ones while maintaining availability. The `todo-backend-service` ensures continuous access by load-balancing traffic across healthy pods, leveraging the `app: todo-backend` selector.

## Planned Enhancements

- ConfigMaps and Secrets: Manage application configuration (e.g., port, database URL) and sensitive data (e.g., database password).
- Persistent Storage: Deploy MongoDB with a Persistent Volume Claim for data persistence.
- Autoscaling: Implement a Horizontal Pod Autoscaler to scale the app based on CPU usage.
- Monitoring: Add Prometheus and Grafana for observability, with dashboards for CPU, memory, and request metrics.

## Screenshots

- [API Response]: (To be added after testing the updated endpoint)
- [Kubernetes Dashboard]: (To be added after full deployment)

## Contributing

This is a learning project to enhance Kubernetes and DevOps skills. Contributions or suggestions are welcome via pull requests or issues on the GitHub repository.

## Contact

- Kamran Miadi
- Email: <kamy.mia74@gmail.com>
- LinkedIn: linkedin.com/in/kamran-miadi-068392131
- GitHub: <https://github.com/KamranMiadi>
