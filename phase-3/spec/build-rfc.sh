#!/bin/bash

set -e

MONODRAW=/Applications/Monodraw.app/Contents/Resources/monodraw
XML2RFC=xml2rfc

# If Monodraw is installed, use it to generate the RFC diagram
if [ -x "$MONODRAW" ]; then
  "$MONODRAW" seq.monopic > seq.txt;
else
  echo "Monodraw is not installed. Skipping RFC diagram generation."
fi

# Generate the RFC
"$XML2RFC" draft-vandermeulen-oauth-resource-helper-00.xml --text --html