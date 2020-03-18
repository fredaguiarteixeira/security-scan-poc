#!/bin/sh
set -o nounset -o errexit

## Installs the build pipeline for a given branch (default: master) in your currently selected OpenShift project
## See: README.md

BRANCH=${1:-master}

cd `dirname $0`

# Github Token
oc secrets new-basicauth github-secret​ --username=TID --password=PASSWORD --gitconfig=C:\Users\TID\.gitconfig

# Install templates
oc apply -f openshift-template.yml

# Configure build pipeline against the defined branch
oc process portalstartertemplate-ui-pipeline BRANCH=${BRANCH} | oc apply -f -

# Trigger initial build
oc start-build portalstartertemplate-ui-pipeline
