import pickle
from itertools import product
from functools import partial

import cv2
import numpy as np

from utils import calc_hog_feature, preprocessing
from utils import en2id


def clip_img(img, x, y, w, h):
    return img[y:y + h, x:x + w]


class Detecter(object):

    def __init__(self):
        self.lower_threshold = np.array([0, 50, 50])
        self.upper_threshold = np.array([70, 255, 255])

        with open('data/name2feature.pkl', 'rb') as f:
            self.name2feature = pickle.load(f)

    def __call__(self, img_path):
        img = cv2.imread(img_path, 1)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, self.lower_threshold, self.upper_threshold)

        _, contours, _ = cv2.findContours(
            mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

        def contour_filter(c):
            x, y, w, h = cv2.boundingRect(c)
            return w < h
        sorted_contours = [c for c in contours if contour_filter(c)]
        sorted_contours = sorted(
            sorted_contours, key=cv2.contourArea, reverse=True)

        x, y, w, h = cv2.boundingRect(sorted_contours[0])
        resized_img = cv2.resize(img[y:y + h, x:x + w], (300, 500))

        imgs = self.clip_pokemons(resized_img, sorted_contours[0])

        def key_func(target_feature, x):
            f = np.asarray(x[1])
            return np.linalg.norm(target_feature - f, ord=1)

        ids = []
        for poke_img in imgs:
            poke_img = preprocessing(poke_img)
            target_feature = calc_hog_feature(poke_img)
            result = min(self.name2feature.items(),
                         key=partial(key_func, target_feature))

            ids.append(en2id(result[0]))

        return ids

    def clip_pokemons(self, img, contour):
        x, y, w, h = cv2.boundingRect(contour)
        icon_size = 90
        offset_x = (35, 180)
        offset_y = (90, 230, 380)

        imgs = []
        for offset in product(offset_x, offset_y):
            imgs.append(
                clip_img(img, offset[0], offset[1], icon_size, icon_size))

        return imgs

if __name__ == '__main__':
    from time import time
    detecter = Detecter('Japanese')
    file_path = 'images/2017-03-04/f96a0783a4d252f02b470d91f5e5eb6aec347569/orig.jpg'
    s = time()
    print(detecter(file_path))
    print(time() - s)
