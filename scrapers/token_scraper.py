import json
import requests
from bs4 import BeautifulSoup


class Scraper():
    """Scrape all movie tokens off of a IMDb list."""
    
    def __init__(self, url):
        self.url = url
    
    def request(self):
        return requests.get(self.url).text
    
    def run(self):
        resp = requests.get(self.url)
        soup = BeautifulSoup(self.request(), 'html.parser')
        tokens = []
        for tr in soup.find('table', class_='chart').find_all('tr'):
            token = tr.find('td', class_='watchlistColumn').find('div')['data-tconst']
            if token:
                tokens.append(token)
        save_json(tokens)


def save_json(data):
    with open('./show-me-a-movie/src/tokens.json', 'w') as f:
        f.write(json.dumps(data, indent=2))

if __name__ == '__main__':
    top_250 = 'http://www.imdb.com/chart/top'
    s = Scraper(top_250)
    s.run()
