import requests
import os

api_key = os.environ.get("HACKATIME_API_KEY")

headers = {
    "Authorization": f"Bearer {api_key}"
}

url = "https://hackatime.hackclub.com/api/hackatime/v1/users/U08HC7N4JJW/statusbar/today"

response = requests.get(url=url, headers=headers)

print(response.json()['data']['grand_total']['text'])