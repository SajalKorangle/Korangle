git checkout master
for i in $(git branch | sed -e 's/^..//' -e 's/ .*//'); do
	if [[ "$i" == "master" ]]; then
		continue;
	fi
	echo $i
	git branch -D $i
done

