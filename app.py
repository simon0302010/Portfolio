from flask import Flask, send_from_directory, jsonify, request
import threading
import schedule
import requests
import json
import time
import os

app = Flask(__name__, static_folder='.')

CACHE_FILE = 'data/hackatime.json'
COMMENTS_FILE = 'data/comments.json'
CACHE_DURATION = 60  # 1 hour

os.makedirs("data", exist_ok=True)

def get_cached_hackatime():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)
    # fetch data
    return update_hackatime_cache()

def update_hackatime_cache():
    resp = requests.get('https://hackatime.hackclub.com/api/v1/users/simon/projects/details?since=2023-01-01T00:00:00Z')
    data = resp.json()
    with open(CACHE_FILE, 'w') as f:
        json.dump(data, f)
    return data

def run_scheduler():
    schedule.every(CACHE_DURATION).minutes.do(update_hackatime_cache)
    while True:
        schedule.run_pending()
        time.sleep(1)

@app.route('/hackatime-cache')
def hackatime_cache():
    return jsonify(get_cached_hackatime())

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/comments', methods=['GET', 'POST'])
def comments():
    if request.method == 'POST':
        # new comment
        data = request.get_json()
        comment = {
            "author": data.get("author", "Anonymous"),
            "text": data.get("text", ""),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        comments = []
        if os.path.exists(COMMENTS_FILE):
            with open(COMMENTS_FILE, 'r') as f:
                comments = json.load(f)
        comments.append(comment)
        with open(COMMENTS_FILE, 'w') as f:
            json.dump(comments, f)
        return jsonify({"success": True}), 201
    else:
        # fetch comments
        if os.path.exists(COMMENTS_FILE):
            with open(COMMENTS_FILE, 'r') as f:
                comments = json.load(f)
        else:
            comments = []
        return jsonify(comments)
    
@app.route('/today')
def today():
    return "10m"

if __name__ == '__main__':
    threading.Thread(target=run_scheduler, daemon=True).start()
    app.run(port=5111, host="0.0.0.0")