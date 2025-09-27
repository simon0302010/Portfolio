from flask import Flask, send_from_directory, jsonify, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import threading
import schedule
import requests
import json
import time
import os
import bleach
from datetime import datetime, timezone

app = Flask(__name__, static_folder='.')

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"]
)

HACKATIME_API_KEY = os.environ.get("HACKATIME_API_KEY")

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
@limiter.limit("30 per minute")
def hackatime_cache():
    return jsonify(get_cached_hackatime())

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/comments', methods=['GET', 'POST'])
@limiter.limit("5 per minute")
def comments():
    if request.method == 'POST':
        # new comment
        data = request.get_json()
        comment = {
            "author": bleach.clean(data.get("author", "Anonymous")),
            "text": bleach.clean(data.get("text", "")),
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        }
        if len(comment['author']) > 50 or len(comment['text']) > 300:
            return jsonify({"error": "Too long"}), 413
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
        comments.reverse()
        return jsonify(comments)
    
@app.route('/today')
@limiter.limit("5 per minute")
def today():
    headers = {
        "Authorization": f"Bearer {HACKATIME_API_KEY}"
    }
    url = "https://hackatime.hackclub.com/api/hackatime/v1/users/U08HC7N4JJW/statusbar/today"
    
    response = requests.get(url=url, headers=headers)
    
    text = response.json()['data']['grand_total']['text']
    
    if "coding" in text:
        text = "0m"
    
    return jsonify(text), 200

threading.Thread(target=run_scheduler, daemon=True).start()

if __name__ == '__main__':
    app.run(port=5111, host="0.0.0.0")