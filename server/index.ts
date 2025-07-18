import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/db.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all recipes with optional search and filter
app.get('/api/recipes', async (req, res) => {
  try {
    console.log('GET /api/recipes - Query params:', req.query);
    
    let query = db.selectFrom('recipes');
    
    if (req.query.search) {
      const searchTerm = `%${req.query.search}%`;
      query = query.where((eb) =>
        eb.or([
          eb('title', 'like', searchTerm),
          eb('description', 'like', searchTerm),
          eb('ingredients', 'like', searchTerm),
          eb('category', 'like', searchTerm)
        ])
      );
    }
    
    if (req.query.category) {
      query = query.where('category', '=', req.query.category as string);
    }
    
    if (req.query.difficulty) {
      query = query.where('difficulty', '=', req.query.difficulty as string);
    }
    
    if (req.query.favorites === 'true') {
      query = query.where('is_favorite', '=', 1);
    }
    
    const recipes = await query.selectAll().orderBy('created_at', 'desc').execute();
    console.log('Found recipes:', recipes.length);
    
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('GET /api/recipes/:id - ID:', id);
    
    const recipe = await db
      .selectFrom('recipes')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    console.log('Found recipe:', recipe.title);
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Create new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    console.log('POST /api/recipes - Body:', req.body);
    
    const { title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category, image_url } = req.body;
    
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Title, ingredients, and instructions are required' });
    }
    
    const result = await db
      .insertInto('recipes')
      .values({
        title,
        description: description || null,
        ingredients,
        instructions,
        prep_time: prep_time || null,
        cook_time: cook_time || null,
        servings: servings || null,
        difficulty: difficulty || null,
        category: category || null,
        image_url: image_url || null,
        is_favorite: 0
      })
      .executeTakeFirst();
    
    const newRecipe = await db
      .selectFrom('recipes')
      .selectAll()
      .where('id', '=', Number(result.insertId))
      .executeTakeFirst();
    
    console.log('Created recipe:', newRecipe?.title);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Update recipe
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('PUT /api/recipes/:id - ID:', id, 'Body:', req.body);
    
    const { title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category, image_url } = req.body;
    
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Title, ingredients, and instructions are required' });
    }
    
    await db
      .updateTable('recipes')
      .set({
        title,
        description: description || null,
        ingredients,
        instructions,
        prep_time: prep_time || null,
        cook_time: cook_time || null,
        servings: servings || null,
        difficulty: difficulty || null,
        category: category || null,
        image_url: image_url || null,
        updated_at: new Date().toISOString()
      })
      .where('id', '=', id)
      .execute();
    
    const updatedRecipe = await db
      .selectFrom('recipes')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    console.log('Updated recipe:', updatedRecipe.title);
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete recipe
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('DELETE /api/recipes/:id - ID:', id);
    
    const result = await db
      .deleteFrom('recipes')
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (result.numDeletedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    console.log('Deleted recipe ID:', id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// Toggle favorite status
app.patch('/api/recipes/:id/favorite', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('PATCH /api/recipes/:id/favorite - ID:', id);
    
    const recipe = await db
      .selectFrom('recipes')
      .select('is_favorite')
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const newFavoriteStatus = recipe.is_favorite === 1 ? 0 : 1;
    
    await db
      .updateTable('recipes')
      .set({
        is_favorite: newFavoriteStatus,
        updated_at: new Date().toISOString()
      })
      .where('id', '=', id)
      .execute();
    
    const updatedRecipe = await db
      .selectFrom('recipes')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    
    console.log('Toggled favorite for recipe:', updatedRecipe?.title, 'to:', newFavoriteStatus);
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

// Get recipe categories
app.get('/api/categories', async (req, res) => {
  try {
    console.log('GET /api/categories');
    
    const categories = await db
      .selectFrom('recipes')
      .select('category')
      .distinct()
      .where('category', 'is not', null)
      .execute();
    
    const categoryList = categories.map(c => c.category).filter(Boolean);
    console.log('Found categories:', categoryList);
    
    res.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}