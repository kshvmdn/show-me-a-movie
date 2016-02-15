"""
Scrape the top 250 movie tokens from IMDb
"""

import json
import requests
from bs4 import BeautifulSoup


def scrape(url):
    return prepare(parse(request(url)))


def request(url):
    return requests.get(url)


def parse(resp):
    soup = BeautifulSoup(resp.text, 'html.parser')
    tokens = []
    for tr in soup.find('table', class_='chart').find_all('tr'):
        if tr.find('td', class_='ratingColumn'):
            token = tr.find('td', class_='watchlistColumn').find('div')['data-tconst']
            tokens.append(token)
    return tokens


def prepare(tokens):
    f = open( './show-me-a-movie/src/tokens.json', 'w' )
    f.write(json.dumps(tokens, indent=2))
    f.close()


if __name__ == '__main__':
    imdb_url = 'http://www.imdb.com/chart/top'
    scrape(imdb_url)
