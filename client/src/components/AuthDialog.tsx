import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </DialogTitle>
        </DialogHeader>
        <div className="p-0">
          {mode === 'login' ? (
            <LoginForm onToggleMode={handleToggleMode} onClose={handleClose} />
          ) : (
            <RegisterForm onToggleMode={handleToggleMode} onClose={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}