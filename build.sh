#!/bin/bash

echo -e "\n[build.sh] npm run build-server\n" \
	&& npm run build-server \
	&& echo -e "\n[build.sh] npm run build-client\n" \
	&& npm run build-client \
	&& echo -e "\n[build.sh] node lib/tools/server.js\n" \
	&& node lib/tools/server.js
