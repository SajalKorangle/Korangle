if [ -z "$1" ]
then
	echo "Please input a file name"
else
	first=`cat $1`
	echo "Removing space from this branch's file"

# Starts -Stripping space, tab and new line from current file
	first="${first// /}"
	first="${first//	/}"
	first="${first//
/}"
# Ends -Stripping space, tab and new line from current file

	second=`git show master:$1`
	echo "Removing space from master's file"

# Starts -Stripping space, tab and new line from master file
	second="${second// /}"
	second="${second//	/}"
	second="${second//
/}"
# Ends -Stripping space, tab and new line from master file

	echo "Comparing the files"
	if [ "$first" = "$second" ]
	then
		echo "YES, the file is same"
	else
		echo "NO, the file is changed"
	fi
fi

