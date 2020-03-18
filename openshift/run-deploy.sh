#!/bin/sh
set -o nounset -o errexit

## Deploy a version to a specific OpenShift environment. Used by the Deploy stage of the Jenkinsfile.
## Usage: ./run-deploy.sh staging latest 1

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
NUM_REPLICAS=${3:-1}
IMAGESTREAM=`oc get imagestream portalstartertemplate-ui -o='jsonpath={.status.dockerImageRepository}'`

# workaround for https://github.com/kubernetes/kubernetes/issues/34413
if oc get hpa/portalstartertemplate-${ENVIRONMENT}-ui > /dev/null 2>&1
then
  oc delete hpa/portalstartertemplate-${ENVIRONMENT}-ui
fi

oc process portalstartertemplate-ui \
  -p VERSION=${VERSION} \
  -p ENVIRONMENT=${ENVIRONMENT} \
  -p DOCKER_REGISTRY="${IMAGESTREAM}:${VERSION}"  \
  -p NUM_REPLICAS=${NUM_REPLICAS} \
  -o yaml | oc apply -f -
