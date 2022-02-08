import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';
import { app } from '../index';
import supertest from 'supertest';

jest.mock('../middleware');
jest.mock('../db');

const request = supertest(app);
const middleware = require('../middleware');
const db = require('../db');

let req: Request, res: Response;

beforeEach(() => {
  req = httpMocks.createRequest();

  res = httpMocks.createResponse();
  res.send = jest.fn();
  res.status = jest.fn().mockImplementation(code => {
    res.statusCode = code;
    return res;
  });
});

describe('/recipes', () => {
  const route = '/recipes';

  it('GET', async () => {
    await db.getAllRecipes.mockReturnValue({ 1: {}, 2: {}, 3: {} });
    await request.get(route).expect(200);
  });
});