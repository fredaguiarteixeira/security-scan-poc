String buildVersion = env.BUILD_NUMBER

try {
  String gitCommitId

  stage('Checkout') {
    node {
      sh "oc project ${env.PROJECT_NAME}"

      checkout scm
      stash includes: 'openshift/*', name: 'scripts'

      String gitCommitNum = sh(returnStdout: true, script: "git rev-list HEAD --count").trim()
      String gitShortId = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
      buildVersion = gitCommitNum + '-' + gitShortId

      gitCommitId = sh(returnStdout: true, script: "git rev-parse HEAD").trim()
    }
  }

  stage('Apply Templates') {
    applyTemplates()
  }

  stage('Build') {
    parallel(
      failFast: true,
      'Build UI':{
       build(
          name: 'portalstartertemplate-ui',
          buildVersion: buildVersion,
          gitCommitId: gitCommitId
       )
     }
    )
  }

  // stage('Test UI') {
  //   parallel(
  //     'Test UI':{
  //       test(
  //         name: 'portalstartertemplate-ui',
  //         buildVersion: buildVersion
  //       )
  //     }
  //   )
  // }

  stage('Deploy Staging') {
    deploy(
      buildVersion: buildVersion,
      environment: 'staging',
      numReplicas: 1
    )
  }

  
  // stage('Deploy prod?') {
  //   input 'Deploy prod?'
  // }

  // stage('Deploy prod') {

  //   // node {
  //   //     saTokenNp = sh (script: 'oc sa get-token builder', returnStdout: true).trim()
  //   //     sh "echo --------------------------- staging saToken: ${saTokenNp}"
  //   // }
  //   saTokenNp = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJwb3J0YWxzIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImJ1aWxkZXItdG9rZW4tZ2ZzYm4iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiYnVpbGRlciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImE2ZGJhNjU3LTJlNDctMTFlOS1hNjg3LTAwNTA1Njg5N2NlZCIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpwb3J0YWxzOmJ1aWxkZXIifQ.uew4wFkTQuyHOkWIDgo52iT3RkG_4PpaEZ30hDeasNA1A3GXvKamUaDYnCZ52IzxcAF6PN9LJjzJkK7SC5wT5WT3m6Wv3oB5rI17bqXsWfKiOdjD9_2H9rRMmxdS71e_s6PA3QLq7QS7lBwLwDBu_rnwvV83MWTKFvJ3hr1aHYOyRrwFTkBVcFAKoO1pMneG3HsiBJXf50eJYpaijpFBPHyYE2k5sGhiIivSQck2XPykRTbiVfyTS--fPa-DfxdNnKUR9A0j0YV1m-IbdHb652mWtSyZN6T98GK8m4gwg-qupilV2qr-RyrdbDabRVer-NwXhLXnVicj6YZYyRBE2A'
  //   saTokenProd = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJwb3J0YWxzIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImJ1aWxkZXItdG9rZW4tdmsyc3giLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiYnVpbGRlciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjMxNjNmZWZmLTRiNDUtMTFlOS1iMDk3LTAwNTA1NmEzMzdlZSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpwb3J0YWxzOmJ1aWxkZXIifQ.SyoeaKFXqPi3wEEroqfq90D12MmXvFbGeJRGoJl1ursJeJHhNWZiaZqkrK7YhYYQ8vP83HxbePL_f-dXRcigMCzy03_rRJuf6IXa3WrVVBnnw1F5YEI_9XZb-q2c0DANl1sjgPyuh-MsFsB6JqVhPkh_8WS0XhmrZmkn_zMfCAl-azc1jzgefKsGJOVMlwDj9CjlRB9glTAjAbaWRwd5og3vE1FFUwg7-wm1T-EXs8YldUhlYg8PfBCjGGnIMlhgFkqpN6bsIMQmmbHb-mP4C3fHKlyFb3d7iP8628RzJf28-lHS-QBP616srQUrxdqRXmus-9t12ee1ZqoROVxULA'

  //   podTemplate(label: 'skopeo',
  //     inheritFrom: 'maven',
  //     serviceAccount: 'jenkins',
  //     namespace: 'em-jenkins',
  //     cloud: 'openshift',
  //     containers: [
  //       containerTemplate(name: 'jnlp', image: 'repomgr.tsl.telus.com:19901/telus/jenkins-slave-image-mgmt:3.6.0')
  //     ],
  //     annotations: [
  //       podAnnotation(key: "project", value: "skopeo-test")
  //     ]) {
  //         node('skopeo') {
  //           stage('Copy UI Image to prod') {
  //             sh("""
  //               skopeo --debug copy docker://100.65.135.139:5000/portals/portalstartertemplate-ui \
  //               docker://docker-registry-default.paas-app-west.tsl.telus.com:443/portals/portalstartertemplate-ui --src-creds=builder:${saTokenNp} \
  //               --dest-creds=builder:${saTokenProd} --src-tls-verify=false --dest-tls-verify=false 
  //             """)
  //           }
  //       }
  //     }
  // }

  currentBuild.result = 'SUCCESS'
}
catch (org.jenkinsci.plugins.workflow.steps.FlowInterruptedException flowError) {
  currentBuild.result = 'ABORTED'
}
catch (err) {
  currentBuild.result = 'FAILURE'
  consoleUrl = env.BUILD_URL ? "(${env.BUILD_URL}console)" : '';
  notifyBuild(
    message:  "Build failed ${consoleUrl}",
    color: '#FF0000',
    buildVersion: buildVersion
  )
  throw err
}
finally {
  if (currentBuild.result == 'SUCCESS') {
    notifyBuild(
      message: "Production deploy successful",
      color: '#00FF00',
      buildVersion: buildVersion
    )
  }
}

def applyTemplates() {
  node {
    unstash 'scripts'
    sh("openshift/run-apply-templates.sh")
  }
}

def build(Map attrs) {
  node {
    boolean imageTagExists = sh(
      returnStatus: true,
      script: "oc get istag ${attrs.name}:${attrs.buildVersion}"
    ) == 0

    if (!imageTagExists) {
      openshiftBuild(
        buildConfig: attrs.name,
        commitID: attrs.gitCommitId,
        waitTime: '3600000'
      )

      openshiftTag(
        sourceStream: attrs.name,
        destinationStream: attrs.name,
        sourceTag: 'latest',
        destinationTag: attrs.buildVersion,
        namespace: env.PROJECT_NAME
      )
    }
  }
}

def test(Map attrs) {
  node {
    unstash 'scripts'
    sh("./openshift/run-test.sh ${attrs.name} ${attrs.buildVersion}")
  }
}

def deploy(Map attrs) {
  node {
    unstash 'scripts'
    sh("""
      ./openshift/run-deploy.sh ${attrs.environment} ${attrs.buildVersion} ${attrs.numReplicas}
    """)

    openshiftVerifyDeployment(
      deploymentConfig: "portalstartertemplate-${attrs.environment}-ui",
      waitTime: '1800000'
    )
  }
}

def deployProd(Map attrs) {
  node {
    unstash 'scripts'
    sh("""
      ./openshift/run-deploy-prod.sh ${attrs.saToken} ${attrs.namespace} ${attrs.namespace}
    """)
  }
}

def loadTest(Map attrs) {
  node {
    unstash 'scripts'
    sh("./openshift/run-load-test.sh ${attrs.environment} ${attrs.buildVersion}")
  }
}

def notifyBuild(Map attrs) {

}
