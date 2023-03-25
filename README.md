# TremendHomework

In order to install the necessary dependencies , they could all be installed at once using npm i 

Dependencies used :axios, bcrypt, bcryptjs, body-parser, chai, cors, dotenv, express, http-status, jest, jsonwebtoken, mockingoose, moment, mongoose, nodemon, passport, passport-jwt, supertest

In order to run the application, use the command : npm run dev

The endpoints an user should begin with are : /api/employee/register, /api/employee/login in order to create an account and login, the default role will be "None"

We assume we have a manager already registered in the database, we cannot asign the role when we register because everyone could become a manager. (From the database we change the role from "None" to "General Manager"

In order to become a doctor or an assistant, as a manager I need to assign those roles to the employee using : /api/manager/createDoctor - for this we provide in the body the id of the employee that will become a doctor,  /api/manager/createAssistant - the same as previous

As a doctor  I can - : /api/doctor/createPatient,  /api/doctor/updatePatient/:id by providing the patient id in the url, /api/doctor/assignAssistant/:id, to asssign an assistant or more, to create a treatment /api/doctor/createTreatment, to edit the treatment /api/doctor/editTreatment/:id and recommend the treatment to a patient /api/doctor/recommendTreatment/:id, the id in the url is the patient we want to recommend
the treatment to and the treatment id is provided in the body, and also to get a treatments report where I can see all the treatments applied to a patient /api/doctor/getTreatmentsReport/:id
. Besides those endpoints we have some endpoints for get and delete the patients and treatments.

As an assistant I can only apply the treatment to a patient : /api/assistant/applyTreatment/:id , the url id is the patient we want to apply a treatment for

As a manager I can update the employees ( doctors and assistants ) : /api/manager/updateEmployee/:id, I can get a report with all the doctors and a statistics /api/manager/getDoctorsReport, 
and get and deletes for doctors and assistants.

        
