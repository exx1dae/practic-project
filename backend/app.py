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

MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n.pt')
DB_PATH = os.getenv('DB_PATH', 'history.db')
UPLOAD_DIR = os.getenv('UPLOAD_DIR', 'uploads')

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title='Horse Counter API')

origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Не удалось загрузить модель: {e}")

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
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, 'wb') as buf:
        shutil.copyfileobj(file.file, buf)

    try:
        results = model(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка модели: {e}")

    detections = []
    horse_class_indices = [idx for idx, name in model.names.items() if 'horse' in name.lower()]

    for r in results:
        for box in r.boxes.data.tolist():
            x1, y1, x2, y2, score, cls = box
            if int(cls) not in horse_class_indices:
                continue  # пропускаем все, кроме лошадей
            detections.append({
                'bbox': [x1, y1, x2, y2],
                'score': score,
                'class': int(cls)
            })
    response = {'filename': file.filename, 'detections': detections}
    timestamp = datetime.utcnow().isoformat()
    cursor.execute(
        'INSERT INTO requests (filename, result, timestamp) VALUES (?, ?, ?)',
        (file.filename, json.dumps(response), timestamp)
    )
    conn.commit()
    req_id = cursor.lastrowid

    count = len(detections)
    return JSONResponse({
        'id': req_id,
        'count': count,
        **response
    })

@app.get('/api/history', summary='Получить историю запросов')
def history():
    cursor.execute('SELECT id, filename, result, timestamp FROM requests')
    rows = cursor.fetchall()
    history_list = []
    for rec_id, fname, result, ts in rows:
        try:
            from datetime import timedelta
            dt = datetime.fromisoformat(ts)
            moscow_dt = dt + timedelta(hours=3)
            formatted_ts = moscow_dt.strftime('%d.%m.%Y %H:%M')
        except Exception:
            formatted_ts = ts

        data_obj = json.loads(result)
        count = len(data_obj.get('detections', []))

        history_list.append({
            'id': rec_id,
            'filename': fname,
            'count': count,
            'result': data_obj,
            'timestamp': formatted_ts
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
    cursor.execute('SELECT filename, result FROM requests WHERE id = ?', (req_id,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail='Запись не найдена')
    filename, result_json = row
    data = json.loads(result_json)

    image_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail='Исходное изображение не найдено')
    import cv2
    img = cv2.imread(image_path)
    if img is None:
        raise HTTPException(status_code=500, detail='Не удалось загрузить изображение')

    for det in data.get('detections', []):
        x1, y1, x2, y2 = map(int, det['bbox'])
        score = det['score']
        if score >= 0:
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

    vis_path = os.path.join(UPLOAD_DIR, f"vis_{req_id}.jpg")
    cv2.imwrite(vis_path, img)

    from fastapi.responses import FileResponse
    return FileResponse(vis_path, media_type='image/jpeg')

if __name__ == '__main__':
    uvicorn.run('app:app', host='0.0.0.0', port=8000, reload=True)
