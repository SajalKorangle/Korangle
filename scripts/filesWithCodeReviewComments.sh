grep -rl 'Code Review' frontend/src
grep -rl --exclude="./backend/*.pyc" --exclude="backend/helloworld_project/static/admin/js/vendor/select2/select2.full.js" 'Code Review' backend
