#!/bin/sh
set -e
curl -s -c /tmp/c.txt http://localhost/index.php > /tmp/login_page.html
grep -o 'name="[^"]*"' /tmp/login_page.html | sort -u
echo "---token---"
grep -o 'token.*value="[^"]*"' /tmp/login_page.html | head -3
