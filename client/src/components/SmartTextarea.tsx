import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, Edit3 } from 'lucide-react';

interface SmartTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  listType: 'ul' | 'ol';
  minHeight?: string;
}

export function SmartTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  listType,
  minHeight = '100px'
}: SmartTextareaProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const formatAsList = (text: string) => {
    if (!text.trim()) return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (listType === 'ul') {
      return (
        <ul className="list-disc list-inside space-y-1">
          {lines.map((line, index) => (
            <li key={index} className="text-sm leading-relaxed">
              {line.trim()}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol className="list-decimal list-inside space-y-2">
          {lines.map((line, index) => (
            <li key={index} className="text-sm leading-relaxed">
              {line.trim()}
            </li>
          ))}
        </ol>
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={id}>{label} {required && '*'}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="h-6 px-2 text-xs"
        >
          {isPreviewMode ? (
            <>
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </>
          )}
        </Button>
      </div>
      
      {isPreviewMode ? (
        <div 
          className="w-full px-3 py-2 text-base md:text-sm rounded-lg border border-input bg-white/50 dark:bg-white/10 backdrop-blur-sm shadow-sm transition-all cursor-pointer hover:shadow-md"
          style={{ minHeight }}
          onClick={() => setIsPreviewMode(false)}
        >
          {value.trim() ? (
            formatAsList(value)
          ) : (
            <div className="text-muted-foreground text-sm italic">
              Click to add {label.toLowerCase()}...
            </div>
          )}
        </div>
      ) : (
        <textarea
          id={id}
          className="w-full px-3 py-2 text-base md:text-sm rounded-lg border border-input bg-white/50 dark:bg-white/10 backdrop-blur-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-md resize-none"
          style={{ minHeight }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}