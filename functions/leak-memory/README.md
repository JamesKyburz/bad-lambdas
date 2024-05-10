# leak memory with symbols

Symbols are great (normally to save on memory), the same value can be re-used occupying the same memory.
Lot's of string allocation with the same values can leak memory, however this lambda uses symbols to leak memory :)

## How to test

## Get lambda arn

```sh
lambda=$(sam list resources --region us-east-1 --stack-name 'bad-lambdas' --output json | jq -r '.[] | select (.LogicalResourceId == "LeakMemory") | .PhysicalResourceId')
```

## Test lambda

```sh
# call lambda 2 times, on the 2nd time the lambda should run out of memory.

for n in {1..2}; aws lambda invoke --function-name ${lambda:?} --region us-east-1 --payload '{}' /dev/stdout | cat)
```

## Conclusion

Leaking memory in Lambda is normally not as serious as when running a long running process.
That said it's still bad, and depending on how long the Lambda instance lives could still make an impact.

Don't do this :)

Solutions:

Using tools like [clinic](https://clinicjs.org/) to monitor cpu, memory are still great.

Use [Lambda Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html)
