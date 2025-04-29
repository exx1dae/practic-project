import { Detection } from "@/entities/Detetctions";

export interface DetectHorsesResponse {
  filename: string;
  detections: Detection[];
}
