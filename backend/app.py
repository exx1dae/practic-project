import os
import shutil
import sqlite3
import json
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from ultralytics import YOLO

# Параметры
MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n.pt')
DB_PATH = os.getenv('DB_PATH', 'history.db')
UPLOAD_DIR = os.getenv('UPLOAD_DIR', 'uploads')

# Создаем папку для загрузок
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Инициализация FastAPI
app = FastAPI(title='Horse Counter API')

# Разрешаем CORS для React frontend (изменить origin на адрес фронта)
origins = [
    'http://localhost:3000',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Загрузка модели
try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Не удалось загрузить модель: {e}")

# Инициализация базы данных
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()
cursor.execute(
    '''CREATE TABLE IF NOT EXISTS requests (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           filename TEXT,
           result TEXT,
           timestamp TEXT
       )'''
)
conn.commit()

@app.post('/api/detect', summary='Детектировать лошадей на изображении')
async def detect(file: UploadFile = File(...)):
    # Сохраняем файл
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, 'wb') as buf:
        shutil.copyfileobj(file.file, buf)

    # Запуск детекции
    try:
        results = model(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка модели: {e}")

    # Формируем ответ
    detections = []
    for r in results:
        for box in r.boxes.data.tolist():
            x1, y1, x2, y2, score, cls = box
            detections.append({
                'bbox': [x1, y1, x2, y2],
                'score': score,
                'class': int(cls)
            })
    # Создаем запись в истории и получаем id
    response = {'filename': file.filename, 'detections': detections}
    timestamp = datetime.utcnow().isoformat()
    cursor.execute(
        'INSERT INTO requests (filename, result, timestamp) VALUES (?, ?, ?)',
        (file.filename, json.dumps(response), timestamp)
    )
    conn.commit()
    req_id = cursor.lastrowid

    # Возвращаем id вместе с результатом
    return JSONResponse({
        'id': req_id,
        **response
    })

@app.get('/api/history', summary='Получить историю запросов')
def history():
    cursor.execute('SELECT id, filename, result, timestamp FROM requests')
    rows = cursor.fetchall()
    history_list = []
    for rec_id, fname, result, ts in rows:
        history_list.append({
            'id': rec_id,
            'filename': fname,
            'result': json.loads(result),
            'timestamp': ts
        })
    return JSONResponse({'history': history_list})

@app.delete('/api/history/{req_id}', summary='Удалить запись из истории')
def delete_history(req_id: int):
    cursor.execute('SELECT COUNT(*) FROM requests WHERE id = ?', (req_id,))
    if cursor.fetchone()[0] == 0:
        raise HTTPException(status_code=404, detail='Запись не найдена')
    cursor.execute('DELETE FROM requests WHERE id = ?', (req_id,))
    conn.commit()
    return JSONResponse({'detail': f'Запись {req_id} удалена'})

@app.get('/api/visualize/{req_id}', summary='Получить изображение с визуализацией детекции')
def get_visualization(req_id: int):
    # Получаем запись из БД
    cursor.execute('SELECT filename, result FROM requests WHERE id = ?', (req_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail='Запись не найдена')
    filename, result_json = row
    data = json.loads(result_json)

    # Пути
    image_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail='Исходное изображение не найдено')
    # Загружаем изображение
    import cv2
    img = cv2.imread(image_path)
    if img is None:
        raise HTTPException(status_code=500, detail='Не удалось загрузить изображение')

    # Отрисовываем bbox
    for det in data.get('detections', []):
        x1, y1, x2, y2 = map(int, det['bbox'])
        score = det['score']
        if score >= 0.5:
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                img,
                f"{score:.2f}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )

    # Сохранение во временный файл
    vis_path = os.path.join(UPLOAD_DIR, f"vis_{req_id}.jpg")
    cv2.imwrite(vis_path, img)

    # Отправляем файл
    from fastapi.responses import FileResponse
    return FileResponse(vis_path, media_type='image/jpeg')

if __name__ == '__main__':
    uvicorn.run('app:app', host='0.0.0.0', port=8000, reload=True)
