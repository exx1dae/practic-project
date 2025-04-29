import { Detection } from "@/entities/Detetctions";
import { FC } from "react";

interface DetectionCardProps {
  detection: ;
}

export const DetectionsHistoryItemCard: FC<DetectionCardProps> = ({ detection }) => {
  console.log(detection);

  return <div>Detection</div>;
};
