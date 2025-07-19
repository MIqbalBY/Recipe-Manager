import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  category: string;
  difficulty: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onClear: () => void;
  categories: string[];
}

export function SearchFilters({
  search,
  category,
  difficulty,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onClear,
  categories
}: SearchFiltersProps) {
  const handleCategoryChange = (value: string) => {
    if (value === 'clear') {
      onCategoryChange('');
    } else {
      onCategoryChange(value);
    }
  };

  const handleDifficultyChange = (value: string) => {
    if (value === 'clear') {
      onDifficultyChange('');
    } else {
      onDifficultyChange(value);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search & Filter
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search recipes
          </Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by title, ingredients, or category..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-white/10 border-white/20 focus:border-primary/50 backdrop-blur-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </Label>
            <Select value={category || undefined} onValueChange={handleCategoryChange}>
              <SelectTrigger className="mt-1 bg-white/50 dark:bg-white/10 border-white/20 focus:border-primary/50 backdrop-blur-sm">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty
            </Label>
            <Select value={difficulty || undefined} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="mt-1 bg-white/50 dark:bg-white/10 border-white/20 focus:border-primary/50 backdrop-blur-sm">
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">All difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {(search || category || difficulty) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear} 
            className="w-full hover:scale-[1.02] transition-transform bg-white/50 dark:bg-white/10 border-white/20 hover:border-primary/50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}