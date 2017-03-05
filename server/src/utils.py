import cv2
import numpy as np
import pandas as pd
from skimage.feature import hog


def preprocessing(img):
    img = cv2.resize(img, (32, 32))
    img = cv2.GaussianBlur(img, (3, 3), 0)
    return img


def calc_hog_feature(img, orient=9, cell_size=5, block_size=6):
    channels = cv2.split(img)
    feature = []
    for c in channels:
        f = hog(c, orientations=orient,
                pixels_per_cell=(cell_size, cell_size), cells_per_block=(block_size, block_size))
        feature.extend(f)

    return np.asarray(feature)

pokemon = pd.read_csv('./data/pokemon.csv', delimiter=',')


def convert_name(from_lang, to_lang, name):
    s = pokemon[pokemon[from_lang].str.contains(name, regex=False)]
    if s.empty:
        return None
    else:
        return s[to_lang].values[0]


def ja2en(name):
    return convert_name('Japanese', 'English', name)


def en2ja(name):
    return convert_name('English', 'Japanese', name)


def en2id(name):
    return int(convert_name('English', 'id', name))


def id2en(id):
    s = pokemon[pokemon.id == id]
    if s.empty:
        return None
    else:
        return s['English'].values[0]
