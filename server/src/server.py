import os
import hashlib
from datetime import datetime
import json

from PIL import Image
from bottle import post, request, run, response

from detecter import Detecter
from utils import id2en, en2ja


def get_unixtime():
    return '{0:%s}'.format(datetime.now())


def get_root_dir():
    now = datetime.now()
    root_dir = "images/{0:%Y}/{0:%m}/{0:%d}".format(now)

    os.makedirs(root_dir, exist_ok=True)

    return root_dir


def get_save_dir(ip):
    unixtime = get_unixtime()
    sha1 = hashlib.sha1((unixtime + ip).encode('utf8'))

    root_dir = get_root_dir()
    save_dir = os.path.join(root_dir, sha1.hexdigest())

    os.makedirs(save_dir, exist_ok=True)
    return save_dir

detecter = Detecter()


@post('/upload')
def upload():
    image = request.files.get('image')

    ip = request.environ.get('REMOTE_ADDR')
    save_dir = get_save_dir(ip)

    image = Image.open(image.file)
    image_path = '{}/orig.jpg'.format(save_dir)
    image.save(image_path)

    ids = detecter(image_path)
    ids = [ids[i // 2 + i % 2 * 3] for i in range(6)]

    res = {}
    res['pokemons'] = []
    ja = [en2ja(id2en(x)) for x in ids]
    for x, y in zip(ids, ja):
        res['pokemons'].append({'id': x, 'ja': y})

    response.content_type = 'application/json; charset=UTF-8'
    response.headers['Access-Control-Allow-Origin'] = '*'
    return json.dumps(res, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    run(host='0.0.0.0', port=8080)
