#!/bin/sh
set -e
rm -f /tmp/c.txt
curl -s -c /tmp/c.txt http://localhost/index.php > /tmp/login_page.html
TOKEN=$(grep -o 'name="token" value="[^"]*"' /tmp/login_page.html | head -1 | sed 's/.*value="\([^"]*\)".*/\1/')
echo "token=$TOKEN"

curl -s -b /tmp/c.txt -c /tmp/c.txt \
  --data-urlencode "username=admin" \
  --data-urlencode "password=admin_test_pw" \
  --data-urlencode "actionlogin=login" \
  --data-urlencode "token=$TOKEN" \
  -D /tmp/headers.txt \
  -o /tmp/after_login.html \
  "http://localhost/index.php?mainmenu=home"

echo "--- headers ---"
cat /tmp/headers.txt
echo "--- error message (if any) ---"
grep -o 'error[^<]*' /tmp/after_login.html | head -5
grep -o 'Identificadores[^<]*' /tmp/after_login.html | head -5
