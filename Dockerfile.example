# vim:set ft=dockerfile:

FROM node:carbon

COPY ./src /fingerboard/src
COPY /package.json /fingerboard/package.json
COPY /example /fingerboard/example

WORKDIR /fingerboard

RUN npm install && \
	npm run build && \
	npm run example:build

FROM node:carbon

COPY --from=0 /fingerboard/dist /fingerboard

WORKDIR /fingerboard

CMD ["python", "-m", "SimpleHTTPServer", "8000"]
