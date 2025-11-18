import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  className?: string;
  emptyMessage?: string;
  exportable?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  searchPlaceholder = 'Search...',
  className = '',
  emptyMessage = 'No data found',
  exportable = false
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, searchTerm, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = columns.map(col => col.header).join(',');
    const rows = filteredAndSortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card className="border-gray-200">
      <div className="p-6">
        {/* Header with Search and Export */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11"
            />
          </div>
          
          {exportable && (
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                    } ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <span className="inline-flex">
                          {sortKey === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    onClick={() => onRowClick?.(row)}
                    className={`${
                      onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
                    }`}
                  >
                    {columns.map((column, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                      >
                        {column.render
                          ? column.render(row[column.key], row, rowIdx)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredAndSortedData.length}</span> results
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  return (
                    <React.Fragment key={page}>
                      {prevPage && page - prevPage > 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
