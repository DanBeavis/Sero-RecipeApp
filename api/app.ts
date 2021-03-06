import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { deleteRecipe, getAllRecipes, insertRecipe } from './db';
import {
  checkRecipeExists,
  sanitiseRecipeId,
  validateRecipeDoesNotExist,
} from './middleware';

const app = express();
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.get('/recipes', async (req: Request, res: Response) => {
  const recipes = await getAllRecipes();

  res.send(recipes);
});

app.get('/recipes/:id', checkRecipeExists, (req: Request, res: Response) => {
  res.send(res.locals.recipe);
});

app.post(
  '/recipes',
  sanitiseRecipeId,
  validateRecipeDoesNotExist,
  async (req: Request, res: Response) => {
    const recipe = req.body;
    const insertResult = await insertRecipe(recipe);

    if (!insertResult.acknowledged) {
      return res.status(500).send(`Failed to insert recipe "${recipe.id}"`);
    }

    res.status(201).send();
  },
);

app.delete(
  '/recipes/:id',
  checkRecipeExists,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const deleteResult = await deleteRecipe(id);

    if (!deleteResult.acknowledged || deleteResult.deletedCount === 0) {
      return res.status(500).send(`Failed to delete recipe "${id}"`);
    }

    res.send();
  },
);

export default app;
