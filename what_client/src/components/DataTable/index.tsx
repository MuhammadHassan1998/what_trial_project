"use client";

import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { columns } from "./Columns";
import { DataTableHeader } from "./Header";
import { DataTableBody } from "./Body";
import { DataTableFooter } from "./Footer";
import { Table } from "@/components/ui/table";

import { Product, ProductsApiResponse } from "@/types";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";

const DataTable = () => {
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get<ProductsApiResponse>(
            "http://localhost:8000/api/products/",
            {
              headers: {
                Authorization: `Bearer ${user?.accessToken}`,
              },
              params: {
                query: debouncedSearchQuery,
                sortBy: sorting.length ? sorting[0].id : undefined,
                sortOrder: sorting.length
                  ? sorting[0].desc
                    ? "desc"
                    : "asc"
                  : undefined,
              },
            },
          );
          setProducts(response.data.results);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };

      fetchProducts();
    }
  }, [user, debouncedSearchQuery, sorting]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search the product"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <DataTableHeader headerGroups={table.getHeaderGroups()} />
          <DataTableBody rows={table.getRowModel().rows} columns={columns} />
        </Table>
      </div>
      <DataTableFooter table={table} />
    </div>
  );
};

export default DataTable;
