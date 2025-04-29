import cv2
import json

IMAGE_PATH = 'horses.jpg'          # замените на путь к вашему изображению
RESULT_JSON = 'result.json'        # путь к JSON с результатом детекции (ответ API)
OUTPUT_PATH = 'vis.jpg'            # куда сохранить визуализацию

with open(RESULT_JSON, 'r') as f:
    data = json.load(f)

img = cv2.imread(IMAGE_PATH)
if img is None:
    raise FileNotFoundError(f"Не удалось загрузить изображение: {IMAGE_PATH}")
for det in data.get('detections', []):
    x1, y1, x2, y2 = map(int, det['bbox'])
    score = det['score']
    # фильтр по порогу (например, 0.5)
    if score >= 0.5:
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(img, f"{score:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    

cv2.imwrite(OUTPUT_PATH, img)
print(f"Визуализация сохранена в {OUTPUT_PATH}")