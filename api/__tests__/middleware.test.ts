import * as middleware from '../middleware';
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';
import clearAllMocks = jest.clearAllMocks;

jest.mock('../db');

const db = require('../db');

const next = jest.fn(() => {
});

let req: Request, res: Response;

beforeEach(() => {
  clearAllMocks();
  expect(next).not.toBeCalled();

  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  res.send = jest.fn();
  res.status = jest.fn().mockImplementation(code => {
    res.statusCode = code;
    return res;
  });
});

describe('checkRecipeExists', () => {
  it('Recipe does not exists', async () => {
    db.getRecipe.mockReturnValue({});
    req.params.id = '123';

    await middleware.checkRecipeExists(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(res.send).not.toBeCalled();
    expect(res.locals.recipe).toEqual({});
  });
  it('Recipe exists', async () => {
    db.getRecipe.mockReturnValue(null);
    req.params.id = '123';

    await middleware.checkRecipeExists(req, res, next);

    expect(res.status).toBeCalledWith(404);
    expect(res.statusCode).toBe(404);
    expect(res.send).toBeCalledWith(`Recipe "${req.params.id}" does not exist`);
    expect(next).not.toBeCalled();
    expect(res.locals.recipe).toBeUndefined();
  });
});

describe('sanitiseRecipeId', () => {
  it('Sanitise number', async () => {
    const id = 123;
    req.body.id = id;

    await middleware.sanitiseRecipeId(req, res, next);
    expect(next).toBeCalledTimes(1);

    expect(req.body.id).toEqual(String(id));
  });
  it('Sanitise string', async () => {
    const id = '123';
    req.body.id = id;

    await middleware.sanitiseRecipeId(req, res, next);
    expect(next).toBeCalledTimes(1);
    expect(req.body.id).toEqual(id);
  });
});

describe('validateRecipeDoesNotExist', () => {
  it('Recipe exists', async () => {
    db.getRecipe.mockReturnValue({});
    req.body.id = '123';

    await middleware.validateRecipeDoesNotExist(req, res, next);

    expect(res.status).toBeCalledWith(409);
    expect(res.statusCode).toBe(409);
    expect(res.send).toBeCalledWith(`Recipe with id "${req.body.id}" already exists`);
    expect(next).not.toBeCalled();
  });
  it('Recipe does not exist', async () => {
    db.getRecipe.mockReturnValue(null);
    req.body.id = '123';

    await middleware.validateRecipeDoesNotExist(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(res.send).not.toBeCalled();
  });
});