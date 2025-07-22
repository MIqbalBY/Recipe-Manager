import { useState } from 'react';
import { Recipe, CreateRecipeData } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (data: CreateRecipeData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RecipeForm({ recipe, onSubmit, onCancel, isLoading }: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || '',
    instructions: recipe?.instructions || '',
    prep_time: recipe?.prep_time?.toString() || '',
    cook_time: recipe?.cook_time?.toString() || '',
    servings: recipe?.servings?.toString() || '',
    difficulty: recipe?.difficulty || '',
    category: recipe?.category || '',
    image_url: recipe?.image_url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: CreateRecipeData = {
      title: formData.title,
      description: formData.description || undefined,
      ingredients: formData.ingredients,
      instructions: formData.instructions,
      prep_time: formData.prep_time ? parseInt(formData.prep_time) : undefined,
      cook_time: formData.cook_time ? parseInt(formData.cook_time) : undefined,
      servings: formData.servings ? parseInt(formData.servings) : undefined,
      difficulty: formData.difficulty as 'Easy' | 'Medium' | 'Hard' || undefined,
      category: formData.category || undefined,
      image_url: formData.image_url || undefined
    };
    
    onSubmit(data);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{recipe ? 'Edit Recipe' : 'Create New Recipe'}</CardTitle>
        <CardDescription>
          {recipe ? 'Update your recipe details' : 'Add a new recipe to your collection'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the recipe"
            />
          </div>
          
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="mt-2 w-full h-32 overflow-hidden rounded-md border">
                <img
                  src={formData.image_url}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="ingredients">Ingredients *</Label>
            <textarea
              id="ingredients"
              className="w-full min-h-[100px] px-3 py-2 text-base md:text-sm rounded-lg border border-input bg-white/50 dark:bg-white/10 backdrop-blur-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md resize-none"
              value={formData.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              placeholder="List ingredients separated by commas or on new lines"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="instructions">Instructions *</Label>
            <textarea
              id="instructions"
              className="w-full min-h-[120px] px-3 py-2 text-base md:text-sm rounded-lg border border-input bg-white/50 dark:bg-white/10 backdrop-blur-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md resize-none"
              value={formData.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="Write step-by-step instructions. Use numbered steps (1. 2. 3.) for better formatting."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prep_time">Prep Time (minutes)</Label>
              <Input
                id="prep_time"
                type="number"
                min="0"
                value={formData.prep_time}
                onChange={(e) => handleChange('prep_time', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cook_time">Cook Time (minutes)</Label>
              <Input
                id="cook_time"
                type="number"
                min="0"
                value={formData.cook_time}
                onChange={(e) => handleChange('cook_time', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => handleChange('servings', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Italian, Dessert, Appetizer"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}