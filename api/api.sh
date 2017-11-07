#!/bin/bash

# Turn on debugging
# set -xv

resultsFile=~/tmp/api.log
mkdir -p ~/tmp

usage="Usage: $(basename $0) OPTIONS [URL]

Sends an HTTP request through curl to api server

options:
  -X, --request method        Use method request (eg PUT, DELETE)
  get, post, delete, put,     Shortcuts for -X method
  head, options

  -u, --url url               Append url to saved baseUrl
  -b, --base-url url          Use url as the base url for this request only
  -w, --fullurl url           Use full url (not appending to base url)

  -d, --data data             Supply payload data (JSON string or file)
  -L [username[:password]]    Pass username and password as data

  -H, --header header         Add header to request (append to defaults)
  -a, --no-auth               Don't send auth header
  -p, --hide-password         Don't store password (saved as <password>)

  Saving default data:
  -k, --auth-key              Set the auth header key
  -t, --auth-token            Set the data field to search for in the
                              reauthentication request
  -B, --save-url baseUrl      Save baseUrl for this and subsequent requests
  -l username[:password]      Save username and password data
  -j, --save-headers headers  Set default headers
  -A, --auth-url url          Set authentication url
  -C, --config                Update defaults and print without making a request

  -v, --verbose               Output more
  -S, --show-saved            Prints out stored request data
  -h, --help                  Show this menu
"

if [ -z "$*" ]; then
  echo "$usage"
  exit 1
fi

# defaults
dryRun=false
fullURL=false
reauth=false
savePassword=true
saveUrl=false
setDefaultHeaders=false
useAuth=true
verbose=false
headers=
url=

# Extract saved fields from this file (this actually just saves line numbers
# for use with sed later). The order must match the variables below
authHeaderKeyLine=$(($(grep -n -m2 'HEADERLINE' $0 |tail -n1 |cut -d':' -f1) + 1))
authHeaderLine=$(($authHeaderKeyLine + 1))
userHeaderLine=$(($authHeaderKeyLine + 2))
urlHeaderLine=$(($authHeaderKeyLine + 3))
reauthUrlLine=$(($authHeaderKeyLine + 4))
dataTokenStringLine=$(($authHeaderKeyLine + 5))
defaultHeadersLine=$(($authHeaderKeyLine + 6))

# These values are replaced by the script any time data is saved - make sure
# they never span more than 1 line, as that will mess with the replacements
# and / or script execution
# HEADERLINE - keep this above the 'authHeaderKey' line
authHeaderKey="x-auth-token"
authHeader="${authHeaderKey}:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJpYXQiOjE1MDk5MjY2MDksImV4cCI6MTUwOTk2OTgwOX0.s4IXwlzT2MVsgGgwkZAWzAvK-qM3hrDYwFKHp2dlPTM"
userHeader="username:password"
urlHeader="localhost:3000/v1"
reauthUrl="localhost:8080/api/authenticate"
dataTokenString="token"
defaultHeaders="-H 'content-type: application/json'"

username=$(echo $userHeader |cut -d':' -f1)
password=$(echo $userHeader |cut -d':' -f2)

while [ ! -z "$1" ]; do
  case $1 in
    -v | --verbose)
      verbose=true
    ;;

    -a | --no-auth)
      useAuth=false
    ;;

    -A | --auth-url)
      shift
      reauthUrl="$1"
    ;;

    -k | --auth-key)
      shift
      authHeaderKey="$1"
    ;;

    -t | --auth-token)
      shift
      dataTokenString="$1"
    ;;

    -H | --header)
      shift
      headers="$1 $headers"
    ;;

    -j | --save-headers)
      shift
      headers="$1"
      setDefaultHeaders=true
    ;;

    -b | --base-url)
      shift
      baseUrl="$1"
    ;;

    -B | --save-url)
      saveUrl=true
      shift
      baseUrl="$1"
      urlHeader="$baseUrl"
    ;;

    -d | --data)
      shift
      if [ -f "$1" ]; then
        tmp=$(cat "$1")
      else
        tmp=$1
      fi
      if [ -z "$data" ]; then
        data="$tmp"
      else
        # If there is already data being passed in, merge it together
        data="$(echo "$data" |sed "s|}|,$(echo "$tmp" |sed "s|[{}]||g")}|g" )"
      fi
    ;;

    -u | --url)
      shift
      url="$1"
    ;;

    -w | --fullurl)
      shift
      url="$1"
      fullURL=true
    ;;

    -X | --request)
      shift
      method="${1^^}"
    ;;

    get | post | delete | put | head | options)
      method="${1^^}"
    ;;

    -C | --config)
      dryRun=true
    ;;

    -S | --show-saved)
      echo "Base Url              : $urlHeader"
      echo "Login Details         : $userHeader"
      echo "Auth Token Header Key : $authHeaderKey"
      echo "Auth Header           : $authHeaderKey:$(echo $authHeader |cut -d':' -f2)"
      echo "Reauth Url            : $reauthUrl"
      echo "Auth Token Data Key   : $dataTokenString"
      echo "Default Headers       : $defaultHeaders"
      exit 0
    ;;

    -p | --hide-password)
      savePassword=false
    ;;

    -l | -L)
      username=$(echo $2 |cut -d':' -f1)
      temp=$(echo $2 |cut -d':' -f2)
      if [ ! -z $temp ]; then
        password=$temp
      fi

      if [ "$1" == "-L" ]; then
        if [ -z "$data" ]; then
          data="{\"username\":\"$username\",\"password\":\"password\"}"
        else
          data=$(echo "$data" |sed "s|}|,\"username\":\"$username\",\"password\":\"password\"}|g" )
        fi
      fi
      userHeader="$username:$password"
      shift
    ;;

    -r | --reauth)
      reauth=true
    ;;

    -h | --help)
      echo "$usage"
      exit 0
    ;;

    *)
      if [ "${1:0:1}" == "-" ]; then
        echo "Error: invalid option - '$1'"
        exit 1
      fi
      url="$1"
    ;;
  esac

  shift
done

rm -f $resultsFile

if [ -z "$baseUrl" ]; then
  baseUrl="${urlHeader}"
elif $saveUrl; then
  sed -i "$urlHeaderLine s|\"[^\"]\+\"|\"$baseUrl\"|g" $0
fi

if $savePassword; then
  sed -i "$userHeaderLine s|.*|userHeader=\"$username:$password\"|g" $0
else
  sed -i "$userHeaderLine s|.*|userHeader=\"$username:<password>\"|g" $0
fi

if $setDefaultHeaders; then
  sed -i "$defaultHeadersLine s|.*|defaultHeaders=\"$headers\"|g" $0
  defaultHeaders="$headers"
fi

sed -i "$authHeaderKeyLine s|.*|authHeaderKey=\"$authHeaderKey\"|g" $0
sed -i "$dataTokenStringLine s|.*|dataTokenString=\"$dataTokenString\"|g" $0
sed -i "$reauthUrlLine s|.*|reauthUrl=\"$reauthUrl\"|g" $0
authHeader="$authHeaderKey:$(echo $authHeader |cut -d':' -f2)"

if $dryRun; then
  echo "Base Url              : $urlHeader"
  echo "Login Details         : $userHeader"
  echo "Auth Token Header Key : $authHeaderKey"
  echo "Auth Header           : $authHeader"
  echo "Reauth Url            : $reauthUrl"
  echo "Auth Token Data Key   : $dataTokenString"
  echo "Default Headers       : $defaultHeaders"
  exit 0
fi

if $reauth; then
  $verbose && echo "curl -H \"content-type: application/json\" "\
    "-d'{\"username\":\"'$username'\",\"password\":\"'$password'\"}' ${reauthUrl}"
  data=$({ curl -v -H "Content-Type: application/json" \
    -d'{"username":"'$username'","password":"'$password'"}' ${reauthUrl}; } 2>$resultsFile)
  echo $data >>$resultsFile

  # Searches JSON response for "<dataTokenString>" : "<dataTokenValue>""
  regex="${dataTokenString}"'"[ ]*:[ ]*"([^"]+)"'
  if [[ "$data" =~ $regex ]]; then
    token=${BASH_REMATCH[1]}
    sed -i "$authHeaderLine s|authHeader.*|authHeader=\"\${authHeaderKey}:$token\"|g" $0
  else
    (echo "$data" | python -m json.tool 2>/dev/null || echo "$data") |tee -a $resultsFile
    exit 1
  fi
  echo -e "Authenticated as $username:\n$token"
  exit 0
fi

if ! $fullURL; then
  url=${baseUrl}/$url
  url=${url//\/\//\/}
fi

if [ -z "$method" ]; then
  echo "No method provided - using POST"
  method="POST"
fi

if $useAuth; then
  allHeaders="-H '$authHeader'"
else
  allHeaders=
fi

allHeaders="${headers} ${defaultHeaders} ${allHeaders}"
allHeaders="$(echo ${allHeaders//  / })"

if ! [ -z "$data" ]; then
  data="-d'$data'"
fi

if $verbose; then
  echo "curl -v -X$method $allHeaders $data $url" |tee -a $resultsFile
else
  echo "curl -v -X$method $allHeaders $data $url" > $resultsFile
fi

echo >> $resultsFile

output=$(eval "curl -v -X$method $allHeaders $data $url" 2>> $resultsFile)

# try to parse json, otherwise just print it out
(echo "$output" | python -m json.tool 2>/dev/null || echo "$output") |tee -a $resultsFile
