activeBranch=`git rev-parse --abbrev-ref HEAD`
diff=`git diff --name-status master...$activeBranch`
echo "$diff" | sed -e "s/	/ /g"
