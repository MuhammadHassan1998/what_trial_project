import { flexRender, Row } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";

interface TableBodyProps<T> {
  rows: Row<T>[];
  columns: ColumnDef<T>[];
}

export const DataTableBody = <T,>({ rows, columns }: TableBodyProps<T>) => {
  return (
    <TableBody>
      {rows.length ? (
        rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
