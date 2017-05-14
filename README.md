# helm-backup

Creates Helm chart from running Kubernetes resources.  
Detect and separates configurable values from templates.

## How to use it?

### Requirements

- Node.js, `>= v6`
- kubectl

```sh
npm install @risingstack/helm-backup
```

### Example

For more detailed examples check out `./example` folder.

```js
const helmBackup = require('@risingstack/helm-backup')

helmBackup.backup({
  resources: [
    'deployment/my-app',
    'deployment/my-worker'
  ]
})
  .then(() => console.log('Backup finished'))
  .catch((err) => console.error('Backup error', err))
```

### API

#### helmBackup.backup(options)

Backup Kubernetes resources as a Helm chart and returns a `Promise`.

- `options.overwrite`: overwrite output directory
  - optional
  - default: `false`
- `options.outputPath`: defines chart path, throws error when exist but overwrite is `false`
  - optional
  - default: `./output`
- `options.name`: name of the Helm chart
  - optional
  - default: `my-chart`
- `options.description`: description of the Helm chart
  - optional
  - default: `''`
- `options.version`: version of the Helm chart
  - optional
  - default: `0.0.1`
- `options.namespace`: Kubernetes namespace for `kubectl`
  - optional
  - default: `default`
- `resources`: Kubernetes resources to backup
  - required
  - example: `['deployment/my-app', 'deployment/my-worker']`

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

## Future ideas:

- Versioning
- Snapshot reload by date
- Resource grouping *(sub-charts)*
- Auto-sync *(auto backup)*
