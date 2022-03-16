rm -rf korangle.zip korangle/
node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --configuration=staging --build-optimizer
mv dist/ korangle
npm run post-build-staging $1
zip -r korangle.zip korangle/
