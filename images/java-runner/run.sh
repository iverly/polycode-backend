echo $SOURCE_CODE > /tmp/source_code.java
cd /tmp && java source_code.java 1>/tmp/stdout 2>/tmp/stderr
status="$?"
echo "$::stdout::$"
cat /tmp/stdout
echo "$::stderr::$"
cat /tmp/stderr
return $status
