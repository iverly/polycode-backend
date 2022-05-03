echo $SOURCE_CODE > /tmp/source_code.py
python /tmp/source_code.py 1>/tmp/stdout 2>/tmp/stderr
status="$?"
echo "$::stdout::$"
cat /tmp/stdout
echo "$::stderr::$"
cat /tmp/stderr
return $status
