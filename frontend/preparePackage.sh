rm -rf korangle.zip korangle/
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --build-optimizer
mv dist/ korangle
npm run post-build mobile
cp version.json korangle/version.json
zip -r korangle.zip korangle/
mv korangle.zip ./korangle/
