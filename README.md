# Hospital Management Rest Api

In order to install the necessary dependencies , they could be installed together by running the command npm i 

Dependencies used :axios, bcrypt, bcryptjs, body-parser, chai, cors, dotenv, express, http-status, jest, jsonwebtoken, mockingoose, moment, mongoose, nodemon, passport, passport-jwt, supertest

In order to run the application, use the command : npm run dev

The recommended endpoints for users to begin with are '/api/employee/register' and '/api/employee/login' to create an account and log in, with the default role being "None". It is assumed that a manager is already registered in the database, and the role cannot be assigned during registration to prevent anyone from becoming a manager. Instead, the role can be changed from "None" to "General Manager" in the database.

As a manager, I need to assign the roles of doctors and assistants to employees using '/api/manager/createDoctor' and '/api/manager/createAssistant', respectively. To do this, the employee's ID is provided in the body.

As a doctor, I have access to various endpoints such as '/api/doctor/createPatient' to create a patient, '/api/doctor/updatePatient/:id' to update a patient, '/api/doctor/assignAssistant/:id' to assign an assistant to a patient, '/api/doctor/createTreatment' to create a treatment, '/api/doctor/editTreatment/:id' to edit a treatment, and '/api/doctor/recommendTreatment/:id' to recommend a treatment to a patient. Additionally, a treatments report can be generated to view all treatments applied to a patient using '/api/doctor/getTreatmentsReport/:id'. Other endpoints for getting and deleting patients and treatments are also available.

As an assistant, I am limited to the endpoint '/api/assistant/applyTreatment/:id' to apply treatments to a patient, where the patient's ID is provided in the URL.

As a manager, I have access to the endpoints used by doctor except recommending treatments and I can update the employees, including doctors and assistants, using '/api/manager/updateEmployee/:id'. Additionally, I can obtain a report of all the doctors and their statistics using '/api/manager/getDoctorsReport'. Endpoints for getting and deleting doctors and assistants are also available.

        
