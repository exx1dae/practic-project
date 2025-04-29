export interface Detection {
  bbox: number[];
  score: number;
  class: number;
}

export interface HistoryItem {
  id: number;
  filename: string;
  result: {
    fileName: string;
    detections: Detection[];
  };
  timestamp: string;
}

export interface GetDetectionsHistoryResponse {
  history: HistoryItem[];
}
