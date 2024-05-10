# leak disk space

## How to test

## Get lambda arn

```sh
lambda=$(sam list resources --region us-east-1 --stack-name 'bad-lambdas' --output json | jq -r '.[] | select (.LogicalResourceId == "LeakDiskSpace") | .PhysicalResourceId')
```

## Test lambda

```sh
# call lambda 6 times, on the 6th time there will be no disk space left

for n in {1..6}; aws lambda invoke --function-name ${lambda:?} --region us-east-1 --payload '{}' /dev/stdout | cat)
```

## Conclusion

Writing to /tmp is fine, but if you don't take care of cleanup you might run out of disk.

Don't do this :)

Solutions:

- use [fs.promises.unlink](https://nodejs.org/docs/latest/api/fs.html#fspromisesunlinkpath)
- use either [rimraf](https://npm.im/rimraf), or [del](https://npm.im/del)
