import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange';
  options?: { label: string; value: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onClear: () => void;
  onSearch?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onChange,
  onClear,
  onSearch
}) => {
  const hasActiveFilters = Object.values(values).some(v => v);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="w-4 h-4" />
        Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{filter.label}</label>
            
            {filter.type === 'text' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={values[filter.key] || ''}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  placeholder={`Search ${filter.label.toLowerCase()}...`}
                  className="pl-10"
                />
              </div>
            )}

            {filter.type === 'select' && filter.options && (
              <Select
                value={values[filter.key] || ''}
                onValueChange={(value) => onChange(filter.key, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filter.type === 'date' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {values[filter.key] ? (
                      format(values[filter.key], 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={values[filter.key]}
                    onSelect={(date) => onChange(filter.key, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        {onSearch && (
          <Button onClick={onSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        )}
        
        {hasActiveFilters && (
          <Button onClick={onClear} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};
