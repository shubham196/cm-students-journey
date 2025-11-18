import React from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Trash, CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'success';
  disabled?: boolean;
}

interface ActionButtonsProps {
  actions: Action[];
  align?: 'start' | 'center' | 'end';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ actions, align = 'end' }) => {
  const getActionColor = (variant?: string) => {
    if (variant === 'destructive') return 'text-red-600 hover:text-red-700';
    if (variant === 'success') return 'text-green-600 hover:text-green-700';
    return 'text-gray-700';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, idx) => (
          <React.Fragment key={idx}>
            {action.label === 'separator' ? (
              <DropdownMenuSeparator />
            ) : (
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
                className={`${getActionColor(action.variant)} cursor-pointer`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Quick Action Buttons Component
interface QuickActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onView && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          size="sm"
          variant="outline"
          className="h-8 px-3"
        >
          <Eye className="w-4 h-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          size="sm"
          variant="outline"
          className="h-8 px-3"
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
      {onApprove && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onApprove();
          }}
          size="sm"
          className="h-8 px-3 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
      {onReject && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onReject();
          }}
          size="sm"
          variant="destructive"
          className="h-8 px-3"
        >
          <XCircle className="w-4 h-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          size="sm"
          variant="destructive"
          className="h-8 px-3"
        >
          <Trash className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
