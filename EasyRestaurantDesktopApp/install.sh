cd ../frontend && rm -r dist && ng build
cd ../EasyRestaurantDesktopApp && rm -r dist && cp ../frontend/dist ./ -r
npm start