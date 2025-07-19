import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2025 QB. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}