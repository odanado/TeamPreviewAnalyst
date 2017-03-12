#!/usr/bin/env python

import os
import hashlib
from datetime import datetime
import json

from PIL import Image
from bottle import post, request, run, response, install, hook

from analyst import Analyst
from utils import id2en, en2ja
from access_logging import log_to_logger

import gevent.monkey
gevent.monkey.patch_all()

install(log_to_logger)


@hook('after_request')
def enable_cors():
    """
    https://gist.github.com/richard-flosi/3789163
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers[
        'Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers[
        'Access-Control-Allow-Headers'] = \
        'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


def get_unixtime():
    return '{0:%s}'.format(datetime.now())


def get_token(ip):
    unixtime = get_unixtime()
    sha1 = hashlib.sha1((unixtime + ip).encode('utf8'))
    return sha1.hexdigest()


def get_root_dir():
    now = datetime.now()
    root_dir = "images/{0:%Y}/{0:%m}/{0:%d}".format(now)

    os.makedirs(root_dir, exist_ok=True)

    return root_dir


def get_save_dir(ip, token):
    root_dir = get_root_dir()
    save_dir = os.path.join(root_dir, token)

    os.makedirs(save_dir, exist_ok=True)
    return save_dir

analyst = Analyst()


@post('/analyst/upload')
def upload():
    image = request.files.get('image')

    ip = request.environ.get('REMOTE_ADDR')
    token = get_token(ip)
    save_dir = get_save_dir(ip, token)

    image = Image.open(image.file)
    image_path = '{}/orig.jpg'.format(save_dir)
    image.save(image_path)

    ids = analyst(image_path)
    ids = [ids[i // 2 + i % 2 * 3] for i in range(6)]

    res = {}
    res['pokemons'] = []
    ja = [en2ja(id2en(x)) for x in ids]
    for x, y in zip(ids, ja):
        res['pokemons'].append({'id': x, 'ja': y})

    res['token'] = token

    response.content_type = 'application/json; charset=UTF-8'
    response.headers['Access-Control-Allow-Origin'] = '*'
    return json.dumps(res, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    run(host='0.0.0.0', server='gevent', port=8080)
