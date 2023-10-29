for test 
run node  tests/testFetchCashAdvances.mjs 

for testing
npx mocha tests/cashBatchJob.test.js

For testing ----------------
npx mocha tests/extractAndCompareData.test.js
--------------------------------------------------


ModifyTripController.js - 

//getAllTripStatus

``` 
GET http://localhost:8080/trips/getAllTripStatus/emp000666
```
output 
```
{
    "message": "Your first date of travel is less than 10 days away. Please contact your admin for modifications."
}

or

{
    "message": "Trip modification is allowed."
}
```
GET http://localhost:8080/trips/status/650c25de4ec1688f909974ca

------------------------------------------------------------------------------------------------------
  Run batchJob 
------------------------------------------------------------------------------------------------------
```
1) Status change from upcoming to transit
```
```
http://localhost:8080/api/runBatchJob
```
output 

{
    "message": "Batch job started successfully."
}

