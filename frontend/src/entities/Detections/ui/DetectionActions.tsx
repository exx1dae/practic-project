import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Download, Eye, MoreHorizontal, Trash } from "lucide-react";
import { HistoryItem } from "@/entities/Detections/model/types";
import { FC, useEffect } from "react";
import {
  detectionsSliceActions,
  useDeleteDetectionHistoryItemMutation,
} from "@/entities/Detections";
import { toast } from "sonner";
import { useLazyVisualizeDetectionQuery } from "@/features/DetectHorses";
import { useAppDispatch } from "@/hooks";
import { useDownloadJson } from "@/hooks/use-download-json.ts";

interface DetectionActionsProps {
  detection: HistoryItem;
}

export const DetectionActions: FC<DetectionActionsProps> = ({ detection }) => {
  const { id: detectionId, result } = detection;
  const dispatch = useAppDispatch();
  const { downloadJson } = useDownloadJson();

  const [deleteDetection] = useDeleteDetectionHistoryItemMutation();
  const [visualize, { isLoading: visualizeLoading }] =
    useLazyVisualizeDetectionQuery();

  useEffect(() => {
    dispatch(
      detectionsSliceActions.setVisualizeDetectionLoading(visualizeLoading),
    );
  }, [visualizeLoading, dispatch]);

  const onDeleteDetection = async (detectionId: number) => {
    try {
      await deleteDetection(detectionId).unwrap();
      dispatch(detectionsSliceActions.setPreviewUrl(""));
    } catch (e) {
      toast.error(
        "Произошла непредвиденная ошибка при удалении! Попробуйте снова",
      );
      console.error(e);
    }
  };

  const onVisualizeDetection = async (detectionId: number) => {
    try {
      const blob = await visualize(detectionId).unwrap();

      const url = URL.createObjectURL(blob);
      dispatch(detectionsSliceActions.setPreviewUrl(url));
    } catch (e) {
      toast.error(
        "Произошла непредвиденная ошибка при удалении! Попробуйте снова",
      );
      console.error(e);
    }
  };

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
        <DropdownMenuItem onClick={() => onVisualizeDetection(detectionId)}>
          <Eye /> Отобразить
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => downloadJson(result, `detection-${detectionId}.json`)}
        >
          <Download /> JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDeleteDetection(detectionId)}
        >
          <Trash />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
