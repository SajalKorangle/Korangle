for branch in `git branch | sed 's/\*//'`; do
	remoteBranch=`git ls-remote --heads origin "$branch"`
	if [[ -z $remoteBranch ]]; then
		echo $branch
	fi
done
