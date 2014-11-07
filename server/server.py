#!/usr/bin/env python

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import base64
import cgi
import json
from os import curdir
from os.path import join as pjoin
import urlparse
import time

from PIL import Image

import fsdir




# ---

num_images = 4
tmp_storage_path = pjoin(curdir, 'tmp_storage')
storage_path = pjoin(curdir, 'storage')

# ---


def compose_images_strip(uid):
    images = []
    for index in xrange(1, num_images + 1):
        image_path = pjoin(tmp_storage_path, '%s_%d.jpg' % (uid, index))
        images.append(Image.open(image_path, 'r'))

    img_w, img_h = images[0].size
    padding = 30

    bg_w = img_w + padding * 2
    bg_h = img_h * num_images + padding * (num_images + 1) + 10
    canvas = Image.new(
        'RGBA',
        (bg_w, bg_h),
        (0, 0, 0, 255),
    )

    for index in xrange(0, num_images):
        canvas.paste(images[index], (padding, padding * (index + 1) + index * img_h))

    image_path = pjoin(storage_path, 'strip/%d.jpg' % uid)
    canvas = canvas.convert('L')
    canvas.save(image_path, "JPEG", quality=95, optimize=True, progressive=True)

    # canvas.thumbnail((bg_w, bg_h,), Image.ANTIALIAS)
    # image_path = pjoin(storage_path, '%d_small.jpg' % uid)
    # canvas.save(image_path, "JPEG", quality=95, optimize=True, progressive=True)


def compose_images_grid(uid):
    images = []
    for index in xrange(1, num_images + 1):
        image_path = pjoin(tmp_storage_path, '%s_%d.jpg' % (uid, index))
        images.append(Image.open(image_path, 'r'))

    img_w, img_h = images[0].size
    padding = 30

    bg_w = img_w * 2 + padding * 3
    bg_h = img_h * 2 + padding * 3 + 10
    canvas = Image.new(
        'RGBA',
        (bg_w, bg_h),
        (0, 0, 0, 255),
    )

    for index in xrange(0, num_images):
        canvas.paste(
            images[index],
            (
                padding * (index % 2 + 1) + (index % 2) * img_w,
                padding * (index // 2 + 1) + (index // 2) * img_h
            )
        )

    image_path = pjoin(storage_path, 'grid/%d.jpg' % uid)
    canvas = canvas.convert('L')
    canvas.save(image_path, "JPEG", quality=95, optimize=True, progressive=True)


def get_images_list():
    strip_path = pjoin(storage_path, 'strip')

    # from os import listdir
    # from os.path import isfile, join
    # files_list = [f for f in listdir(strip_path) if isfile(join(strip_path, f))]
    entry_list = fsdir.go(strip_path)
    files_list = []
    for entry in entry_list:
        if entry['Type'] == 'F':
            files_list.append(entry['Path'])

    return files_list


# ---

class ImageUploaderHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/image'):
            self.get_image()
        elif self.path.startswith('/recent_images'):
            self.get_recent_images()

    def do_POST(self):
        if self.path == '/save_images':
            self.save_images()

    def output_image_file(self, file_path):
        f = open(file_path)
        self.send_response(200)
        self.send_header('Content-type', 'image/jpeg')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(f.read())
        f.close()

    def get_image(self):
        try:
            qs = {}
            path = self.path
            if '?' in path:
                path, tmp = path.split('?', 1)
                qs = urlparse.parse_qs(tmp)

            if 'grid' in qs:
                image_path = pjoin(storage_path, 'grid/%s.jpg' % qs['id'][0])
            else:
                image_path = pjoin(storage_path, 'strip/%s.jpg' % qs['id'][0])

            self.output_image_file(image_path)
            return

        except IOError:
            self.send_error(404, 'File Not Found: %s' % self.path)

    def get_recent_images(self):
        qs = {}
        path = self.path
        if '?' in path:
            path, tmp = path.split('?', 1)
            qs = urlparse.parse_qs(tmp)

        limit = int(qs['limit']) if 'limit' in qs else 20

        images_list = get_images_list()
        images_list.sort(reverse=True)
        # TODO: get only the recent ones!!!!!!

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        images_list = map(lambda x: '/image?id=' + x[:-4], images_list[:limit])
        json_txt = json.dumps(images_list)
        self.wfile.write(json_txt)

    def save_images(self):
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                'REQUEST_METHOD': 'POST',
                'CONTENT_TYPE': self.headers['Content-Type'],
            }
        )

        uid = int(round(time.time() * 1000))

        for image_index in xrange(1, 5):
            image_field_name = 'image_%d' % image_index
            image_field_string = form[image_field_name].value
            image_field_data = base64.b64decode(image_field_string[23:])
            image_field_path = pjoin(tmp_storage_path, '%d_%d.jpg' % (uid, image_index))

            with open(image_field_path, 'wb') as fh:
                fh.write(image_field_data)

            print('Uploaded image (%d bytes)' % len(image_field_string))

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        compose_images_strip(uid)
        compose_images_grid(uid)

        return_url = "{ 'url': '/image?id=%d' }" % uid
        # pprint('return url = %s' % return_url)
        self.wfile.write(return_url)

        return

# ---

server = HTTPServer(('', 8080), ImageUploaderHandler)
server.serve_forever()
