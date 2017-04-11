#!/bin/bash
#

gulp deploy

NODE_ENV=production browserify -g browserify-css ./build/client.js -g [envify --NODE_ENV 'production']  > dist/bundle.js
# NODE_ENV=production webpack -p --progress

#BABEL_ENV=production node_modules/.bin/babili dist/bundle.js -o dist/bundle.min.js

#cp public/lib/bundle.js /home/suso/copyrightcentral/var/www/html/copyrightcentral.arts.gla.ac.uk/www/ohoc/public/lib/bundle.js
mv ~/copyrightcentral/var/www/html/copyrightcentral.arts.gla.ac.uk/www/ohoc/public/lib/bundle.js ~/copyrightcentral/var/www/html/copyrightcentral.arts.gla.ac.uk/www/ohoc/public/lib/bundle-back.js
cp dist/bundle.js ~/copyrightcentral/var/www/html/copyrightcentral.arts.gla.ac.uk/www/ohoc/public/lib
