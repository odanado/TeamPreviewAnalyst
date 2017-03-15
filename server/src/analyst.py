import pickle
from itertools import product

import cv2
import numpy as np

from utils import calc_hog_feature, preprocessing
from utils import en2id


def clip_img(img, x, y, w, h):
    return img[y:y + h, x:x + w]


class Analyzer(object):

    def __init__(self):
        self.icon_size = 80
        self.offset_x = (20, 170)
        self.offset_y = (75, 225, 375)

        with open('data/name2feature.pkl', 'rb') as f:
            self.name2feature = pickle.load(f)

    def __call__(self, img_path):
        img = cv2.imread(img_path, 1)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, np.array([0, 0, 0]), np.array([70, 255, 255]))
        mask += cv2.inRange(hsv,
                            np.array([130, 0, 0]), np.array([180, 255, 255]))

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

        results = self.clip_pokemons(resized_img, sorted_contours[0])

        return [en2id(res['name']) for res in results]

    def select_img(self, img, offset, icon_size, num_slide, slide_size):
        candidate = []

        for x, y in product(range(num_slide), range(num_slide)):
            clipped_img = clip_img(
                img, offset[0] + x * slide_size, offset[1] + y * slide_size,
                icon_size, icon_size)
            clipped_img = preprocessing(clipped_img)
            target_feature = calc_hog_feature(clipped_img)
            result = [(name, feature,
                       np.linalg.norm(target_feature - feature, ord=1))
                      for name, feature in self.name2feature.items()]

            result = sorted(result, key=lambda x: x[2])
            candidate.append(result[0])

        candidate = sorted(candidate, key=lambda x: x[2])
        return candidate[0]

    def clip_pokemons(self, img, sorted_contours, num_slide=7, slide_size=5):
        x, y, w, h = cv2.boundingRect(sorted_contours[0])

        results = []
        for offset in product(self.offset_x, self.offset_y):
            name, feature, score = self.select_img(
                img, offset, self.icon_size, num_slide, slide_size)
            results.append(
                {'name': name, 'feature': feature, 'score': score})

        return results


if __name__ == '__main__':
    from time import time
    analyzer = Analyzer()
    file_path = 'images/sample.png'

    s = time()
    print(analyzer(file_path))
    print(time() - s)
