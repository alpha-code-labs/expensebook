const dummyObjects = [
      {
        "employeeDetails": {
          "empId": "0023",
          "name": "Alice Smith"
        },
        "email": "alice.smith@example.com",
        "password": "",
        "employeeRoles": {
          "employee": true,
          "employeeManager": false,
          "finance": true,
          "travelAdmin": false,
          "superAdmin": false
        },
        "temporaryPasswordFlag": true,
        "verified": false,
        "otp": "654321",
        "otpSentTime": "2024-01-20T09:30:00.000+00:00",
        "onboardingFlag": true
      },
      {
        "employeeDetails": {
          "empId": "0045",
          "name": "John Doe"
        },
        "email": "john.doe@example.com",
        "password": "",
        "employeeRoles": {
          "employee": true,
          "employeeManager": true,
          "finance": false,
          "travelAdmin": true,
          "superAdmin": false
        },
        "temporaryPasswordFlag": false,
        "verified": true,
        "otp": "987654",
        "otpSentTime": "2024-02-10T14:45:00.000+00:00",
        "onboardingFlag": false
      },
      {
        "employeeDetails": {
          "empId": "0098",
          "name": "Emily Johnson"
        },
        "email": "emily.johnson@example.com",
        "password": "",
        "employeeRoles": {
          "employee": true,
          "employeeManager": false,
          "finance": false,
          "travelAdmin": false,
          "superAdmin": true
        },
        "temporaryPasswordFlag": true,
        "verified": false,
        "otp": "123456",
        "otpSentTime": "2023-12-05T16:20:00.000+00:00",
        "onboardingFlag": true
      },
      {
        "employeeDetails": {
          "empId": "0123",
          "name": "Michael Brown"
        },
        "email": "michael.brown@example.com",
        "password": "",
        "employeeRoles": {
          "employee": true,
          "employeeManager": false,
          "finance": true,
          "travelAdmin": false,
          "superAdmin": false
        },
        "temporaryPasswordFlag": false,
        "verified": true,
        "otp": "345678",
        "otpSentTime": "2024-02-28T11:00:00.000+00:00",
        "onboardingFlag": false
      },
      {
        "employeeDetails": {
          "empId": "0156",
          "name": "Sophia Miller"
        },
        "email": "sophia.miller@example.com",
        "password": "",
        "employeeRoles": {
          "employee": true,
          "employeeManager": true,
          "finance": false,
          "travelAdmin": true,
          "superAdmin": false
        },
        "temporaryPasswordFlag": true,
        "verified": false,
        "otp": "987654",
        "otpSentTime": "2023-11-15T08:30:00.000+00:00",
        "onboardingFlag": true
      } 
  ];
  
  console.log(dummyObjects);
  