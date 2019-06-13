# go in backend dir
cd ./backend
# install backend packages
npm install
# compile backend packages
tsc
# go in frontend dir
cd ../frontend
# install frontend packages
npm install
# build angular app
ng build --prod
# copy compiled code into local backend dir
cp -r ./dist/easy-restaurant-frontend/* ../backend/src/locals
# back to backend
cd ../backend
# start server
npm serve