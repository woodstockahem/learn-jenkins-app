pipeline {
    agent any

    environment {
    //     // NETLIFY_SITE_ID = '504d2abe-a0c4-4add-b6cf-561ce3347d4b'
    //     // NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    //     // REACT_APP_VERSION = "1.0.$BUILD_ID"
    //     AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
    //     AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
           AWS_DEFAULT_REGION = 'eu-north-1'
           AWS_ECS_CLUSTER = 'LearnJenkinsApp-Cluster-Prod'
           AWS_ECS_SERVICE = 'LearnJenkinsApp-Service-Prod'
           AWS_ECS_TASK_DEFINITION = 'LearnJenkinsApp-TaskDefinition-Prod'
    }

    stages {

        stage('Build') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }

        stage('Build Docker Image') {
              agent {
                docker {
                    image 'amazon/aws-cli'
                    args "-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=''"
                    reuseNode true
                }
            }
            steps {
                sh '''
                    amazon-linux-extras install docker
                    docker build -t myjenkinsapp .
                '''
            }
        } 

        stage('Deploy to AWS') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    args "-u root --entrypoint=''"
                    reuseNode true
                }
            }
            
            steps {
                withCredentials([usernamePassword(credentialsId: 'my-aws', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                      // some block
                      sh '''
                         aws --version
                         yum install -y jq
                         LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition-prod.json | jq '.taskDefinition.revision')
                         aws ecs update-service --cluster $AWS_ECS_CLUSTER --service $AWS_ECS_SERVICE --task-definition $AWS_ECS_TASK_DEFINITION:$LATEST_TD_REVISION
                         aws ecs wait services-stable --cluster $AWS_ECS_CLUSTER --services $AWS_ECS_SERVICE
                      '''
                }
                
            }
        }

/*
        stage('Tests') {
            parallel {
                stage('Unit Tests') {
                    agent {
                        docker {
                            image 'node:18-bullseye'
                            reuseNode true
                        }
                    }
                    steps {
                        sh '''
                            test -f build/index.html
                            npm test
                        '''
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }

                stage('E2E Tests') {
                    agent {
                        docker {
                            image 'my-playwright'
                            reuseNode true
                        }
                    }
                    steps {
                        sh '''
                            node_modules/.bin/serve -s build &
                            sleep 10
                            npx playwright test --reporter=html --output=test-results
                        '''
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: false,
                                icon: '',
                                keepAll: false,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright_Local_Report',
                                reportTitles: '',
                                useWrapperFileDirectly: true,
                            ])
                        }
                    }
                }
            }
        }
*/
/*
        stage('Deploy staging') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                }
            }
            environment {
                    CI_ENVIRONMENT_URL = 'STAGING_URL_PLACEHOLDER'
            }

            steps {
                sh '''
                    netlify --version
                    echo "Deploying to Staging. site ID: $NETLIFY_SITE_ID"
                    netlify status
                    netlify deploy --dir=build --json > deploy-output.json
                    CI_ENVIRONMENT_URL=$(node-jq -r '.deploy_url' deploy-output.json)
                    npx playwright test --reporter=html --output=test-results
                '''
            }
        }
*/
/*
        stage('Deploy Prod') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
                    reuseNode true
                }
            }
            environment {
                CI_ENVIRONMENT_URL = 'https://chimerical-lebkuchen-53d975.netlify.app'
            }
            steps {
                sh '''
                    npx playwright test --reporter=html --output=test-results
                '''    
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: false,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright_E2E_Report',
                        reportTitles: '',
                        useWrapperFileDirectly: true,
                    ])
                }
            }
        }
        */
    }
}
