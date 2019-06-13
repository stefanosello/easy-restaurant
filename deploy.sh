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
# remove old env file
rm .env
# inject new .env file
echo -e "JWT_SECRET=secret\nHTTP_PORT=8080\nMONGODB_URI=mongodb://127.0.0.1:27017/easy-restaurant?gssapiServiceName=mongodb" > .env
# start server
npm run serve