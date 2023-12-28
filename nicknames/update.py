"""
A python file to automatically update the nicknames.json file using The Blue Alliance API
"""

from dotenv import load_dotenv
import os
import requests
import requests
import json
import time

# Load the TBA API key from the .env file
load_dotenv()
TBA_API_KEY = os.getenv('TBA_API_KEY')

def getTeamNumberPage(page):
    """
    Gets the json response from The Blue Alliance API for a specific page of team names

    Args:
        page (int): The page of team names to get
    """

    headers = {"X-TBA-Auth-Key": TBA_API_KEY}
    response = requests.get(f"https://www.thebluealliance.com/api/v3/teams/{page}/simple", headers=headers) # type: ignore
    return response.json()

# Save the data in a dictionary
data = {}

# Increment thought the pages
page = 0
while True:

    # Get the next page
    print(f"Requesting page {page}")
    response = getTeamNumberPage(page)

    # If the page did not have any data, the last page was reached, break the loop
    if len(response) == 0:
        print("Page empty, writing data")
        break

    # For each team object in the response
    for simple_team in response:
        
        # Get the team's number and nickname
        team_number = simple_team['team_number']
        nickname = simple_team['nickname']

        # If the team isn't a demo team, save it
        if nickname != "Off-Season Demo Team":
            data[str(team_number)] = nickname

    # increment the page
    page += 1

    # sleep to avoid spamming the TBA API
    time.sleep(1)

# Save the data
with open('nicknames/nicknames.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
