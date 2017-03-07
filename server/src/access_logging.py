import logging
import json
from bottle import request, response
from functools import wraps
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler

logger = logging.getLogger('TreamPreviewAnalyst')

# set up the logger
logger.setLevel(logging.INFO)
file_handler = TimedRotatingFileHandler('log/access.log', 'd', 7)
formatter = logging.Formatter('%(msg)s')
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)


def log_to_logger(fn):
    '''
    Wrap a Bottle request so that a log line is emitted after it's handled.
    (This decorator can be extended to take the desired logger as a param.)
    '''
    @wraps(fn)
    def _log_to_logger(*args, **kwargs):
        request_time = str(datetime.now())
        actual_response = fn(*args, **kwargs)

        res = json.loads(actual_response)
        log = [request.remote_addr,
               request_time,
               request.method,
               request.url,
               response.status,
               ]

        if 'token' in res:
            log.append(res['token'])
        logger.info(' '.join(log))
        return actual_response
    return _log_to_logger
