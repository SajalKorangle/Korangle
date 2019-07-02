rm -rf korangle.zip korangle/
ng build --prod --build-optimizer
mv dist/ korangle
npm run post-build $1
cp version.json korangle/version.json
zip -r korangle.zip korangle/
