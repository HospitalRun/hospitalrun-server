#!/bin/bash


# Replaces all includes with respective files

oneOrTwo='[12]{1}'
if [[ ! $# =~ $oneOrTwo ]]; then
  echo "Usage: $(basename $0) raml_file [output_raml]"
  exit 1
fi

output=${2-output.raml}
rm -f $output

IFS=''
lineMatch='([ #]*)([^!]+)!include ([^ ,}]+)([,}]*)'
contentLine='^([ ]*|[ ]*#.*)$'
nestedInclude='([^!]*)!include ([^ ,}]+)'

# cd script dir
cd "$(dirname ${BASH_SOURCE[0]})"

while read -r line; do
  if [[ "$line" =~ $lineMatch ]]; then
    indentation="${BASH_REMATCH[1]}"
    beforeInclude="${BASH_REMATCH[2]}"
    includeFile="${BASH_REMATCH[3]}"
    trailingChars="${BASH_REMATCH[4]}"
    spacing='  '
    if [[ $includeFile =~ \.json ]]; then
      echo "#${indentation}${beforeInclude} !include ${includeFile}${trailingChars}" >>$output
      echo -n "${indentation}${beforeInclude} " >>$output
      spacing=''
    else
      echo "${indentation}${beforeInclude}#!include ${includeFile}${trailingChars}" >>$output
    fi

    while read -r includeLine; do
      if [[ ! "$includeLine" =~ $contentLine ]] && [[ "$includeLine" =~ .*+ ]]; then
        if [[ "$includeLine" =~ $nestedInclude ]]; then
          cd $(dirname $(dirname ${includeFile})/${BASH_REMATCH[2]})
          relPath="$(pwd |sed 's|.*spec/||')/$(echo ${BASH_REMATCH[2]} |sed 's|.*/||')"
          cd - &>/dev/null
          echo "${indentation}${spacing}${BASH_REMATCH[1]}!include ${relPath}" >> $output
        else
          echo "${indentation}${spacing}${includeLine}" >> $output
        fi
      fi
    done <$includeFile
    if [ -n "$trailingChars" ]; then
      echo "${indentation}${trailingChars}" >>$output
    fi
  else
    echo "$line" >> $output
  fi
done <$1
