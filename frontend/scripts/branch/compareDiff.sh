activeBranch=`git rev-parse --abbrev-ref HEAD`
new_diff=`git diff --name-status master...$activeBranch`
new_diff=${new_diff// /}
new_diff=${new_diff//	/}
echo "Copy paste from code review file, press enter, type 'done' and then press enter again"
while :
do
	read input
	if [[ $input == "done" ]]
	then
		break
	else
		if [[ $prev_diff == "" ]]
		then
			prev_diff=$input
		else
			prev_diff="${prev_diff}\n${input}"
		fi
	fi
done

prev_diff=${prev_diff// /}
prev_diff=${prev_diff//	/}

echo "$new_diff" > new_diff
echo "$prev_diff" > prev_diff
diff new_diff prev_diff
rm new_diff
rm prev_diff
