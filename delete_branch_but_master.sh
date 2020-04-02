git checkout master
for i in $(git branch | sed -e 's/^..//' -e 's/ .*//'); do
	if [[ "$i" == "master" ]]; then
		continue;
	fi
	echo $i
	echo ${i}_db.sqlite3*
	git branch -D $i
	rm ${i}_db.sqlite3*
done

