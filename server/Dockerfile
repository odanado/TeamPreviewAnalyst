FROM python:3

WORKDIR /root
ADD requirements.txt /root
RUN pip install numpy && \
    pip install -r requirements.txt
RUN pip install gevent

EXPOSE 8080

WORKDIR /src
