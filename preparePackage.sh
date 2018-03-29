rm -rf brighstar.tar.gz brightstar/
ng build --prod --build-optimizer
mv dist/ brightstar
tar -zcvf brightstar.tar.gz brightstar/
