# Wave Software Development Challenge

Implement Wave Software Development by using Angular and python, and deploy to local machine with docker compose.

  ## Question
  1. Instructions on how to build/run your application  
      ***Follow the intructions as below to build/run the application***
  2. Answers to the following questions:
     - How did you test that your implementation was correct?  
       ***Verifying endpoints by using postman and webpage as the following description***  
     - If this application was destined for a production environment, what would you add or change?  
       ***While trying to do the following thing:***
        - ***on implement side:***
          - ***Create several configuration for dev, test and production enviroment (ex. turn off debug mode)***
          - ***Use real database instead of sqllite***
          - ***More comprehensive error handler***
          - ***Log***
        - ***on deployment side***
          - ***Use jenkins or git actions to build image file***
          - ***Adding automation test (ex. unit test, postman api test) into our pipeline***
          - ***Deploy our frontend and backend service by kubernetes to manage and scale up easily***
          - ***Integrat Grafna to monitor our service***
          - ***Log service (ex. kafka, elasticsearch)***
     - What compromises did you have to make as a result of the time constraints of this challenge?  
     ***In some case, I skipped unit tests and didn't implement comphensive error handling and using Sqllite to be our database instead of postgresql, mysql and so on.***

## Enviroment
  ``` bash
  OS: Ubuntu 22.04 LTS
  Backend: Python 3.10.4
  Frontend: Angular 13.0
  Database: SQLite (Uses SQLite due to the simple applicatoin)
  Postman: Version 9.16.0 (for api test)
  ```
## Prerequisite

* git:
    ``` bash
    sudo apt-get install git
    ```
* docker:
    ``` bash
    sudo apt install docker
    sudo usermod -aG docker $USER
    ```
* docker-compose:
    ``` bash
    sudo apt install docker-compose
    ```    
Clone repository:
``` bash
git clone git@github.com:zoeylee/se-challenge-payroll.git
```

## Deployment

Build and launch the service on local Machine:
```bash 
docker-compost up
```

Expected output:
```bash
Starting 26d58be87cf4_deployment_web_1 ... done
Attaching to deployment_payroll-api_1, 26d58be87cf4_deployment_web_1
26d58be87cf4_deployment_web_1 | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
26d58be87cf4_deployment_web_1 | /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
payroll-api_1  | Watching for file changes with StatReloader
payroll-api_1  | Performing system checks...
payroll-api_1  | 
payroll-api_1  | System check identified no issues (0 silenced).
payroll-api_1  | April 27, 2022 - 07:22:47
payroll-api_1  | Django version 3.2.13, using settings 'backend.settings'
payroll-api_1  | Starting development server at http://0.0.0.0:8000/
payroll-api_1  | Quit the server with CONTROL-C.
```
    
## Project Structure
```bash
  ├── apitest 
  │   ├── PayRoll API Test.postman_collection.json
  │   └── PayRoll Enviroment.postman_environment.json
  ├── backend
  ├── deployment
  │   ├── backend
  │   ├── deploy.sh
  │   ├── docker-compose.yml
  │   └── frontend
  ├── frontend
  ├── README.md
  └── time-report-42.csv
```

## Testing
Verify that your local installation is working by using Postman to test endpoints:
  - Postman Test
   - Import enviroment variable from `apitest` folder
      - PayRoll Enviroment.postman_environment.json
   - Import endpoints from `apitest` folder
      - PayRoll API Test.postman_collection.json
  ![image](https://user-images.githubusercontent.com/6045763/165491300-de4327a9-8761-492b-963e-e39d32ee57df.png)

Verify from website
  - Login in by using `admin` account
  ![image](https://user-images.githubusercontent.com/6045763/165491169-44badb8f-b827-4661-923d-85cadf478ebb.png)

