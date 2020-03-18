#!/bin/sh
set -o nounset -o errexit

## Runs `yarn run test` against a container on OpenShift. Used by the Test stage of the Jenkinsfile.
## Usage: ./run-test.sh telus-isomorphic-starter-kit-ui latest

CONTAINER_NAME=${1}
VERSION=${2:-latest}
IMAGESTREAM=`oc get imagestream ${CONTAINER_NAME} -o='jsonpath={.status.dockerImageRepository}'`

oc run ${CONTAINER_NAME}-${VERSION} \
  --image=${IMAGESTREAM}:${VERSION} \
  --rm=true \
  --attach=true \
  --restart=Never \
  --overrides='{
    "apiVersion":"v1",
    "spec":{
      "containers":[{
        "name": "'${CONTAINER_NAME}'-'${VERSION}'",
        "image": "'${IMAGESTREAM}':'${VERSION}'",
        "command":["yarn", "run", "unit"],
        "env":[{
          "name":"VERSION",
          "value":"'${VERSION}'"
        }]
      }]
    }
  }'
