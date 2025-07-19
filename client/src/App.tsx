import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { RecipeListPage } from '@/pages/RecipeListPage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { RecipeFormPage } from '@/pages/RecipeFormPage';
import { AuthProvider } from '@/components/AuthProvider';
import { useAuth } from '@/hooks/useAuth';

type Page = 'recipes' | 'favorites' | 'create' | 'edit' | 'detail';

function AppContent() {
  const { auth, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('recipes');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedRecipeId(null);
  };

  const handleViewRecipe = (id: number) => {
    setSelectedRecipeId(id);
    setCurrentPage('detail');
  };

  const handleEditRecipe = (id: number) => {
    setSelectedRecipeId(id);
    setCurrentPage('edit');
  };

  const handleCreateRecipe = () => {
    setSelectedRecipeId(null);
    setCurrentPage('create');
  };

  const handleBack = () => {
    setCurrentPage('recipes');
    setSelectedRecipeId(null);
  };

  const handleSuccess = () => {
    setCurrentPage('recipes');
    setSelectedRecipeId(null);
  };

  const handleDeleteRecipe = () => {
    setCurrentPage('recipes');
    setSelectedRecipeId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'recipes':
        return (
          <RecipeListPage
            onCreateRecipe={handleCreateRecipe}
            onViewRecipe={handleViewRecipe}
            showFavorites={false}
          />
        );
      case 'favorites':
        return (
          <RecipeListPage
            onCreateRecipe={handleCreateRecipe}
            onViewRecipe={handleViewRecipe}
            showFavorites={true}
          />
        );
      case 'create':
        return (
          <RecipeFormPage
            onBack={handleBack}
            onSuccess={handleSuccess}
          />
        );
      case 'edit':
        return (
          <RecipeFormPage
            recipeId={selectedRecipeId || undefined}
            onBack={handleBack}
            onSuccess={handleSuccess}
          />
        );
      case 'detail':
        return (
          <RecipeDetailPage
            recipeId={selectedRecipeId!}
            onBack={handleBack}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;