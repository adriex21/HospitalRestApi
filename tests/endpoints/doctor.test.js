const Employee = require('../../models/Employee')
const Patient = require('../../models/Patients')
const Treatment = require('../../models/Treatments')
const mockingoose = require('mockingoose');
const data = require('../fixtures/doctor.fixture.json')
require('dotenv').config()
const server = require('../../app')
const supertest = require('supertest')

jest.mock("../../middlewares/auth", () => () => (
    (req, res, next) => {
      req.employee = {
          ...req,
          "_id": "507f1911110c19729de860ss",
          "name":"George",
          "role": "Doctor"
      }
      next()
    }
));



describe('test for doctor endpoints' , () => {

    let _doc_made_request;
    let _doc_added_to_patient;

    beforeEach(() => {
      _doc_made_request     = data._doc_made_request
      _doc_added_to_patient = data._doc_added_to_patient
      
      const finderMock = query => {    
        if (query.getQuery()._id === '507f1911110c19729de860ea') {
          return _doc_added_to_patient;
        }
        return _doc_made_request
      };
     
      mockingoose(Employee).toReturn(finderMock, 'findOne');
    })

    it('should create a new patient', async () => {
        const request_data          = data.request_data_create_patient
        mockingoose(Patient).toReturn(false, 'findOne');
        mockingoose(Patient).toReturn({msg:'Patient was created'}, 'createOne');

        const response = await supertest(server)
          .post('/api/doctor/createPatient')
          .send(request_data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({msg:'Patient was created'});
      });

      it('should update a patient', async () => {
        const request_data          = data.request_data_create_patient
        mockingoose(Patient).toReturn({ message: 'Patient updated' }, 'findOneAndUpdate');

        const response = await supertest(server)
          .put('/api/doctor/updatePatient/50111gh1110c19g59de860ea')
          .send(request_data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({ message: 'Patient updated' });
      });

      it('should assign an assistant a patient', async () => {
        const request_data          = data.request_data_assign_assistant
        const _doc_made_request     = data._doc_made_request
        const _assistant_added_to_patient = data._assistant_added_to_patient
        
        const finderMock = query => {    
          if (query.getQuery()._id === '507f1671131c19729de860ea') {
            return _assistant_added_to_patient;
          }
          return _doc_made_request
        };
       
        mockingoose(Employee).toReturn(finderMock, 'findOne');
        mockingoose(Patient).toReturn({}, 'save');
        mockingoose(Patient).toReturn({ message: 'Assistant assigned', assistants: [], phone: "asf", adress: "adfs", birthDate: "01/01/1999", gender: "Male", name: "dfgasdf"}, 'findOne');

        const response = await supertest(server)
          .put('/api/doctor/assignAssistant/507f1911110c19729de860ss')
          .send(request_data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({ message: 'Assistant assigned' });
      });

      it('should create a treatment', async () => {
        const request_data          = data.request_data_create_treatment
        mockingoose(Treatment).toReturn({msg:'Treatment was created'}, 'createOne');
       
       
        const response = await supertest(server)
          .post('/api/doctor/createTreatment')
          .send(request_data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({ msg: 'Treatment was created' });
      });

      it('should update a treatment', async () => {
        const request_data          = data.request_data_create_treatment
        mockingoose(Treatment).toReturn({ msg: 'Treatment updated' }, 'findOneAndUpdate');

        const response = await supertest(server)
          .put('/api/doctor/editTreatment/137f1671131c19729de860gh')
          .send(request_data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
        expect(JSON.parse(response?.text)).toMatchObject({ msg: 'Treatment updated' });
      });

      it('should recommend a treatment to a patient', async () => {
        const request_data          = data.request_data_recommend_treatment
        const _doc_made_request     = data._doc_made_request
        const _treatment_added_to_patient = data.treatment_created
        
        const finderMock = query => {    
          if (query.getQuery()._id === '137f1671131c19729de860gh') {
            return  _treatment_added_to_patient;
          }
          return _doc_made_request
        };
       
        mockingoose(Treatment).toReturn(finderMock, 'findOne');
        mockingoose(Patient).toReturn({}, 'save');
        mockingoose(Patient).toReturn({ message: 'Treatment assigned', treatmentsRecommended:[],assistants: [], phone: "asf", adress: "adfs", birthDate: "01/01/1999", gender: "Male", name: "dfgasdf"}, 'findOne');

        const response = await supertest(server)
          .put('/api/doctor/recommendTreatment/50111gh1110c19g59de860ea')
          .send(request_data)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({ message: 'Treatment assigned' });
      });

      it('should return a patient', async () => {
        const _doc_made_request     = data._doc_made_request
        const patient = data.patient_created

        const finderMock = query => {    
          if (query.getQuery()._id === '641ede06c3f384bdc59f865f') {
            return  patient;
          }
          return _doc_made_request
        };
        
        mockingoose(Patient).toReturn(finderMock, 'findOne');
      
            const response = await supertest(server)
          .get('/api/doctor/getPatient/641ede06c3f384bdc59f865f')
          .send(patient)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject(patient);
       
      });

      it('should delete a patient', async () => {
        const patient = data.patient_created
        
        mockingoose(Patient).toReturn(patient, 'findOne');
        mockingoose(Patient).toReturn({ msg: 'Patient deleted'}, 'findOneAndDelete');

      
            const response = await supertest(server)
          .delete('/api/doctor/deletePatient/641ede06c3f384bdc59f865f')
          .send(patient)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({ msg: 'Patient deleted'});
       
      });


      it('should return a treatment', async () => {
        const _doc_made_request     = data._doc_made_request
        const treatment = data.treatment_created

        const finderMock = query => {    
          if (query.getQuery()._id === '641ee0564fbac6b24a25ae47') {
            return  treatment;
          }
          return _doc_made_request
        };
        
        mockingoose(Treatment).toReturn(finderMock, 'findOne');
      
            const response = await supertest(server)
          .get('/api/doctor/getTreatment/641ee0564fbac6b24a25ae47')
          .send(treatment)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject(treatment);
       
      });

      it('should delete a treatment', async () => {
        const treatment = data.treatment_created

        const finderMock = query => {    
          if (query.getQuery()._id === '641ee0564fbac6b24a25ae47') {
            return  treatment;
          }
          return _doc_made_request
        };
        
        
        mockingoose(Treatment).toReturn(finderMock, 'findOne');
        mockingoose(Treatment).toReturn({ msg: 'Treatment deleted'}, 'findOneAndDelete');

      
            const response = await supertest(server)
          .delete('/api/doctor/deleteTreatment/641ede06c3f384bdc59f865f')
          .send(treatment)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')

        expect(JSON.parse(response?.text)).toMatchObject({ msg: 'Treatment deleted'});
       
      });

}) 