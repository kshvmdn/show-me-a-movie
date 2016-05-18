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
        for tr in soup.find('table', class_='chart full-width').find_all('tr'):
            td = tr.find('td', class_='watchlistColumn')
            if td and td.find('div') and td.find('div')['data-tconst']:
                tokens.append(td.find('div')['data-tconst'])
        print('%d tokens scraped.' % len(tokens))
        save_json(tokens)


def save_json(data):
    with open('./show-me-a-movie/src/tokens.json', 'w') as f:
        f.write(json.dumps(data, indent=2))

if __name__ == '__main__':
    top_250 = 'http://www.imdb.com/chart/top'
    s = Scraper(top_250)
    s.run()
