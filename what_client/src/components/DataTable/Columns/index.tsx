import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { SortAsc } from "lucide-react";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "selected",
    id: "selected",
    header: () => null,
    cell: ({ row }) => {
      const { user } = useAuth();
      const [checked, setChecked] = useState(
        row.getIsSelected() || row["original"].selected,
      );
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={async (value) => {
            const isSelected = !!value;
            setChecked(!checked);
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
    header: ({ column }) => {
      return (
        <div
          className="capitalize cursor-pointer flex items-center  gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <SortAsc className="w-4 h-4"/>
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <div
          className="capitalize cursor-pointer flex items-center  gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <SortAsc className="w-4 h-4"/>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div
          className="capitalize cursor-pointer flex items-center  gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <SortAsc className="w-4 h-4"/>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className=" font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <div
          className="capitalize cursor-pointer flex items-center  gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <SortAsc className="w-4 h-4"/>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
];
