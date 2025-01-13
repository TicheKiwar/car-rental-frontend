pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker-compose -f docker-compose-f.yml build frontend'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    docker-compose -f docker-compose-f.yml down || true
                    docker-compose -f docker-compose-f.yml up -d
                '''
            }
        }
        
    }
}