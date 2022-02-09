import { MongoClient } from 'mongodb';
import env from './config';

const url = `mongodb://${env.MONGODB_HOST}:${env.MONGODB_PORT}/${env.MONGODB_DB_NAME}`;
const client = new MongoClient(url);

const connect = async () => {
  await client.connect();

  return client.db();
};

const recipesConnect = async () => {
  return (await connect()).collection('recipes');
};

export const getAllRecipes = async () => {
  return (await recipesConnect()).find().toArray();
};

export const getRecipe = async (id: String) => {
  return (await recipesConnect()).findOne(
    { id: id },
    { projection: { _id: 0 } },
  );
};

export const insertRecipe = async (recipe: object) => {
  return (await recipesConnect()).insertOne(recipe);
};

export const deleteRecipe = async (id: String) => {
  return (await recipesConnect()).deleteOne({ id: id });
};
