Portal Starter Kit Webapp

---

Create your own project

- To create your own project, replace to yourProjectName (CASE SENSITIVE) all occurrences of CustOM-Starter-Template-BE and portalstartertemplate.

---

Run application

- (DEV) SSO disabled; automatic reload; source maps
  ui> npm run dev
- (DEV) SSO enabled/disabled; no automatic reload; source maps
  Enable/Disable sso in /src/server/config/server/development.js
  ui> npm run build:dev
  ui> npm run server
- (DEV/PROD) SSO enabled/disabled, no automatic reload, no source maps
  Enable/Disable sso in /src/server/config/server/development.js
  ui> npm run build
  ui> npm run server

The "build" command generates the /dist folder, which contains the react app and the node server /dist/server.
The node server does the SSO authentication and loads the react app.

---

Openshift pipeline

Git

- Before starting, make sure that your project is already pushed to the repository
- In the openshift-template.yml file, update all occurrences of the repository to yours project repository, there will be a few occurrences:
  type: Git
  git:
  uri: ssh://tfs.tsl.telus.com:22/tfs/telus/BT-GIT/\_git/CustOM-Starter-Template-UI
  ref: \${BRANCH}
  contextDir: ""

Login to the openshift terminal

- Download the Openshift Client Tools from https://github.com/openshift/origin/releases
- Extract oc.exe from the downloaded zip file, copy it to any folder in your machine and add it to the %PATH%
- go to https://paas-master-west-np.tsl.telus.com/console/
- Click on the Question Mark (?) menu, and select "Command line tools"
- Copy the session token by clicking on the rightmost icon, and paste it to your local terminal
- Press enter to login to openshift

Create pipeline

- Go to the openshift directory and run the commands below.
  openshift> oc apply -f openshift-template.yml
  openshift> oc process portalstartertemplate-ui-pipeline BRANCH=master | oc apply -f -
- change the shell file permissions to allow the pipeline to execute them
  openshif> git update-index --chmod=+x openshift-template.yml run-apply-templates.sh run-deploy.sh run-deploy-prod.sh run-test.sh

Run pipeline

- Go to the openshift console in the browser, select Builds/Pipeline
- Find yourproject-pipeline and click on "Start Pipeline"

---

How to configure SSO with TEAM IDENTITY.

First you need to apply for a TMSSO.
Then the TEAM IDENTITY will reply with an endpoint (pt148, pt168, etc...).
Most likely the endpoint has already been defined on this file ui/src/server/auth/const.js
If not, then add it.

const ssoEndpoints = {
dv: 'https://securesso-dv.tsl.telus.com/opensso/SSOPOST/metaAlias/users/idp',
at: 'https://securesso-at.tsl.telus.com/opensso/SSOPOST/metaAlias/users/idp',
pt148: 'https://securesso-pt148.tsl.telus.com/opensso/SSOPOST/metaAlias/users/idp',
pt168: 'https://securesso-pt168.tsl.telus.com/opensso/SSOPOST/metaAlias/users/idp',
st: 'https://securesso-st.tsl.telus.com/opensso/SSOPOST/metaAlias/users/idp',
pr: '', // don't know these endpoints, populate later...
tr: '',
ps: ''
}

Update the config files at src\server\server.js
const enabledSSO = true;

Update the config files at ui/src/server/config/

Example: staging.js
sso: {
enabled: true,

    // Enter here the provided endpoint
    env: 'pt148',

    // The TEAM IDENTITY will request the Service Provider Metadata, which is the callback and the issuer.
    callback: 'https://portalstartertemplateui-staging-portals.paas-app-west-np.tsl.telus.com/RAPiD3/login/callback',
    issuer: 'https://portalstartertemplateui-staging-portals.paas-app-west-np.tsl.telus.com/RAPiD3'

},

They may also request a Certificate.

---

For the JWT, it is recommended to create your own pair of keys, and replace them at:

- ui/src/servers/jwt-private.pem
- ui/src/servers/jwt-public.pem
- bff/src/middlewares/jwt-public.pem

---

Production Deployment

Jenkinsfile

- uncomment out stage('Deploy prod?')
- uncomment out stage('Deploy prod')
- Open 2 terminals, go to the openshift folder and login to both Openshift terminals, staging and prod. Make sure you are in the right openshift project. To switch projects use: oc project <project-name>
- To retrieve the staging and production tokens (saTokenNp and saTokenProd), log in to their respective terminals and run "oc sa get-token builder"
- update the project's name: "portals/portalstartertemplateui" ("portals" is the openshift project)

Config the Openshift container in production

- Create the images and templates in production
  oc apply -f openshift-template.yml
- Go to the production Openshift console webapp and check if the Images have been created. https://paas-master-west.tsl.telus.com/console
- In your terminal, Create the Deployment Config
  .\run-deploy.sh production
  Note: This script launches a terminal script that might get stuck, especially if you are in the vpn. If you press enter in the terminal, it could help to finish the script. It is weird.
- Go to the production Openshift console webapp check if the Deployments and Pods have been created. However, the pod deployment will fail because there is no image to be deployed yet. Do not worry, the failure is expected.

Run the staging pipeline and deploy to Production

- Open the Staging Openshift console webapp and start the pipeline.
- If the build gets stuck or fail:
  you can open Jenkins and terminate the build.
  restart the Jenkins pod in staging
  Contact Michael Lapish [EM team], specially for permission denied errors.
- Wait the pipeline to finish. The last step is "Copy UI Image To prod"
- Notice that there is no build config in production. So, keep in mind that the staging image is the same as the production image.

Config automatic deployment in Production

- In the Production Openshift console webapp, open the edit deployment.
- check "Deploy images from an image stream tag"
- In the "Image stream tag" select your project's image and the tag "latest"
