import { EmptyState } from "@/components/custom/EmptyState.tsx";
import { Image } from "lucide-react";

export const EmptyStateMedia = () => {
  return (
    <EmptyState
      title="Превью результата не доступно"
      description="Загрузите изображение и нажмите кнопку обнаружить или выберите уже готовый результат в истории"
      icons={[Image]}
      className="flex flex-col justify-center"
    />
  );
};
