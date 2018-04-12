#!/usr/bin/env python
# Name: Sammy Heutz
# Student number: 10445765
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
	"""
	Scrapes IMDB for the 50 highest rated tvseries and 
	creates a list of the titles, ratings, genres, actors and runtimes.
    """
	
	# extract titles
	titles = []
	
	for title in dom.find_all("h3", "lister-item-header"):
		title = title.contents[3]	
		if not title:
			break
		titles.append(title.string)

	# extract ratings
	ratings = []
	
	for rating in dom.find_all("span", "value"):
		rating = rating.contents[0]
		ratings.append(rating.string)
		
	# extract genres
	genres = []
	
	for genre in dom.find_all("span", "genre"):
		genre = genre.contents[0]
		genres.append(genre.string.strip())
		
	# extract actors
	actors = []
	
	for children in dom.find_all("div","lister-item-content"):
		i = 0
		actors_string = ""
		stars = children(href=re.compile("adv_li_st"))
		
		for star in stars:
			actors_string += star.string
			
			# make sure comma is placed only between a serie's actors
			if i != len(stars) - 1:
				actors_string += ","	
			i += 1
	
		actors.append(actors_string)
			
	# extract runtimes
	runtimes = []
	for runtime in dom.find_all("span", "runtime"):
		runtime = runtime.contents[0]
		runtimes.append(runtime.string.strip(" min"))

	# create tvseries list
	tvserie = []
	tvseries = []
	
	for i in range(50): 
		tvserie.append(titles[i])
		tvserie.append(ratings[i])
		tvserie.append(genres[i])
		tvserie.append(actors[i])
		tvserie.append(runtimes[i])
		tvseries.append(tvserie)
		tvserie = []

	return tvseries
 

def save_csv(outfile, tvseries):
	"""
	Writes the 50 highest rated tvseries to a CSV file.
	"""
	
	writer = csv.writer(outfile)
	writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

	for i in range(50):
		writer.writerow(tvseries[i])
 
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)