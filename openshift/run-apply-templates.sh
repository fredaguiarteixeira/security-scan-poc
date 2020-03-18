#!/bin/sh
set -o nounset -o errexit

## Applies the OpenShift templates and processes them for your currently configured branch
## Usage: ./run-apply-templates.sh

cd `dirname $0`

CURRENT_BRANCH=`oc get bc portalstartertemplate-ui-pipeline -o='jsonpath={.spec.source.git.ref}'`

oc apply -f openshift-template.yml
oc process portalstartertemplate-ui-pipeline BRANCH=${CURRENT_BRANCH} | oc apply -f -
