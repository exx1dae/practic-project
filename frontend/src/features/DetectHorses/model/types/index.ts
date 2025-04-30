import { Detection } from "src/entities/Detections";

export interface DetectHorsesResponse {
  id: number;
  filename: string;
  detections: Detection[];
}
