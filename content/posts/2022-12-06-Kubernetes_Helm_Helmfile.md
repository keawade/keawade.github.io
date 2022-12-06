---
title: "Practical Kubernetes, Helm, and Helmfile"
date: 2022-12-06
slug: "2022-12-06-Practical_Kubernetes_Helm_and_Helmfile"
summary: "A guided tour of the basics of Kubernetes, Helm, and Helmfile."
---

As I was learning the basics of Kubernetes, Helm, and Helmfile, I was disappointed in free the
resources available for learning. All the technical information was available out there but it was
spread across dozens of documentation pages in three projects and I didn't find any good summaries
of the basic concepts.

This article will walk you through the process of deploying a simple Node application in Kubernetes,
packaging that Kubernetes configuration as a Helm Chart, and then orchestrating Helm Chart
installations for local development environments with Helmfile. As we go along I will define all the
relevant terms and concepts, quoting from documentation sources where possible, while linking back
to the official documentation for those terms and concepts so you can explore those topics further
on your own. When we're done you should have a working example and many threads to pull on for
future learning.

All the code in this article can be found on my GitHub at
[keawade/kube-helm-helmfile-demo][companion-repo].

## Prerequisites

We'll need a couple tools to go through the full demo: Docker, Kubernetes, [Helm][helm-install], and
[Helmfile][helmfile-install].

If you don't already have Docker and a Kubernetes distribution installed then I recommend using
[Rancher Desktop][rancher-desktop-install] as it is free or [Docker Desktop][docker-desktop-install]
(Be sure to [enable Kubernetes][docker-desktop-enable-kubernetes]) which is free for personal use
and education.

I've written a simple database-backed Node + Express app that we'll use for the rest of this
demonstration. If you don't have Node or PostgreSQL installed in your environment, don't worry, you
won't need to install them as we'll be doing all of that in Docker containers.

Once you have the prerequisite software installed you can clone the repo and build the image:

```shell
git clone https://github.com/keawade/kube-helm-helmfile-demo.git
cd kube-helm-helmfile-demo
docker build ./demo-express-app -t demo-express-app:1
```

Let's make sure the image can be run while we're at it.

```shell
docker run -d --name demo-express-app -p 3000:3000 demo-express-app:1
```

Now let's `curl` our application to see if it's working.

```shell
> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎
```

It works! Our application is up and able to accept requests!

Let's try hitting our application's `/hello` endpoint now.

```shell
> curl http://localhost:3000/hello
{"message":"Failed to connect to database."}⏎
```

Yep, this application has a database dependency that we're missing. Don't worry though, we'll pull
in a public PostgreSQL database image later and connect it to our application so you won't need to
install anything else locally. For now, this error is expected. so since we've got our image built
and running, though not fully functional yet, let's clean up and move on to running our image in
Kubernetes.

```shell
docker stop demo-express-app
docker rm demo-express-app
```

## Kubernetes

We've got our image running as a container in Docker but now we want to get it running in Kubernetes
so we can leverage it's orchestration capabilities. First, let's talk a bit about what Kubernetes is
and define the concepts we'll be working with.

> [Kubernetes][kubernetes] is a portable, extensible, open source platform for managing
> containerized workloads and services that facilitates both declarative configuration and
> automation. We use Kubernetes to orchestrate containers for local and remote environments.

### Pods

> [Pods][kubernetes-pods] are the smallest deployable units of computing that you can create and
> manage in Kubernetes.
>
> A Pod (as in a pod of whales or pea pod) is a group of one or more
> [containers][kubernetes-container], with shared storage and network resources, and a specification
> for how to run the containers. A Pod's contents are always co-located and co-scheduled, and run in
> a shared context. A Pod models an application-specific "logical host": it contains one or more
> application containers which are relatively tightly coupled. In non-cloud contexts, applications
> executed on the same physical or virtual machine are analogous to cloud applications executed on
> the same logical host.
>
> As well as application containers, a Pod can contain [init containers][kubernetes-init-containers]
> that run during Pod startup. You can also inject [ephemeral
> containers][kubernetes-ephemeral-container] for debugging if your orchestrator offers this.

Pods are generally not created directly and are instead created via workload resources like
Deployments or StatefulSets. To get a feel for what Pods are, though, we'll go ahead and define a
Pod directly and run it in Kubernetes.

First, we'll create a YAML file and define a Kubernetes Pod using the image we built earlier.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo-express-app-v1
  # It is considered a best practice to add these name and version labels to
  # resources as it makes working with these resources easier down the line.
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  containers:
    - name: demo-express-app
      image: demo-express-app:1
      # We never want to pull this image because it's only available locally.
      # For remote images you will want to remove this or change it's value.
      imagePullPolicy: Never
    # We could declare multiple containers here.
```

Now we can use the `kubectl apply` command to deploy the resources defined in that YAML file.

```shell
> kubectl apply -f k8s-demos/1-pod.yaml
pod/demo-express-app-v1 created
```

Kubernetes has created our Pod! Let's use `kubectl get` and `kubectl logs` to inspect the created
Pod resource and its logs.

```shell
> kubectl get pods
NAME                  READY   STATUS    RESTARTS   AGE
demo-express-app-v1   1/1     Running   0          6s

> kubectl logs demo-express-app-v1
Listening on port 3000.
```

Excellent! Now, we still don't have a database so for now let's just `curl` our `/healthcheck`
endpoint again.

```shell
> curl http://localhost:3000/healthcheck
curl: (7) Failed to connect to localhost port 3000 after 0 ms: Connection refused
```

We've successfully deployed our application in a Kubernetes pod but we aren't able to hit our
application yet because we haven't defined a way to access our pod either externally or from other
pods.

Let's clean up the deployed resources and move on to adding a Service definition to bind ports from
inside our cluster to our localhost.

```shell
> kubectl delete -f k8s-demos/1-pod.yaml
pod "demo-express-app-v1" deleted
```

### Services

> In Kubernetes, a [Service][kubernetes-service] is an abstraction which defines a logical set of
> Pods and a policy by which to access them. The set of Pods targeted by a Service is usually
> determined by a [selector][kubernetes-labels-selectors].
>
> For example, consider a stateless image-processing backend which is running with 3 replicas. Those
> replicas are fungible—frontends and do not care which backend they use. While the actual Pods that
> compose the backend set may change, the frontend clients should not need to be aware of that, nor
> should they need to keep track of the set of backends themselves.
>
> The Service abstraction enables this decoupling.

To define a Service, let's add a second YAML document to our yaml file. If you're not already aware,
YAML files can contain multiple documents separated by a line containing `---`. Let's use that to
add a Service resource definition to the bottom of our existing YAML file. We'll also need to add
`ports` definitions to our Pod to give our Service ports on our Pod to map to our localhost. Check
out the updated example below and read its annotations for more details.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  containers:
    - name: demo-express-app
      image: demo-express-app:1
      imagePullPolicy: Never
      # Expose our application's listening port so the service can map it
      # externally
      ports:
        - name: http-web-svc
          containerPort: 3000
# Here's our --- separator defining a new YAML document in this file
---
apiVersion: v1
kind: Service
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  # Here we see one reason that adding the name and version labels is considered
  # a best practice. With the labels already in place, it is trivial to map a
  # service configuration to our pod with a selector.
  selector:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
  # The LoadBalancer service type will allow us, in a local environment, to
  # access the exposed port on our localhost. Exposing ports to external traffic
  # in remote environments is much more complicated and is out of scope for this
  # demo.
  type: LoadBalancer
  ports:
    # Map the container's application port externally so other pods can access
    # it
    - name: app-http
      # The external port we want to map out to
      port: 3000
      # The container's internal port we want to map
      targetPort: http-web-svc
```

Again, we'll deploy our resources with `kubectl apply`, inspect them with `kubectl get`, and then
try to `curl` our `/healthcheck` endpoint. Afterwards, let's also check our logs just to see all the
parts in motion.

```
> kubectl apply -f k8s-demos/2-service.yaml
pod/demo-express-app-v1 created
service/demo-express-app-v1 created

> kubectl get pods
NAME                  READY   STATUS    RESTARTS   AGE
demo-express-app-v1   1/1     Running   0          3s

> kubectl get services
NAME                  TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
demo-express-app-v1   LoadBalancer   10.99.202.95   localhost     3000:32418/TCP   7s
kubernetes            ClusterIP      10.96.0.1      <none>        443/TCP          93m

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> kubectl logs demo-express-app-v1
Listening on port 3000.
Reporting that the application is live
GET /healthcheck 200 2.539 ms - 44
```

There we go! We've successfully run our image in Kubernetes and exposed it to our localhost via a
LoadBalancer Service!

While this works, it isn't ideal. Sure, we've got our image running as a container in a Pod but with
the way we've done it so far we don't have good tools for scaling our Pod up to more than one
instance like we would ideally do in a production environment. Let's refactor our Pod declaration
into a Deployment so we can work with this in a more idiomatic way.

But, before we move on to the next section, let's clean up again.

```shell
> kubectl delete -f k8s-demos/2-service.yaml
pod "demo-express-app-v1" deleted
service "demo-express-app-v1" deleted
```

### Deployments

A [Deployment][kubernetes-deployment] is a workload resource that provides declarative updates for
[Pods][kubernetes-pods] and [ReplicaSets][kubernetes-replica-set].

> You describe a desired state in a Deployment, and the Deployment
> [Controller][kubernetes-controller] changes the actual state to the desired state at a controlled
> rate.

The Kubernetes Deployment Controller will dynamically spin up instances of the defined resources and
scale them as defined by your Deployment configuration. These resources are stateless and can be
interchanged arbitrarily. If a Pod specified by a Deployment crashes or is shutdown then Kubernetes
will replace that Pod with a new instance.

Let's refactor our Pod declaration as a Deployment with multiple Pods

```yaml
apiVersion: apps/v1
# Note that we're using a Deployment kind now instead of a Pod
kind: Deployment
metadata:
  name: demo-express-app-v1
spec:
  # Define a strategy to use for applying updates to the resources managed by
  # this Deployment resource. This isn't very important for our demos but
  # becomes important if you want to build on these examples later.
  strategy:
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1

  # Define a number of pod replicas to maintain. This configuration can get much
  # more complex with conditional scaling but for our demos we'll just use a
  # hard coded value.
  replicas: 3
  # We'll again use a selector to identify relevant resources. In this case
  # we're specifying what pods are managed by this Deployment.
  selector:
    matchLabels:
      app.kubernetes.io/name: demo-express-app
      app.kubernetes.io/version: "1"

  # Define a template to use to create pods. We're no longer managing specific
  # pod instances but are instead managing a collection of pods defined using
  # this template and the replicas configuration above.
  template:
    metadata:
      labels:
        app.kubernetes.io/name: demo-express-app
        app.kubernetes.io/version: "1"
    spec:
      containers:
        - name: demo-express-app-v1
          image: demo-express-app:1
          imagePullPolicy: Never
          ports:
            - name: http-web-svc
              containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  # No Service changes are needed as we're targeting pods via labels and
  # services are intended to abstract connection details for arbitrary numbers
  # of pods.
  selector:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
  type: LoadBalancer
  ports:
    - name: app-http
      port: 3000
      protocol: TCP
      targetPort: http-web-svc
```

Let's spin up our resources and go through our set of inspections and tests.

```shell
> kubectl apply -f k8s-demos/3-deployment.yaml
deployment.apps/demo-express-app-v1 created
service/demo-express-app-v1 created

> kubectl get deployments.apps
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
demo-express-app-v1   3/3     3            3           4s

> kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
demo-express-app-v1-65f8b474c8-bqbmc   1/1     Running   0          7s
demo-express-app-v1-65f8b474c8-mnm8p   1/1     Running   0          7s
demo-express-app-v1-65f8b474c8-x9snn   1/1     Running   0          7s

> kubectl get services
NAME                  TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
demo-express-app-v1   LoadBalancer   10.96.58.113   localhost     3000:30028/TCP   11s
kubernetes            ClusterIP      10.96.0.1      <none>        443/TCP          113m

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> kubectl logs demo-express-app-v1-65f8b474c8-bqbmc
Listening on port 3000.

> kubectl logs demo-express-app-v1-65f8b474c8-mnm8p
Listening on port 3000.
Reporting that the application is live
GET /healthcheck 200 2.584 ms - 44

> kubectl logs demo-express-app-v1-65f8b474c8-x9snn
Listening on port 3000.
```

See how we now have three Pods to match the number of replicas we configured in our Deployment? Also
notice that our Pods have extra characters added to them to uniquely identify them. The first set of
characters identifies the Deployment and the final set of characters identifies the Pod in that
Deployment.

Finally, notice how when we check the logs after `curl`ing our endpoint only one of the Pods logged
that it responded to a request. That is because our LoadBalancer Service automatically picked a Pod
to forward our request to so we could hit a stable address, in this case `http://localhost:3000`,
and have it rerouted under the hood as needed without the consumer caring how the request is
specifically handled. If we kept hitting our endpoint and checking our logs we would see all our
other Pods get hit as well eventually.

Now that we've refactored our Pod to a Deployment of Pods, let's clean up and start working on
setting a database for our app.

```shell
> kubectl delete -f k8s-demos/3-deployment.yaml
deployment.apps "demo-express-app-v1" deleted
service "demo-express-app-v1" deleted
```

### Adding a database

We'll use the publicly available `postgres:14` image from Docker Hub for our database. In a few
steps we'll implement this more robustly but for now let's just slap together a quick Pod and
Service definition for PostgreSQL so our app can access it.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-express-app-v1
spec:
  strategy:
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1

  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: demo-express-app
      app.kubernetes.io/version: "1"

  template:
    metadata:
      labels:
        app.kubernetes.io/name: demo-express-app
        app.kubernetes.io/version: "1"
    spec:
      containers:
        - name: demo-express-app-v1
          image: demo-express-app:1
          imagePullPolicy: Never
          ports:
            - name: http-web-svc
              containerPort: 3000
          env:
            # Add our database connection string env var
            - name: DATABASE_CONNECTION_STRING
              value: postgres://demo:demo@postgresql.default.svc.cluster.local:5432/demo-express-app
---
# Our existing app Service stays the same
apiVersion: v1
kind: Service
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  selector:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
  type: LoadBalancer
  ports:
    - name: app-http
      port: 3000
      protocol: TCP
      targetPort: http-web-svc
---
apiVersion: v1
# We're just using a Pod for now as its quick and easy. We'll come back in a few
# steps to implement a more robust solution.
kind: Pod
metadata:
  name: postgresql
  labels:
    app.kubernetes.io/name: postgresql
spec:
  containers:
    - name: postgresql
      image: postgres:14
      ports:
        - name: postgresql-port
          containerPort: 5432
      env:
        - name: POSTGRES_USER
          value: demo
        - name: POSTGRES_PASSWORD
          value: demo
        - name: POSTGRES_DB
          value: demo-express-app
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql
spec:
  selector:
    app.kubernetes.io/name: postgresql
  type: LoadBalancer
  ports:
    # Expose the default PostgreSQL port for use by other containers
    - name: postgresql-port
      port: 5432
      targetPort: postgresql-port
```

Okay, this file is getting pretty large. Don't worry, we'll have a solution for that with Helm in a
few steps. For now, let's take our updated definition out for a spin.

```shell
> kubectl apply -f k8s-demos/4-postgres.yaml
deployment.apps/demo-express-app-v1 created
service/demo-express-app-v1 created
pod/postgresql created
service/postgresql created

> kubectl get deployments.apps
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
demo-express-app-v1   3/3     3            3           3s

> kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
demo-express-app-v1-5d8cd74558-9ts89   1/1     Running   0          5s
demo-express-app-v1-5d8cd74558-bhkqb   1/1     Running   0          5s
demo-express-app-v1-5d8cd74558-lfmms   1/1     Running   0          5s
postgresql                             1/1     Running   0          5s

> kubectl get services
NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
demo-express-app-v1   LoadBalancer   10.107.60.157    localhost     3000:30923/TCP   8s
kubernetes            ClusterIP      10.96.0.1        <none>        443/TCP          152m
postgresql            LoadBalancer   10.101.148.105   localhost     5432:32620/TCP   8s

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:3000/hello
{"message":"Hello, world!"}⏎

> curl http://localhost:3000/history
{"data":[{"name":"world","timestamp":"2022-11-19T00:34:51.921Z"}]}⏎
```

It's working! We can now hit the `/hello` endpoint, get a response, and then hit the `/history`
endpoint and see our previous request was recorded and we can retrieve that record.

We're ready to take what we've learned and apply it to create a Helm chart but, first, let's take a
look at ConfigMaps as it will make our lives easier once we get into the Helm chart.

As always, let's clean up before moving on.

```shell
> kubectl delete -f k8s-demos/4-postgres.yaml
deployment.apps "demo-express-app-v1" deleted
service "demo-express-app-v1" deleted
pod "postgresql" deleted
service "postgresql" deleted
```

### ConfigMaps

> A [ConfigMap][kubernetes-configmap] is an API object used to store non-confidential data in
> key-value pairs. [Pods][kubernetes-pods] can consume ConfigMaps as environment variables,
> command-line arguments, or as configuration files in a [volume][kubernetes-volumes].
>
> A ConfigMap allows you to decouple environment-specific configuration from your container images,
> so that your applications are easily portable.

This could be used for our database connection string value but since that string contains our
database user's password, we should use a Secret instead.

> A [Secret][kubernetes-secret] is an object that contains a small amount of sensitive data such as
> a password, a token, or a key. Such information might otherwise be put in a [Pod][kubernetes-pods]
> specification or in a container image. Using a Secret means that you don't need to include
> confidential data in your application code.
>
> Because Secrets can be created independently of the Pods that use them, there is less risk of the
> Secret (and its data) being exposed during the workflow of creating, viewing, and editing Pods.
> Kubernetes, and applications that run in your cluster, can also take additional precautions with
> Secrets, such as avoiding writing secret data to nonvolatile storage.
>
> Secrets are similar to [ConfigMaps][kubernetes-configmap] but are specifically intended to hold
> confidential data.

That sounds great but it is important to note that Secrets are not silver bullets.

> Kubernetes Secrets are, by default, stored unencrypted in the API server's underlying data store
> (etcd). Anyone with API access can retrieve or modify a Secret, and so can anyone with access to
> etcd. Additionally, anyone who is authorized to create a Pod in a namespace can use that access to
> read any Secret in that namespace; this includes indirect access such as the ability to create a
> Deployment.

To fully leverage the security benefits of Secrets we would need to take several more steps to
encrypt those secrets, configure user access rules for the secrets, restrict container access to
secrets, and consider using external Secret store providers. That's advanced enough to be out of
scope for this article so we won't sweat those details here. Just be aware that in remote
environments you should consider these things carefully.

The main practical difference between ConfigMaps and Secrets for us is that Secrets need their
values defined as base64 encoded strings. We can get this on a unix-based system by echoing our
value through the base64 command.

```shell
> echo 'postgres://demo:demo@postgresql.default.svc.cluster.local:5432/demo-express-app' | base64 -w 0
cG9zdGdyZXM6Ly9kZW1vOmRlbW9AcG9zdGdyZXNxbC5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsOjU0MzIvZGVtby1leHByZXNzLWFwcAo=⏎
```

Now let's define our Secret with that encoded value. Remember, as far as the basic configuration is
concerned, Secrets have a lot of overlap with ConfigMaps so most of what we do here is also
applicable to Configmaps as well.

```yaml
# Define our Secret
apiVersion: v1
kind: Secret
metadata:
  # Define a name we can reference this Secret by later
  name: demo-express-app-secret
# Define our content. This is a YAML object so we could specify multiple
# key-value pairs if we wanted to. Keep in mind that it's usually wise to use
# multiple Secrets or ConfigMaps for separation of concerns so your provided
# configurations can be defined independently of each other.
data:
  databaseConnectionString: cG9zdGdyZXM6Ly9kZW1vOmRlbW9AcG9zdGdyZXNxbC5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsOjU0MzIvZGVtby1leHByZXNzLWFwcAo=
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-express-app-v1
spec:
  strategy:
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1

  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: demo-express-app
      app.kubernetes.io/version: "1"

  template:
    metadata:
      labels:
        app.kubernetes.io/name: demo-express-app
        app.kubernetes.io/version: "1"
    spec:
      containers:
        - name: demo-express-app-v1
          image: demo-express-app:1
          imagePullPolicy: Never
          ports:
            - name: http-web-svc
              containerPort: 3000
          env:
            - name: DATABASE_CONNECTION_STRING
              # Change the source of our database connection string from being
              # defined inline to being supplied from a Secret
              valueFrom:
                # If we wanted to map in a ConfigMap instead we would use the
                # configMapKeyRef key here instead.
                secretKeyRef:
                  name: demo-express-app-secret
                  key: databaseConnectionString
---
apiVersion: v1
kind: Service
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  selector:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
  type: LoadBalancer
  ports:
    - name: app-http
      port: 3000
      protocol: TCP
      targetPort: http-web-svc
---
apiVersion: v1
kind: Pod
metadata:
  name: postgresql
  labels:
    app.kubernetes.io/name: postgresql
spec:
  containers:
    - name: postgresql
      image: postgres:14
      ports:
        - name: postgresql-port
          containerPort: 5432
      env:
        - name: POSTGRES_USER
          value: demo
          # It would make sense to also supply this via a Secret rather than
          # hardcoding it in our configuration but since we'll be moving away
          # from this Pod definition soon we'll leave it as is for now.
        - name: POSTGRES_PASSWORD
          value: demo
        - name: POSTGRES_DB
          value: demo-express-app
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql
spec:
  selector:
    app.kubernetes.io/name: postgresql
  type: LoadBalancer
  ports:
    - name: postgresql-port
      port: 5432
      targetPort: postgresql-port
```

Let's apply this configuration and do our usual round of inspections.

```shell
> kubectl apply -f k8s-demos/5-secret.yaml
secret/demo-express-app-secret created
deployment.apps/demo-express-app-v1 created
service/demo-express-app-v1 created
pod/postgresql created
service/postgresql created

> kubectl get deployments.apps
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
demo-express-app-v1   3/3     3            3           6s

> kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
demo-express-app-v1-589d6748c6-fztsf   1/1     Running   0          10s
demo-express-app-v1-589d6748c6-m7vng   1/1     Running   0          10s
demo-express-app-v1-589d6748c6-xgwgj   1/1     Running   0          10s
postgresql                             1/1     Running   0          10s

> kubectl get services
NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
demo-express-app-v1   LoadBalancer   10.101.219.53   localhost     3000:31668/TCP   13s
kubernetes            ClusterIP      10.96.0.1       <none>        443/TCP          18h
postgresql            LoadBalancer   10.99.74.251    localhost     5432:30344/TCP   13s

> kubectl get secrets
NAME                      TYPE     DATA   AGE
demo-express-app-secret   Opaque   1      17s

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:3000/hello
{"message":"Hello, world!"}⏎
```

It still works! We've successfully shifted our database connection string into a Secret/ConfigMap
and referenced it from our Pods.

Now that we've got our system running Kubernetes lets clean up our cluster and then take a look at
how we can augment this setup by using Helm to manage our configuration.

```shell
> kubectl delete -f k8s-demos/5-secret.yaml
secret "demo-express-app-secret" deleted
deployment.apps "demo-express-app-v1" deleted
service "demo-express-app-v1" deleted
pod "postgresql" deleted
service "postgresql" deleted
```

## Helm

You've probably noticed by now that using `kubectl apply` can get rather unwieldy. It works well
enough but as the number of configurations necessary for an application grows, the more awkward it
is to put together in a single massive file and yeet it into our cluster with `kubectl apply`. And
so far we're only talking about a single application with a single supporting database instance.
What happens as we start adding more applications?

Also, that database instance isn't particularly robust. Yes, we're using the official PostgreSQL
image but we just slapped it in a Pod and called it a day. Ideally we would configure a Deployment
instead but how should we configure that? I don't know about you but I'm not a PostgreSQL expert and
don't really know where to start when it comes to configuring a PostgreSQL cluster locally, much
less for a production environment. It would be nice if we could get a production-ready configuration
of a PostgreSQL Kubernetes deployment, wouldn't it?

This is where [Helm][helm] comes in. We can package our collection of application configurations as
a [Helm chart][helm-charts] for easier installation, upgrades, and uninstallation in our clusters.
Because Helm charts are a packaging solution we can also pull in charts from the community instead
of rolling our own implementations for every part of our stack.

### Helm chart

Helm charts consist of a `Chart.yaml` file and a collection of templates. The templates are
Golang-templated YAML files. They can contain any subset of the big YAML file we've been building
though it is a common practice to split each YAML document out into its own file.

For example, here is the file structure we'll end up with for our application's Helm chart.

```text
k8s-demos/6-chart/
├── Chart.yaml
├── k8s-just-postgres.yaml # This isn't part of our chart and we'll get rid of it soon
└── templates
    ├── deployment.yaml
    ├── secret.yaml
    └── service.yaml
```

Lets package our application as a Helm chart. For now, we'll keep using `kubectl apply` for our
PostgreSQL Pod and Service, though.

```yaml
# ./6-chart/Chart.yaml
apiVersion: v2
name: demo-express-app
description: Demo Node + Express application
type: application
# Version of the Helm chart
version: "1.0.0"
# Version of the application managed by the Helm chart
appVersion: "1.0.0"
```

```yaml
# ./6-chart/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-express-app-v1
spec:
  strategy:
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1

  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: demo-express-app
      app.kubernetes.io/version: "1"

  template:
    metadata:
      labels:
        app.kubernetes.io/name: demo-express-app
        app.kubernetes.io/version: "1"
    spec:
      containers:
        - name: demo-express-app-v1
          image: demo-express-app:1
          imagePullPolicy: Never
          ports:
            - name: http-web-svc
              containerPort: 3000
          env:
            - name: DATABASE_CONNECTION_STRING
              valueFrom:
                secretKeyRef:
                  name: demo-express-app-secret
                  key: databaseConnectionString
```

```yaml
# ./6-chart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: demo-express-app-secret
data:
  databaseConnectionString: cG9zdGdyZXM6Ly9kZW1vOmRlbW9AcG9zdGdyZXNxbC5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsOjU0MzIvZGVtby1leHByZXNzLWFwcAo=
```

```yaml
# ./6-chart/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  selector:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
  type: LoadBalancer
  ports:
    - name: app-http
      port: 3000
      protocol: TCP
      targetPort: http-web-svc
```

As I mentioned above, we'll keep a raw Kubernetes config around for now for our PostgreSQL
configuration.

```yaml
# ./6-chart/k8s-just-postgres.yaml
apiVersion: v1
kind: Pod
metadata:
  name: postgresql
  labels:
    app.kubernetes.io/name: postgresql
spec:
  containers:
    - name: postgresql
      image: postgres:14
      ports:
        - name: postgresql-port
          containerPort: 5432
      env:
        - name: POSTGRES_USER
          value: demo
        - name: POSTGRES_PASSWORD
          value: demo
        - name: POSTGRES_DB
          value: demo-express-app
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql
spec:
  selector:
    app.kubernetes.io/name: postgresql
  type: LoadBalancer
  ports:
    - name: postgresql-port
      port: 5432
      targetPort: postgresql-port
```

Let's spin it up. First, we'll apply the PostgreSQL configuration.

```shell
> kubectl apply -f k8s-demos/6-chart/k8s-just-postgres.yaml
pod/postgresql created
service/postgresql created
```

Then we'll install our newly created Helm chart. We can do this with the `helm install` command
which takes an installation name and chart (name or path) as arguments.

```shell
> helm install demo-express-app ./k8s-demos/6-chart/
NAME: demo-express-app
LAST DEPLOYED: Sat Nov 19 12:13:39 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Well that was easy. Let's inspect our Kubernetes environment and see what happened.

```shell
> kubectl get deployments.apps
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
demo-express-app-v1   3/3     3            3           6s

> kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
demo-express-app-v1-589d6748c6-2mf2q   1/1     Running   0          11s
demo-express-app-v1-589d6748c6-5nxcg   1/1     Running   0          11s
demo-express-app-v1-589d6748c6-wd2mf   1/1     Running   0          11s
postgresql                             1/1     Running   0          15s

> kubectl get services
NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
demo-express-app-v1   LoadBalancer   10.100.223.243   localhost     3000:30964/TCP   17s
kubernetes            ClusterIP      10.96.0.1        <none>        443/TCP          19h
postgresql            LoadBalancer   10.104.122.202   localhost     5432:31996/TCP   21s

> kubectl get secrets
NAME                                     TYPE                 DATA   AGE
demo-express-app-secret                  Opaque               1      20s
sh.helm.release.v1.demo-express-app.v1   helm.sh/release.v1   1      20s

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:3000/hello
{"message":"Hello, world!"}⏎
```

Nice, as expected, we've got all of the same resources and our service still functions! Let's clean
up our cluster and take a look at refactoring our PostgreSQL configuration to be more robust.

```shell
> helm uninstall demo-express-app
release "demo-express-app" uninstalled

> kubectl delete -f k8s-demos/6-chart/k8s-just-postgres.yaml
pod "postgresql" deleted
service "postgresql" deleted
```

### Leverage public chart

We know there are public charts including production-ready charts out there so lets go searching. A
brief search turns up [a chart from the folks at Helm][helm-postgres-chart] but... It has been
deprecated in favor of [a Bitnami chart][bitnami-postgres-chart]. In fact the entire repo of Helm
provided charts has been archived. This is currently somewhat common but it looks like the community
is consolidating around Bitnami's charts repo so you'll likely be back here frequently if you keep
working with Helm charts.

Lets use the Bitnami PostgreSQL chart.

```shell
> helm repo add bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories

> helm install postgresql bitnami/postgresql
NAME: postgresql
LAST DEPLOYED: Sat Nov 19 12:31:59 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: postgresql
CHART VERSION: 12.1.2
APP VERSION: 15.1.0

** Please be patient while the chart is being deployed **

PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:

    postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)

To connect to your database run the following command:

    kubectl run postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:15.1.0-debian-11-r0 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
      --command -- psql --host postgresql -U postgres -d postgres -p 5432

    > NOTE: If you access the container using bash, make sure that you execute "/opt/bitnami/scripts/postgresql/entrypoint.sh /bin/bash" in order to avoid the error "psql: local user with ID 1001} does not exist"

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgres -d postgres -p 5432

> kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
postgresql-0   1/1     Running   0          7s

> kubectl get services
NAME                      TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
kubernetes                ClusterIP   10.96.0.1      <none>        443/TCP    19h
postgresql      ClusterIP   10.96.10.119   <none>        5432/TCP   10s
postgresql-hl   ClusterIP   None           <none>        5432/TCP   10s

> kubectl get statefulsets.apps
NAME                   READY   AGE
postgresql   1/1     21s
```

Alright, we've got a PostgreSQL instance running with a much more robust configuration than our
quick Pod config ever had. Let's use that command they suggest to get our PostgreSQL instance
password.

```shell
> kubectl get secret --namespace default postgresql -o jsonpath="{.data.postgres-password}" | base64 -d
k6b8h2kpiV⏎
```

Notice how we can pull this secret out without any authentication or restrictions? This is an
example of why you'll want to further secure your Secrets like we discussed earlier.

Okay so we could drop this password into our existing database connection string secret and go,
right? Well, sort of. Yes, we could use this but the password will change each time we start up our
PostgreSQL instance which makes that route untenable for us.

```shell
> kubectl get secret --namespace default postgresql -o jsonpath="{.data.postgres-password}" | base64 -d
dAU8O9js4i⏎
```

So we need to tell our PostgreSQL instance what password to use. We can use Helm chart
[Values][helm-chart-values] to do so if the chart we're consuming supports them which the
[PostgreSQL chart does][bitnami-postgres-chart-parameters] Let's reinstall our PostgreSQL chart and
set the user, password, and database to the same values we used previously.

```shell
> helm uninstall postgresql
release "postgresql" uninstalled

> helm install postgresql bitnami/postgresql --set auth.username=demo,auth.password=demo,auth.database=demo-express-app
NAME: postgresql
LAST DEPLOYED: Sat Nov 19 13:24:40 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: postgresql
CHART VERSION: 12.1.2
APP VERSION: 15.1.0

** Please be patient while the chart is being deployed **

PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:

    postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_ADMIN_PASSWORD=$(kubectl get secret --namespace default postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)

To get the password for "demo" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgresql -o jsonpath="{.data.password}" | base64 -d)

To connect to your database run the following command:

    kubectl run postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:15.1.0-debian-11-r0 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
      --command -- psql --host postgresql -U demo -d demo-express-app -p 5432

    > NOTE: If you access the container using bash, make sure that you execute "/opt/bitnami/scripts/postgresql/entrypoint.sh /bin/bash" in order to avoid the error "psql: local user with ID 1001} does not exist"

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U demo -d demo-express-app -p 5432
```

Our chart is currently hard coded to look for a PostgreSQL instance at the address
`postgresql.default.svc.cluster.local` with the user `demo`, the password `demo`, and database
`demo-express-app`. This is pretty restrictive in comparison to how flexible the Bitnami PostgreSQL
chart is. In the next section we'll work on improving that but for now lets at least warn consumers
of our chart by adding a `NOTES.txt` file to our template.

```text
This chart has a hard coded dependency on an existing PostgreSQL instance.

One way of creating that instance is to use the bitnami/postgresql chart.

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgresql bitnami/postgresql --set auth.username=demo,auth.password=demo,auth.database=demo-express-app
```

Now lets install our chart again.

```shell
> helm install demo-express-app ./k8s-demos/7-bitnami-postgres/
NAME: demo-express-app
LAST DEPLOYED: Sat Nov 19 13:31:29 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
This chart has a hard coded dependency on an existing PostgreSQL instance.

One way of creating that instance is to use the bitnami/postgresql chart.

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgresql bitnami/postgresql --set auth.username=demo,auth.password=demo,auth.database=demo-express-app

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:3000/hello
{"message":"Hello, world!"}⏎
```

And it's still working! We were able to successfully depend on an external chart instead of our
quick and dirty Kubernetes Pod configuration.

Let's shut it down again and take a look at adding values to our own chart to allow consumers to
dynamically modify key configurations.

```shell
> helm uninstall demo-express-app
release "demo-express-app" uninstalled

> helm uninstall postgresql
release "postgresql" uninstalled
```

### Chart values

First, we'll create a `./values.yaml` file in our chart's folder which will be the source of our
chart's default values.

```yaml
# ./8-values/values.yaml
demoExpressApp:
  port: 3000

  database:
    username: demo
    password: demo
    address: postgresql.default.svc.cluster.local
    port: 5432
    name: demo-express-app
```

Now that we have some values defined we can interpolate them into our chart's YAML files. Helm
charts use Go templating on all files in the `templates/` directory so we can interpolate values.
Let's start by changing the port our Node application listens on and dynamically expose that port
through our Service.

```yaml
# ./8-values/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-express-app-v1
spec:
  strategy:
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1

  replicas: 3
  selector:
    matchLabels:
      app.kubernetes.io/name: demo-express-app
      app.kubernetes.io/version: "1"

  template:
    metadata:
      labels:
        app.kubernetes.io/name: demo-express-app
        app.kubernetes.io/version: "1"
    spec:
      containers:
        - name: demo-express-app-v1
          image: demo-express-app:1
          imagePullPolicy: Never
          ports:
            - name: http-web-svc
              containerPort: { { .Values.demoExpressApp.port } }
          env:
            - name: PORT
              value: "{{.Values.demoExpressApp.port}}"
            - name: DATABASE_CONNECTION_STRING
              valueFrom:
                secretKeyRef:
                  name: demo-express-app-secret
                  key: databaseConnectionString
```

```yaml
# ./8-values/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: demo-express-app-v1
  labels:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
spec:
  selector:
    app.kubernetes.io/name: demo-express-app
    app.kubernetes.io/version: "1"
  type: LoadBalancer
  ports:
    - name: app-http
      port: { { .Values.demoExpressApp.port } }
      protocol: TCP
      targetPort: http-web-svc
```

Basically every location where we had previously hardcoded the port `3000` we have now templated in
`.Values.demoExpressApp.port`. Notice we've also added a `PORT` environment variable. Our app is
already written to look for that environment variable to change what port it will listen for HTTP
requests on so this coupled with our other templating changes will allow us to change our port to
any arbitrary value.

We can do this with our database connection string as well with something like this but piecing
together the username, password, address, port, and name can be a little tedious, especially if you
have to do it multiple times. We don't need to reuse this in particular but its complexity offers a
good opportunity to try out custom templates. We can define custom templates with the
`define "<template-name>"` template function in any file. However it's considered a good practice to
do this explicitly in `*.tpl` files to make it easier to identify what files produce Kubernetes
config output and what files are just helper templates. Let's create a template now.

```yaml
# ./8-values/templates/templates.tpl
# Name spacing templates is important because templates are _global_ and you can
# have collisions with other templates. This is particularly relevant if you
# pull in child charts with their own templates.
{{- define "demoExpressApp.databaseConnectionString" }}
{{- with .Values.demoExpressApp.database }}
{{- print "postgres://" .username ":" .password "@" .address ":" .port "/" .name }}
{{- end }}
{{- end -}}
```

Now we can use that template with the `template "<template-name>"` template function. Here it is
being used in the Secret definition.

```yaml
# ./8-values/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: demo-express-app-secret
# Switched to stringData instead of data so we don't have to convert the value
# to base64 first. Now that conversion will be handled for us.
stringData:
  databaseConnectionString: { { template "demoExpressApp.databaseConnectionString" . } }
```

Let's also update the `./templates/NOTES.txt` file while we're at it.

```text
Installed demo-express-app chart.

App listening on port {{ .Values.demoExpressApp.port }}.

App will look for database at "{{- print "postgres://" .Values.demoExpressApp.database.address ":" .Values.demoExpressApp.database.port "/" .Values.demoExpressApp.database.name -}}"

One way of creating that PostgreSQL instance is to use the bitnami/postgresql chart.

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgresql bitnami/postgresql --set auth.username={{.Values.demoExpressApp.database.username}},auth.password=<password>,auth.database={{.Values.demoExpressApp.database.name}}
```

Now that we've updated our chart to use our values file, let's make sure nothing broke.

```shell
> helm install postgresql bitnami/postgresql --set auth.username=demo,auth.password=demo,auth.database=demo-express-app
NAME: postgresql
LAST DEPLOYED: Sat Nov 19 18:22:55 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: postgresql
CHART VERSION: 12.1.2
APP VERSION: 15.1.0

Notes trimmed, you get the idea.

> helm install demo-express-app ./k8s-demos/8-values/
NAME: demo-express-app
LAST DEPLOYED: Sat Nov 19 18:23:00 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Installed demo-express-app chart.

App listening on port 3000.

App will look for database at "postgres://postgresql.default.svc.cluster.local:5432/demo-express-app"

One way of creating that PostgreSQL instance is to use the bitnami/postgresql chart.

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgresql bitnami/postgresql --set auth.username=demo,auth.password=<password>,auth.database=demo-express-app

> curl http://localhost:3000/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:3000/hello
{"message":"Hello, world!"}⏎
```

Everything appears in order. Let's test out that templating by reinstalling our app with a different
port.

```shell
> helm uninstall demo-express-app
release "demo-express-app" uninstalled

> helm install demo-express-app ./k8s-demos/8-values/ --set demoExpressApp.port=4242
NAME: demo-express-app
LAST DEPLOYED: Sat Nov 19 18:26:41 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Installed demo-express-app chart.

App listening on port 4242.

App will look for database at "postgres://postgresql.default.svc.cluster.local:5432/demo-express-app"

One way of creating that PostgreSQL instance is to use the bitnami/postgresql chart.

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgresql bitnami/postgresql --set auth.username=demo,auth.password=<password>,auth.database=demo-express-app

> curl http://localhost:4242/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:4242/hello
{"message":"Hello, world!"}⏎
```

The port changed! Now anyone using our chart can customize their port and database connection
details by filling in their own values.

Let's clean it up for now and finally check out Helmfile.

```shell
> helm uninstall demo-express-app
release "demo-express-app" uninstalled

> helm uninstall postgresql
release "postgresql" uninstalled
```

## Helmfile

Managing charts with `helm install` works well enough for production environments where you're
usually only making changes to one application at a time from CI/CD workflows and it also works
reasonably well for spinning up charts for local development as long as you don't have to manage too
many charts simultaneously but when you get to larger quantities of charts it gets a bit unwieldy.
Sometimes installation order matters to get a smooth and fast startup without Kubernetes Pods
crashing and being recycled until their dependencies are available. These are all things that
Helmfile can help us with.

[Helmfile][helmfile] is a declarative spec for deploying helm charts. It lets you keep a directory
of chart value files, maintain changes in version control, apply CI/CD to configuration changes, and
sync to avoid skew in environments. I've found Helmfile particularly useful for managing local
development clusters.

All we need to get started is a `helmfile.yaml` file. Here's an example with overrides for all the
values we've been working with so far.

```yaml
# ./9-helmfile/helmfile.yaml
repositories:
  # Need to define a source repository for our Bitnami chart. This lets us
  # declaratively define chart sources instead of having to manually configure
  # them via the helm command.
  - name: bitnami
    url: https://charts.bitnami.com/bitnami

releases:
  - name: demo-express-app
    # We'll reference the chart we created earlier
    chart: ../8-values
    # Provide values overrides
    values:
      - demoExpressApp:
          port: 4242
          database:
            username: cool-user
            password: hunter2
            name: its-a-cool-database
    # Tell Helmfile to finish setting up PostgreSQL before deploying our app's
    # chart
    needs:
      - postgresql

  - name: postgresql
    # Pull the `postgresql` chart from the `bitnami` repository we defined above
    chart: bitnami/postgresql
    # Provide values overrides
    values:
      - auth:
          username: cool-user
          password: hunter2
          database: its-a-cool-database
```

To spin this up we only need to run the `helmfile sync` command in the directory with the
`helmfile.yaml` file or `helmfile sync --file <path>` from anywhere else.

Also, before we can start our cluster with a new PostgreSQL user and password, we'll [need to clear
out our old PersistentVolumeClaim so we can create a new one][bitnami-postgres-chart-uninstall].

```shell
> kubectl delete persistentvolumeclaims data-postgresql-0
persistentvolumeclaim "data-postgresql-0" deleted

> helmfile sync --file k8s-demos/9-helmfile/helmfile.yaml
Adding repo bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories

Building dependency release=demo-express-app, chart=../8-values
Upgrading release=postgresql, chart=bitnami/postgresql
Release "postgresql" does not exist. Installing it now.
NAME: postgresql
LAST DEPLOYED: Sat Nov 19 19:05:38 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: postgresql
CHART VERSION: 12.1.2
APP VERSION: 15.1.0

** Please be patient while the chart is being deployed **

PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:

    postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_ADMIN_PASSWORD=$(kubectl get secret --namespace default postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)

To get the password for "cool-user" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgresql -o jsonpath="{.data.password}" | base64 -d)

To connect to your database run the following command:

    kubectl run postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:15.1.0-debian-11-r0 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
      --command -- psql --host postgresql -U cool-user -d its-a-cool-database -p 5432

    > NOTE: If you access the container using bash, make sure that you execute "/opt/bitnami/scripts/postgresql/entrypoint.sh /bin/bash" in order to avoid the error "psql: local user with ID 1001} does not exist"

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U cool-user -d its-a-cool-database -p 5432

Listing releases matching ^postgresql$
postgresql      default         1               2022-11-19 19:05:38.872091543 -0500 EST deployed        postgresql-12.1.2       15.1.0

Upgrading release=demo-express-app, chart=../8-values
Release "demo-express-app" does not exist. Installing it now.
NAME: demo-express-app
LAST DEPLOYED: Sat Nov 19 19:05:40 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Installed demo-express-app chart.

App listening on port 4242.

App will look for database at "postgres://postgresql.default.svc.cluster.local:5432/its-a-cool-database"

One way of creating that PostgreSQL instance is to use the bitnami/postgresql chart.

    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install postgresql bitnami/postgresql --set auth.username=cool-user,auth.password=<password>,auth.database=its-a-cool-database

Listing releases matching ^demo-express-app$
demo-express-app        default         1               2022-11-19 19:05:40.528007224 -0500 EST deployed        demo-express-app-1.1.0  1.0.0


UPDATED RELEASES:
NAME               CHART                VERSION
postgresql         bitnami/postgresql    12.1.2
demo-express-app   ../8-values            1.1.0

> curl http://localhost:4242/healthcheck
{"message":"Application is accepting requests."}⏎

> curl http://localhost:4242/hello
{"message":"Hello, world!"}⏎
```

And just like that we've got a single Helmfile config orchestrating our entire application stack!

Let's clean it up one last time.

```shell
> helmfile destroy --file k8s-demos/9-helmfile/helmfile.yaml
Adding repo bitnami https://charts.bitnami.com/bitnami
"bitnami" has been added to your repositories

Building dependency release=demo-express-app, chart=../8-values
Listing releases matching ^postgresql$
postgresql      default         1               2022-11-19 19:05:38.872091543 -0500 EST deployed        postgresql-12.1.2       15.1.0

Listing releases matching ^demo-express-app$
demo-express-app        default         1               2022-11-19 19:05:40.528007224 -0500 EST deployed        demo-express-app-1.1.0  1.0.0

Deleting demo-express-app
release "demo-express-app" uninstalled

Deleting postgresql
release "postgresql" uninstalled


DELETED RELEASES:
NAME
demo-express-app
postgresql

> kc delete persistentvolumeclaims data-postgresql-0
persistentvolumeclaim "data-postgresql-0" deleted
```

You have now built up configurations from scratch for a basic application in Kubernetes, Helm, and
Helmfile. Hopefully this gives you ideas for how you can adapt these concepts for your own use.

## Further reading

That said, this article barely scratched the surface of what is possible and we cut some corners
along the way. Check out these links for further learning about the concepts we've covered and best
practices around these tools.

- [Pods][kubernetes-pods]
  - [Init containers][kubernetes-init-containers]
  - [Ephemeral containers][kubernetes-ephemeral-container]
- [Workload resources](https://kubernetes.io/docs/concepts/workloads/controllers/)
  - [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  - [ReplicaSet][kubernetes-replica-set]
  - [StatefulSet][kubernetes-stateful-set]
  - [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [Storage](https://kubernetes.io/docs/concepts/storage/)
  - [Volumes][kubernetes-volumes]
  - [Persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Networking](https://kubernetes.io/docs/concepts/services-networking/)
  - [Service][kubernetes-service]
  - [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- Helm
  - [Best practices](https://helm.sh/docs/chart_best_practices/conventions/)
  - [Chart repositories](https://helm.sh/docs/topics/chart_repository/)
- Helmfile
  - [Templating](https://helmfile.readthedocs.io/en/latest/#templating)
  - [Best practices](https://helmfile.readthedocs.io/en/latest/writing-helmfile/)

[companion-repo]: https://github.com/keawade/kube-helm-helmfile-demo
[rancher-desktop-install]: https://docs.rancherdesktop.io/getting-started/installation/
[docker-desktop-install]: https://www.docker.com/products/docker-desktop/
[docker-desktop-enable-kubernetes]: https://docs.docker.com/desktop/kubernetes/#enable-kubernetes
[kubernetes]: https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/
[kubernetes-deployment]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[kubernetes-controller]: https://kubernetes.io/docs/concepts/architecture/controller/
[kubernetes-pods]: https://kubernetes.io/docs/concepts/workloads/pods/
[kubernetes-replica-set]: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
[kubernetes-stateful-set]: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
[kubernetes-configmap]: https://kubernetes.io/docs/concepts/configuration/configmap/
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[kubernetes-init-containers]: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/
[kubernetes-ephemeral-container]:
  https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/
[kubernetes-container]: https://kubernetes.io/docs/concepts/containers/
[kubernetes-labels-selectors]:
  https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[kubernetes-service]: https://kubernetes.io/docs/concepts/services-networking/service/
[helm]: https://helm.sh/
[helm-install]: https://helm.sh/docs/intro/install/
[helm-charts]: https://helm.sh/docs/topics/charts/
[helmfile]: https://github.com/helmfile/helmfile#about
[helmfile-install]: https://github.com/helmfile/helmfile#installation
[helm-postgres-chart]: https://github.com/helm/charts/tree/master/stable/postgresql
[bitnami-postgres-chart]: https://github.com/bitnami/charts/tree/main/bitnami/postgresql
[bitnami-postgres-chart-parameters]:
  https://github.com/bitnami/charts/tree/main/bitnami/postgresql#parameters
[bitnami-postgres-chart-uninstall]:
  https://github.com/bitnami/charts/tree/main/bitnami/postgresql#uninstalling-the-chart
[helm-chart-values]: https://helm.sh/docs/chart_template_guide/values_files/
