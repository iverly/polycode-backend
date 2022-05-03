echo $SOURCE_CODE > /tmp/source_code.rs
cd /tmp && rustc source_code.rs 1>/tmp/stdout 2>/tmp/stderr
status="$?"

if [ "$status" -eq 0 ]; then
  cd /tmp && ./source_code 1>/tmp/stdout 2>/tmp/stderr
  status="$?"
fi

echo "$::stdout::$"
cat /tmp/stdout
echo "$::stderr::$"
cat /tmp/stderr
return $status
