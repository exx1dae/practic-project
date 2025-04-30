export interface Detection {
  bbox: number[];
  score: number;
  class: number;
}

export interface HistoryItem {
  id: number;
  filename: string;
  count: number;
  result: {
    fileName: string;
    detections: Detection[];
  };
  timestamp: string;
}

export interface GetDetectionsHistoryResponse {
  history: HistoryItem[];
}
