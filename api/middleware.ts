import { getRecipe } from './db';
import { NextFunction, Request, Response } from 'express';

export const checkRecipeExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return res.status(404).send(`Recipe "${id}" does not exist`);
  }

  res.locals.recipe = recipe;
  next();
};

export const sanitiseRecipeId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body.id = String(req.body.id);
  next();
};

export const validateRecipeDoesNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.body.id;
  const recipe = await getRecipe(id);

  if (recipe) {
    return res.status(409).send(`Recipe with id "${id}" already exists`);
  }

  next();
};
