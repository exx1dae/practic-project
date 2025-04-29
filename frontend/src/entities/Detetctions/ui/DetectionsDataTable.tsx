import { ColumnDef } from "@tanstack/react-table";
import { HistoryItem } from "@/entities/Detetctions/model/types";
import { DataTable } from "@/components/custom/DataTable.tsx";
import { useGetDetectionsHistoryQuery } from "@/entities/Detetctions";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  ArrowUpDown,
  Download,
  Eye,
  MoreHorizontal,
  Trash,
} from "lucide-react";

const columns: ColumnDef<HistoryItem>[] = [
  {
    accessorKey: "filename",
    header: "Имя файла",
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-2"
        >
          Дата обнаружения
          <ArrowUpDown className="ml-0.5 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id: _ } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye /> Отобразить
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download /> JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const DetectionsDataTable = () => {
  const { data: history, isLoading } = useGetDetectionsHistoryQuery();

  if (isLoading || !history) {
    return null;
  }

  const serializedHistory = history.map((item) => ({
    ...item,
    timestamp: format(new Date(item.timestamp), "dd.MM.yyyy HH:mm"),
  }));

  return <DataTable data={serializedHistory} columns={columns} />;
};
