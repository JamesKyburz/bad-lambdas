# leak file descriptors

Two lambdas

- leak1 leaks a single file descriptor on each invoke
- leak100 leaks a 100 file descriptors on each invoke

## How to test

## Get lambda arns

```sh
lambda1=$(sam list resources --region us-east-1 --stack-name 'bad-lambdas' --output json | jq -r '.[] | select (.LogicalResourceId == "LeakFileDescriptors1") | .PhysicalResourceId')
lambda100=$(sam list resources --region us-east-1 --stack-name 'bad-lambdas' --output json | jq -r '.[] | select (.LogicalResourceId == "LeakFileDescriptors100") | .PhysicalResourceId')
```

## Test the first lambda the fileDescriptors should increase by 1 on each invoke

```sh
# call lambda 4 times
for n in {1..4}; aws lambda invoke --function-name ${lambda0:?} --region us-east-1 --payload '{}' /dev/stdout | cat
```

## Test the lambda that leaks 100 file descriptors to test file descriptor starvation

```sh
# call lambda 22 times to see what file descriptor count you get to, and how many instances lambda spins up :)
for n in {1..22}; aws lambda invoke --function-name ${lambda100:?} --region us-east-1 --payload '{}' /dev/stdout | cat
```

## Conclusion

- Instantiate aws sdk clients outside the lambda handler, otherwise you risk leaking file descriptors.
- The lifetime of a lambda instance is unknown, you can run out of file descriptors :).
- Tests showed that either your lambda runtime process will be killed with Runtime exited with error: signal: killed, or that lambda will try and spin up new instances when file descriptor count becomes too high.
- When the open file descriptor count is over 700 you can get extremely slow response times, because all async IO grinds to a halt.
- When the lambda does timeout, you will get a new instance.
- Timeout will be highly likely when the file descriptor count is high, our test lambda timed out a few times after 5 minutes!
- Don't do this :)
