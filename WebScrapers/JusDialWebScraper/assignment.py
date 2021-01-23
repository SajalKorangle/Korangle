import requests # to download
import bs4 # to extract content 
store= requests.get('https://en.wikipedia.org/wiki/Community') 
#using get method to download and get the data , using store variable to collect .
extract =bs4.BeautifulSoup(store.content, "html.parser") # to extract data and structure it in to html format
for res in extract.select('p'): #  to select contect from html P tag
  print(res.getText())
