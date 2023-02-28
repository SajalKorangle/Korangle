moduleName=''
while [[ ! -d "src/app/modules/$moduleName" || -z "$moduleName" ]];
do
	read -p "Enter Module Name: "  moduleName
	if [ ! -d "src/app/modules/$moduleName" ]; then
		echo $moduleName is not a valid module name
	fi
done;
#echo $moduleName" is a valid module name"

pageName=''
while [ -z "$pageName" ];
do
	read -p "Enter the page name: " pageName
done;
#echo $pageName

## Extracing Component Name ##
componentName="${pageName/-/ }"
capitalize_words() {
    typeset string string_out
    string=$1
    string_out=''
    read -r -a words <<<"$string"
    for word in "${words[@]}"; do
      [[ -n "$string_out" ]] && string_out+=" "
      first_letter=${word:0:1}
      rest=${word:1}
      string_out+="$(printf '%s\n' "$first_letter" | tr '[:lower:]' '[:upper:]')"
      string_out+="$rest"
    done
    echo "$string_out"
}
componentName=$(capitalize_words "$componentName")
componentName="${componentName/ /}"
# echo $componentName

## Creating Files
mkdir -p src/app/modules/$moduleName/pages/$pageName

# file_suffix_array=('module.ts' 'routing.ts' 'component.ts' 'component.html' 'component.css' 'service.adapter.ts' 'html.renderer.ts')
file_suffix_array=('module.ts' 'routing.ts' 'component.ts' 'component.html' 'component.css')

for file_suffix in "${file_suffix_array[@]}";
do
  cp scripts/development/sample-page-files/page-name.$file_suffix src/app/modules/$moduleName/pages/$pageName/$pageName.$file_suffix
	sed -i '' "s/page-name/$pageName/g" "src/app/modules/$moduleName/pages/$pageName/$pageName.$file_suffix"
	sed -i '' "s/PageName/$componentName/g" "src/app/modules/$moduleName/pages/$pageName/$pageName.$file_suffix"
done

