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
const DataTable = () => {
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
            },
          );
          setProducts(response.data.results);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [user]);


  return (
    <div>
      <div className="flex items-center py-4">
        {/* <FilterInput table={table} /> */}
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
