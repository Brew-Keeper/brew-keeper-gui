echo 'Step 0: Kill ALL THE THINGS... in `dist/`'

rm -rf dist/*

echo 'Step 1: Copy all the HTML'
cp src/index.html dist/
mkdir dist/partials
cp -r src/partials dist/

echo 'Step 2: Build all the Sass into CSS!'
mkdir dist/css
node-sass src/scss/main.scss dist/css/main.css

echo 'Step 3: Copy all the JS'
mkdir -p dist/js
cp -r src/js dist/

echo 'Step 4: Copy all the `bower_components/`!'

echo 'Step 4a: Normalize the CSS...'
mkdir -p dist/bower_components/normalize-css/
cp bower_components/normalize-css/normalize.css dist/bower_components/normalize-css/normalize.css

echo 'Step 4b: copy more bower components'
mkdir -p dist/bower_components/jquery/dist/
cp bower_components/jquery/dist/jquery.js dist/bower_components/jquery/dist/jquery.js

mkdir -p dist/bower_components/angular/
cp bower_components/angular/angular.js dist/bower_components/angular/angular.js

mkdir -p dist/bower_components/angular-route/
cp bower_components/angular-route/angular-route.js dist/bower_components/angular-route/angular-route.js

mkdir -p dist/bower_components/modernizr/
cp bower_components/modernizr/modernizr.js dist/bower_components/modernizr/modernizr.js

mkdir -p dist/bower_components/angular-timer/dist/
cp bower_components/angular-timer/dist/angular-timer.js dist/bower_components/angular-timer/dist/angular-timer.js

mkdir -p dist/bower_components/momentjs/
cp bower_components/momentjs/moment.js dist/bower_components/momentjs/moment.js

mkdir -p dist/bower_components/humanize-duration/
cp bower_components/humanize-duration/humanize-duration.js dist/bower_components/humanize-duration/humanize-duration.js

mkdir -p dist/bower_components/angular-cookies/
cp bower_components/angular-cookies/angular-cookies.js dist/bower_components/angular-cookies/angular-cookies.js

# mkdir -p dist/bower_components/d3/
# cp bower_components/d3/d3.js dist/bower_components/d3/d3.js

echo 'Step 5: Copy img folder'
cp  -r src/img/ dist/img
cp  -r src/favicon.ico dist/favicon.ico

echo 'Step 6: verify working project in dist/'
npm run start:dist
