# Anchor

Backups Kubernetes resources as a Helm chart.  
Extract configurations from resources and save them as values and templates in a reproducible [Helm](https://github.com/kubernetes/helm) chart.

![Anchor - Kubernetes backup](https://cloud.githubusercontent.com/assets/1764512/26036522/775a4ef2-38df-11e7-8ee0-a45e70578495.png)

## How to use it?

### Requirements

- Node.js, `>= v6`
- kubectl

```sh
npm install @risingstack/anchor
```

### Example

For more detailed examples check out `./example` folder.

```js
const anchor = require('@risingstack/anchor')

anchor.snapshot({
  resources: [
    'deployment/my-app',
    'deployment/my-worker'
  ]
})
  .then(() => console.log('Snapshot finished'))
  .catch((err) => console.error('Snapshot error', err))
```

## API

### anchor.snapshot(options)

Backup Kubernetes resources as a Helm chart and returns a `Promise`.

- `options.resources`: Kubernetes resources to snapshot
  - **required**
  - example: `['deployment/my-app', 'deployment/my-worker']`
- `options.namespace`: Kubernetes namespace for `kubectl`
  - *optional*
  - default: `default`
- `options.name`: name of the Helm chart
  - *optional*
  - default: `my-chart`
- `options.description`: description of the Helm chart
  - *optional*
  - default: `''`
- `options.version`: version of the Helm chart
  - *optional*
  - default: `0.0.1`
- `options.overwrite`: overwrite output directory
  - *optional*
  - default: `false`
- `options.outputPath`: defines chart path, throws error when exist but overwrite is `false`
  - *optional*
  - default: `./output`

## How does it work?

1. Download Kubernetes resource via `kubectl`
2. Parse resource, extract values and transform to template
3. Outputs a Helm chart: YAML templates and `values.yaml`

## What can it extract as a template?

- Containers with name or single container
- Container environment variables with value
- Container image with tag
- Deployment replicas

**TODO:**

 - Secret
 - Service
 - ConfigMap
 - PVC
 - Ingress
 - Job

## Output

The `./output` directory will contains the templates under the `./output/templates` folder.  
Your `Values.yaml` file will look like the following:

```yaml
deploymentMyApp:
  image: my-company/my-app
  imageTag: 1f40c1f
  envLogLevel: info
  resourcesLimitsCPU: 150m
  resourcesLimitsMemory: 1536Mi
  resourcesRequestsCPU: 10m
  resourcesRequestsMemory: 128Mi
  replicas: 2
deploymentMyWorker:
  containers:
    myWorker:
      image: my-company/my-worker
      imageTag: 295a9c2
      envLogLevel: warning
      envTraceServiceName: my-worker
      resourcesLimitsCPU: 200m
      resourcesLimitsMemory: 1536Mi
      resourcesRequestsCPU: 20m
      resourcesRequestsMemory: 128Mi
    mySidecar:
      image: my-company/metrics-exporter
      imageTag: aa1c434
  replicas: 2
```

## Feature ideas:

- Versioning
- Snapshot reload by date
- Resource grouping *(sub-charts)*
- Auto-sync *(auto snapshot)*
