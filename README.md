# helm-backup

Creates Helm chart from running Kubernetes resources.  
Detect and separates configurable values from templates.

## How to use it?

**Requirements**

- Node.js
- kubectl

```sh
npm install @risingstack/helm-backup
```

```js
const helmBackup = require('@risingstack/helm-backup')

const NAMESPACE = 'staging'
const DEPLOYMENT = 'access-web'

helmBackup.backup.deployment(NAMESPACE, DEPLOYMENT)
  .then(() => console.log('Backup finished'))
  .catch((err) => console.error('Backup error', err))
```

## How does it work?

1. Download Kubernetes resource
2. Parse resource and transform to templates
3. Outputs a Helm chart: YAML templates and `values.yaml`

## What can it extract as a template?

- Containers with name
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

## Future ideas:

- Versioning
- Snapshot reload by date
- Resource grouping *(sub-charts)*
- Auto-sync *(auto backup)*
