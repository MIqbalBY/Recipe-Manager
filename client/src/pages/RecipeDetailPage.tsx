import { useRecipe } from '@/hooks/useRecipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Heart, Clock, Users, ChefHat, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface RecipeDetailPageProps {
  recipeId: number;
  onBack: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function RecipeDetailPage({ recipeId, onBack, onEdit, onDelete }: RecipeDetailPageProps) {
  const { recipe, loading, error, refetch } = useRecipe(recipeId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleFavoriteToggle = async () => {
    try {
      await fetch(`/api/recipes/${recipeId}/favorite`, {
        method: 'PATCH'
      });
      refetch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE'
      });
      onDelete(recipeId);
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error: {error || 'Recipe not found'}</div>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFavoriteToggle}>
            <Heart
              className={`h-4 w-4 mr-2 ${
                recipe.is_favorite ? 'fill-red-500 text-red-500' : ''
              }`}
            />
            {recipe.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          <Button variant="outline" onClick={() => onEdit(recipe.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Recipe</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete Recipe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{recipe.title}</CardTitle>
              {recipe.description && (
                <CardDescription className="mt-2 text-base">
                  {recipe.description}
                </CardDescription>
              )}
            </div>
            {recipe.is_favorite && (
              <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 text-sm">
            {recipe.prep_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prep_time} minutes prep</span>
              </div>
            )}
            {recipe.cook_time && (
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span>{recipe.cook_time} minutes cook</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {recipe.category && (
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                {recipe.category}
              </span>
            )}
            {recipe.difficulty && (
              <span className={`px-3 py-1 rounded-full text-sm ${
                recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {recipe.difficulty}
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="bg-muted p-4 rounded-md">
                <div className="whitespace-pre-line text-sm">
                  {recipe.ingredients}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <div className="bg-muted p-4 rounded-md">
                <div className="whitespace-pre-line text-sm">
                  {recipe.instructions}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}