import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';
import app from '../app';
import supertest from 'supertest';

jest.mock('../middleware', () => ({
  checkRecipeExists: jest.fn((req, res, next) => {
    res.locals.recipe = { id: req.params.id };
    next();
  }),
  sanitiseRecipeId: jest.fn((req, res, next) => {
    next();
  }),
  validateRecipeDoesNotExist: jest.fn((req, res, next) => {
    next();
  }),
}));
jest.mock('../db');

const request = supertest(app);
const db = require('../db');

let req: Request, res: Response;

beforeEach(() => {
  req = httpMocks.createRequest();

  res = httpMocks.createResponse();
  res.send = jest.fn();
  res.status = jest.fn().mockImplementation((code) => {
    res.statusCode = code;
    return res;
  });
});

describe('/recipes', () => {
  const route = '/recipes';

  it('GET', async () => {
    const val = [{ id: '123' }, { id: '456' }, { id: '789' }];
    db.getAllRecipes.mockReturnValue(val);

    const res = await request.get(route);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(val);
  });
  describe('POST', () => {
    it('Good', async () => {
      db.insertRecipe.mockReturnValue({ acknowledged: true });

      await request.post(route).send({ id: 123 }).expect(201);
    });
    it('Bad', async () => {
      db.insertRecipe.mockReturnValue({ acknowledged: false });

      const id = 123;
      const res = await request.post(route).send({ id });

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual(`Failed to insert recipe "${id}"`);
    });
  });
});
describe('/recipes/:id', () => {
  const route = '/recipes/123';

  it('GET', async () => {
    const res = await request.get(route);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ id: '123' });
  });
  describe('DELETE', () => {
    it('Good', async () => {
      const val = { acknowledged: true, deletedCount: 1 };
      db.deleteRecipe.mockReturnValue(val);

      const res = await request.delete(route);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({});
    });
    it('Bad', async () => {
      const val = { acknowledged: false, deletedCount: 0 };
      db.deleteRecipe.mockReturnValue(val);

      const id = 123;
      const res = await request.delete(route);

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual(`Failed to delete recipe "${id}"`);
    });
  });
});
