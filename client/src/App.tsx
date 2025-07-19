import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { RecipeListPage } from '@/pages/RecipeListPage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { RecipeFormPage } from '@/pages/RecipeFormPage';
import { AboutPage } from '@/pages/AboutPage';
import { AuthProvider } from '@/components/AuthProvider';
import { useAuth } from '@/hooks/useAuth';

type Page = 'recipes' | 'favorites' | 'create' | 'edit' | 'detail' | 'about';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <div className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading Recipe Manager...
          </div>
        </div>
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
      case 'about':
        return <AboutPage />;
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