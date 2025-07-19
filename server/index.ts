import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/db.js';
import { authenticateToken, optionalAuth, AuthRequest } from './middleware/auth.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use('/api/auth', authRoutes);

// Get all recipes with optional search and filter
app.get('/api/recipes', optionalAuth, async (req: AuthRequest, res) => {
  try {
    console.log('GET /api/recipes - Query params:', req.query, 'User ID:', req.userId);
    
    let query = db.selectFrom('recipes');
    
    // Only show public recipes or user's own recipes
    if (req.userId) {
      query = query.where((eb) =>
        eb.or([
          eb('user_id', 'is', null), // Public recipes
          eb('user_id', '=', req.userId!) // User's own recipes
        ])
      );
    } else {
      query = query.where('user_id', 'is', null); // Only public recipes for anonymous users
    }
    
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
    
    if (req.query.favorites === 'true' && req.userId) {
      query = query.where('is_favorite', '=', 1).where('user_id', '=', req.userId);
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
app.get('/api/recipes/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('GET /api/recipes/:id - ID:', id, 'User ID:', req.userId);
    
    let query = db.selectFrom('recipes').selectAll().where('id', '=', id);
    
    // Only allow access to public recipes or user's own recipes
    if (req.userId) {
      query = query.where((eb) =>
        eb.or([
          eb('user_id', 'is', null),
          eb('user_id', '=', req.userId!)
        ])
      );
    } else {
      query = query.where('user_id', 'is', null);
    }
    
    const recipe = await query.executeTakeFirst();
    
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

// Create new recipe (requires auth)
app.post('/api/recipes', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('POST /api/recipes - Body:', req.body, 'User ID:', req.userId);
    
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
        is_favorite: 0,
        user_id: req.userId!
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

// Update recipe (requires auth and ownership)
app.put('/api/recipes/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('PUT /api/recipes/:id - ID:', id, 'Body:', req.body, 'User ID:', req.userId);
    
    const { title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category, image_url } = req.body;
    
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Title, ingredients, and instructions are required' });
    }
    
    // Check ownership
    const existingRecipe = await db
      .selectFrom('recipes')
      .select('user_id')
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!existingRecipe || existingRecipe.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this recipe' });
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

// Delete recipe (requires auth and ownership)
app.delete('/api/recipes/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('DELETE /api/recipes/:id - ID:', id, 'User ID:', req.userId);
    
    // Check ownership
    const existingRecipe = await db
      .selectFrom('recipes')
      .select('user_id')
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!existingRecipe || existingRecipe.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }
    
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

// Toggle favorite status (requires auth and ownership)
app.patch('/api/recipes/:id/favorite', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('PATCH /api/recipes/:id/favorite - ID:', id, 'User ID:', req.userId);
    
    const recipe = await db
      .selectFrom('recipes')
      .select(['is_favorite', 'user_id'])
      .where('id', '=', id)
      .executeTakeFirst();
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Only allow favoriting own recipes or public recipes
    if (recipe.user_id !== null && recipe.user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to favorite this recipe' });
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
app.get('/api/categories', optionalAuth, async (req: AuthRequest, res) => {
  try {
    console.log('GET /api/categories', 'User ID:', req.userId);
    
    let query = db.selectFrom('recipes').select('category').distinct().where('category', 'is not', null);
    
    if (req.userId) {
      query = query.where((eb) =>
        eb.or([
          eb('user_id', 'is', null),
          eb('user_id', '=', req.userId!)
        ])
      );
    } else {
      query = query.where('user_id', 'is', null);
    }
    
    const categories = await query.execute();
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