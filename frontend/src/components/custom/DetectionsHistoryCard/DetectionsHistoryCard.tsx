import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useGetDetectionsHistoryQuery } from "@/entities/Detetctions";
import { DetectionsHistoryItemCardSkeleton } from "./DetectionsHistoryItemCardSkeleton.tsx";
import { DetectionsHistoryItemCard } from "@/components/custom/DetectionsHistoryCard/DetectionsHistoryItemCard.tsx";

export const DetectionsHistoryCard = () => {
  const {
    data: { history },
    isLoading,
  } = useGetDetectionsHistoryQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>История</CardTitle>
        <CardDescription>Просмотр предыдущих обнаружений</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading || !history.length
          ? Array.from({ length: 3 }).map((_, index) => (
              <DetectionsHistoryItemCardSkeleton key={index} />
            ))
          : history.map((detection) => (
              <DetectionsHistoryItemCard
                detection={detection}
                key={detection.id}
              />
            ))}
      </CardContent>
    </Card>
  );
};
