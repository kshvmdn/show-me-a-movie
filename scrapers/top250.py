"""
Scrape the top 250 movie tokens from IMDb
"""

import requests
from bs4 import BeautifulSoup


def scrape(url):
    return parse(request(url))


def request(url):
    return requests.get('http://www.imdb.com/chart/top')


def parse(response):
    return response.content


if __name__ == '__main__':
    imdb_url = 'http://www.imdb.com/chart/top'
    scrape(imdb_url)
