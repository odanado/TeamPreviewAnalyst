import pickle
import os
import json

import lxml.html
import requests
import cv2
from tqdm import tqdm

from utils import calc_hog_feature, preprocessing


def fetch_dom(url):
    r = requests.get(url)
    return lxml.html.fromstring(r.text)


def download_images():
    print('download_images')
    for i in tqdm(range(1, 722)):
        idx = '{:03}'.format(i)
        base_url = 'http://serebii.net/pokedex-sm/icon/{}.png'
        url = base_url.format(idx)

        os.system('wget {} -P img/ > /dev/null 2> /dev/null'.format(url))


def create_fname2name():
    print('create_fname2name')
    fname2name = {}

    for i in tqdm(range(1, 722)):
        idx = '{:03}'.format(i)
        base_url = 'http://serebii.net/pokedex-sm/{}.shtml'
        url = base_url.format(idx)
        dom = fetch_dom(url)
        title = dom.findtext(".//title")
        name = title.split('-')[0].strip()
        fname2name['{}.png'.format(idx)] = name

    with open('data/fname2name.json', 'w') as f:
        json.dump(fname2name, f, indent=2, sort_keys=True)


def create_name2feature():
    print('create_name2feature')
    with open('data/fname2name.json') as f:
        fname2name = json.load(f)

    name2feature = {}
    for fname, name in tqdm(fname2name.items()):
        img = cv2.imread(os.path.join('img', fname), 1)
        img = preprocessing(img)
        feature = calc_hog_feature(img)
        name2feature[name] = feature

    with open('data/name2feature.pkl', 'wb') as f:
        pickle.dump(name2feature, f)


def main():
    download_images()

    create_fname2name()

    create_name2feature()


if __name__ == '__main__':
    main()
