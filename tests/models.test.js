const Employee = require('../models/Employee');
const Patient = require('../models/Patients')
const Treatment = require('../models/Treatments')
const request = require('supertest');
var express = require('express');
const mockingoose = require('mockingoose');
const data = require('./fixtures/models.fixture.json')


describe('test mongoose models', () => {
    it('should return the doc with findById for employee', () => {
      const _doc = data.employee
  
      mockingoose(Employee).toReturn(_doc, 'findOne');
  
      return Employee.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
      });
    });
    it('should return the dock with findById for patient', () => {
      const _doc = data.patient

      mockingoose(Patient).toReturn(_doc, 'findOne');
      return Patient.findById({ _id: data.patient._id }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
      });
    });
    it('should return the dock with findById for treatment', () => {
      const _doc = data.treatment

      mockingoose(Treatment).toReturn(_doc, 'findOne');
      return Treatment.findById({ _id: data.treatment._id }).then(doc => {
        expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc);
      });
    });
})


