rm -rf brighstar.tar.gz brightstar.zip brightstar/
ng build --prod --build-optimizer
npm run post-build
mv dist/ brightstar
tar -zcvf brightstar.tar.gz brightstar/
zip -r brightstar.zip brightstar/
