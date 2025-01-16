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
                sh 'docker-compose -f docker-compose-f.yml build frontend'
                echo 'build application...'
            }
        }
        
        stage('Stop and Remove Previous Containers') {
            steps {
                // Detener y eliminar contenedores existentes
                sh '''
                    docker-compose -f docker-compose-f.yml down || true
                '''
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                // Reiniciar contenedores con puertos fijos
                sh '''
                    docker-compose -f docker-compose-f.yml up -d
                '''
            }
        }
    }
}
