pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = '504d2abe-a0c4-4add-b6cf-561ce3347d4b'
        // NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        // REACT_APP_VERSION = "1.0.$BUILD_ID"
    }
    stages {

        stage('Docker') {
            steps {
                sh '''
                    docker build -t my-playwright .
                '''
            }
        }        

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

        stage('Deploy staging') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                }
            }
            
            steps {
                sh '''
                    netlify --version
                    echo "Deploying to Staging. site ID: $NETLIFY_SITE_ID"
                    netlify status
                    netlify deploy --dir=build --json > deploy-output.json
                    npx playwright test --reporter=html --output=test-results
                '''
            }
        }

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
