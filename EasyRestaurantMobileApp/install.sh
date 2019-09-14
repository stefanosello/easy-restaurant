cd ../frontend && rm -r dist && ng build --configuration cordova
cd ../EasyRestaurantMobileApp && rm -r ./www/* && cp ../frontend/dist/easy-restaurant-frontend/* ./www/ -r
cordova build android
cordova emulate android