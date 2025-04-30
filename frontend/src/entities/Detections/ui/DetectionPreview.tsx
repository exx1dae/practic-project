import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { EmptyStateMedia } from "@/components/custom/EmptyStateMedia.tsx";
import { useAppSelector } from "@/hooks";
import {
  getDetectionPreviewUrl,
  getVisualizeDetectionLoading,
} from "@/entities/Detections";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx";

export const DetectionPreview = () => {
  const previewUrl = useAppSelector(getDetectionPreviewUrl);
  const isVisualizeDetectionLoading = useAppSelector(
    getVisualizeDetectionLoading,
  );

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Превью результата обнаружения</CardTitle>
        <CardDescription>
          Ниже представлено результирующее изображение с обнаружением объектов
        </CardDescription>
      </CardHeader>
      <CardContent>
        {previewUrl ? (
          <AspectRatio>
            <img
              src={previewUrl}
              alt=""
              className="rounded-md object-contain w-full h-full"
            />
          </AspectRatio>
        ) : isVisualizeDetectionLoading ? (
          <PreviewSkeleton />
        ) : (
          <EmptyStateMedia />
        )}
      </CardContent>
    </Card>
  );
};

function PreviewSkeleton() {
  return <Skeleton className="h-64 w-full" />;
}
