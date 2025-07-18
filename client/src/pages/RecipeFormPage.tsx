import { useState } from 'react';
import { useRecipe } from '@/hooks/useRecipe';
import { RecipeForm } from '@/components/RecipeForm';
import { CreateRecipeData } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface RecipeFormPageProps {
  recipeId?: number;
  onBack: () => void;
  onSuccess: () => void;
}

export function RecipeFormPage({ recipeId, onBack, onSuccess }: RecipeFormPageProps) {
  const { recipe, loading: recipeLoading } = useRecipe(recipeId || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateRecipeData) => {
    setIsSubmitting(true);
    try {
      const url = recipeId ? `/api/recipes/${recipeId}` : '/api/recipes';
      const method = recipeId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (recipeId && recipeLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (recipeId && !recipe) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Recipe not found</div>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Recipes
      </Button>

      <RecipeForm
        recipe={recipe}
        onSubmit={handleSubmit}
        onCancel={onBack}
        isLoading={isSubmitting}
      />
    </div>
  );
}