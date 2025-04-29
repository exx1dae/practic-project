import { Detection } from "@/entities/Detetctions";

export interface DetectHorsesResponse {
  id: number;
  filename: string;
  detections: Detection[];
}
