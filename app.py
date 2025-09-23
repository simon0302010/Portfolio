from flask import Flask, send_from_directory, jsonify
import threading
import schedule
import requests
import json
import time
import os

app = Flask(__name__, static_folder='.')

CACHE_FILE = 'cache/hackatime.json'
CACHE_DURATION = 10 * 60  # 10 minutes

os.makedirs("cache", exist_ok=True)

def get_cached_hackatime():
    if os.path.exists(CACHE_FILE):
        mtime = os.path.getmtime(CACHE_FILE)
        if time.time() - mtime < CACHE_DURATION:
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
    schedule.every(60).minutes.do(update_hackatime_cache)
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

if __name__ == '__main__':
    threading.Thread(target=run_scheduler, daemon=True).start()
    app.run(port=5111)