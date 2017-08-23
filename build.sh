echo 'Step 0: Kill ALL THE THINGS... in `dist/`'

rm -rf dist/*

echo 'Step 1: Copy all the HTML and JS'
cp src/index.html dist/
mkdir dist/app
cp -r src/app dist/

mkdir dist/partials
cp -r src/partials dist/

mkdir dist/js
cp -r src/js dist/

echo 'Step 2: Build all the Sass into CSS!'
mkdir dist/css
npm run sass
cp src/css/main.css dist/css/main.css

echo 'Step 3: Copy all the `bower_components/`!'

echo 'Step 3a: Normalize the CSS...'
mkdir -p dist/bower_components/normalize-css/
cp bower_components/normalize-css/normalize.css dist/bower_components/normalize-css/normalize.css

echo 'Step 3b: copy more bower components'
mkdir -p dist/bower_components/angular-cookies/
cp bower_components/angular-cookies/angular-cookies.min.js dist/bower_components/angular-cookies/angular-cookies.min.js
# cp bower_components/angular-cookies/angular-cookies.min.js.map dist/bower_components/angular-cookies/angular-cookies.min.js.map

mkdir -p dist/bower_components/angular-route/
cp bower_components/angular-route/angular-route.min.js dist/bower_components/angular-route/angular-route.min.js
# cp bower_components/angular-route/angular-route.min.js.map dist/bower_components/angular-route/angular-route.min.js.map

mkdir -p dist/bower_components/angular-timer/dist/
cp bower_components/angular-timer/dist/angular-timer.js dist/bower_components/angular-timer/dist/angular-timer.js

mkdir -p dist/bower_components/angular-validation-match/dist/
cp bower_components/angular-validation-match/dist/angular-validation-match.min.js dist/bower_components/angular-validation-match/dist/angular-validation-match.min.js

mkdir -p dist/bower_components/angular/
cp bower_components/angular/angular.min.js dist/bower_components/angular/angular.min.js
# cp bower_components/angular/angular.min.js.map dist/bower_components/angular/angular.min.js.map

mkdir -p dist/bower_components/humanize-duration/
cp bower_components/humanize-duration/humanize-duration.js dist/bower_components/humanize-duration/humanize-duration.js

mkdir -p dist/bower_components/jquery/dist/
cp bower_components/jquery/dist/jquery.min.js dist/bower_components/jquery/dist/jquery.min.js
# cp bower_components/jquery/dist/jquery.min.map dist/bower_components/jquery/dist/jquery.min.map

mkdir -p dist/bower_components/modernizr/
cp bower_components/modernizr/modernizr.js dist/bower_components/modernizr/modernizr.js

mkdir -p dist/bower_components/moment/min/
cp bower_components/moment/min/moment.min.js dist/bower_components/moment/min/moment.min.js

# mkdir -p dist/bower_components/d3/
# cp bower_components/d3/d3.js dist/bower_components/d3/d3.js

echo 'Step 4: Copy img folder'
cp  -r src/img/ dist/img/
cp  -r src/img/favicons/favicon.ico dist/favicon.ico

echo 'Step 5: Copy audio folder'
cp  -r src/audio/ dist/audio/

echo 'Step 6: verify working project in dist/'
npm run start:dist
