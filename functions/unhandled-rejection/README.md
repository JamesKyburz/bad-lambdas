# unhandled promise rejection lambdas

Two lambdas

- failAfter0 creates an unhandled promise rejection after 0 seconds on each invoke
- failAfter5 creates an unhandled promise rejection after 5 seconds on each invoke

## How to test

## Get lambda arns

```sh
lambda0=$(sam list resources --region us-east-1 --stack-name 'bad-lambdas' --output json | jq -r '.[] | select (.LogicalResourceId == "UnhandledRejection0") | .PhysicalResourceId')
lambda5=$(sam list resources --region us-east-1 --stack-name 'bad-lambdas' --output json | jq -r '.[] | select (.LogicalResourceId == "UnhandledRejection5") | .PhysicalResourceId')
```

## Test the first lambda which would most likely fail on every other attempt.

```sh
# call lambda 4 times, every other call should fail
for n in {1..4}; (aws lambda invoke --function-name ${lambda0:?} --region us-east-1 --payload '{}' /dev/stdout | cat) &
```

## Test the lambda with the 5s delay which will fail when 5s has passed.

```sh
# call lambda 4 times, all 4 should return ok
for n in {1..4}; (aws lambda invoke --function-name ${lambda5:?} --region us-east-1 --payload '{}' /dev/stdout | cat) &
```

```sh
# sleep for 5
sleep 5
```

```sh
# call lambda 4 times, the first will fail, the others won't
for n in {1..4}; (aws lambda invoke --function-name ${lambda5:?} --region us-east-1 --payload '{}' /dev/stdout | cat) &
```

## Conclusion

Unhandled rejections will cause the lambda runtime to exit with 128, I even managed to get a segfault on one of the failures :).

Don't do this :)
