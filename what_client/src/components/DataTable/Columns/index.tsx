// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "selected",
    id: "selected",
    header: () => (
       null
    ),
    cell: ({ row }) => {
      const { user } = useAuth();
      const [checked, setChecked]=useState(row.getIsSelected() || row["original"].selected)
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={async (value) => {
            const isSelected = !!value;
             setChecked(!checked)
            const id = row.original.id;
            try {
              await axios.post(
                `http://localhost:8000/api/select-product/${id}/`,
                { selected: isSelected },
                {
                  headers: {
                    Authorization: `Bearer ${user?.accessToken}`,
                  },
                },
              );
            } catch (error) {
              console.error("Failed to update selection", error);
              row.toggleSelected(!isSelected);
            }
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
