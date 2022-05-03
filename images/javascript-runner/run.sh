echo $SOURCE_CODE > /tmp/source_code.js
node /tmp/source_code.js 1>/tmp/stdout 2>/tmp/stderr
status="$?"
echo "$::stdout::$"
cat /tmp/stdout
echo "$::stderr::$"
cat /tmp/stderr
return $status
