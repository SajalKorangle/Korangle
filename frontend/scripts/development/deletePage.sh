moduleName=''
while [[ ! -d "src/app/modules/$moduleName" || -z "$moduleName" ]];
do
	read -p "Enter Module Name: "  moduleName
done;
echo $moduleName" is a valid module name"

pageName=''
while [[ ! -d "src/app/modules/$moduleName/pages/$pageName" || -z "$pageName" ]];
do
	read -p "Enter the page name: " pageName
done;
echo $pageName

read -p "Are you sure you want to delete src/app/modules/$moduleName/pages/$pageName directory (Y/N)" confirm

if [ "$confirm" == "Y" ]; then
	rm -rf src/app/modules/$moduleName/pages/$pageName
	echo "Deletion completed"
fi
