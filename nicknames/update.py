from dotenv import load_dotenv
import os
import requests
import requests
import json
import time

load_dotenv()

TBA_API_KEY = os.getenv('TBA_API_KEY')

print(TBA_API_KEY)

def getTeamNumberPage(page):
    headers = {"X-TBA-Auth-Key": TBA_API_KEY}
    response = requests.get(f"https://www.thebluealliance.com/api/v3/teams/{page}/simple", headers=headers) # type: ignore
    return response.json()

data = {}

page = 0
while True:

    print(f"Requesting page {page}")
    response = getTeamNumberPage(page)

    if len(response) == 0:
        print("Page empty, writing data")
        break

    for simple_team in response:
        team_number = simple_team['team_number']
        nickname = simple_team['nickname']

        if nickname != "Off-Season Demo Team":
            data[str(team_number)] = nickname

    page += 1

    time.sleep(1)

with open('nicknames/nicknames.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
