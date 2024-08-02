import { flexRender, HeaderGroup } from "@tanstack/react-table";
import { TableRow, TableHead, TableHeader } from "@/components/ui/table";

interface TableHeaderProps<T> {
  headerGroups: HeaderGroup<T>[];
}

export const DataTableHeader = <T,>({ headerGroups }: TableHeaderProps<T>) => {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};
