rm -rf brighstar.tar.gz brightstar/
ng build
mv dist/ brightstar
tar -zcvf brightstar.tar.gz brightstar/
