ng serve --host $(hostname -I | awk '{print $1}') --port 4200 --configuration=mobile
