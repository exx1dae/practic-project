import { ColumnDef } from "@tanstack/react-table";
import { HistoryItem } from "../model/types";
import { DataTable } from "@/components/custom/DataTable.tsx";
import { useGetDetectionsHistoryQuery } from "@/entities/Detections";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDown } from "lucide-react";
import { DetectionActions } from "./DetectionActions";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const columns: ColumnDef<HistoryItem>[] = [
  {
    accessorKey: "filename",
    header: "Имя файла",
  },
  {
    accessorKey: "count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-2"
        >
          Кол-во лошадей
          <ArrowUpDown className="ml-0.5 h-4 w-4" />
        </Button>
      );
    },
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
      const detection = row.original;

      return <DetectionActions detection={detection} />;
    },
  },
];

export const DetectionsDataTable = () => {
  const { data: history, isLoading } = useGetDetectionsHistoryQuery();

  if (isLoading || !history) {
    return (
      <div className="space-y-8">
        <div className="flex flex-row gap-4 w-full">
          <Skeleton className="w-11/12 h-8" />
          <Skeleton className="w-1/12 h-8" />
        </div>
        <div>
          <Skeleton className="w-full h-64" />
        </div>
      </div>
    );
  }

  return <DataTable data={history} columns={columns} />;
};
