const tripDummyData = {
    tripNumber:"TRIP000000232",
    tenantId: "TNTABG",
    tenantName: "Example Tenant",
    companyName: "Example Company",
    userId: {
      empId: "exampleEmpId",
      name: "John Doe",
    },
    tripId: "6587f7d3f1bc28bda7fd77d4",
   
    tripPurpose: "Business Trip with instaMart",
    tripStatus: "approved",
    tripStartDate: "23-Dec-2023",
    tripCompletionDate: "25-Dec-2023",
    isSentToExpense: false,
    notificationSentToDashboardFlag: false,
    travelRequestData: {
      tenantId: "exampleTenantId",
      tenantName: "Example Tenant",
      companyName: "Example Company",
      travelRequestId: "exampleTravelRequestId",
      travelRequestNumber: "TR00001",
      tripPurpose: "Business Trip",
      travelRequestStatus: "draft",
      travelRequestState: "section 0",
      createdBy: {
        empId: "exampleCreatedByEmpId",
        name: "Jane Doe",
      },
      createdFor: {
        empId: "exampleCreatedForEmpId",
        name: "John Doe",
      },
      teamMembers: [],
      travelAllocationHeaders: [],
      itinerary: {
        formState: [
          {
            formId: "exampleFormId",
            transfers: {
              needsDeparturePickup: true,
              needsDepartureDrop: true,
              needsReturnPickup: true,
              needsReturnDrop: true,
            },
            needsHotel: true,
            needsCab: true,
            needsVisa: false,
            cancellationDate: "2023-11-28",
            cancellationReason: "Changed plans",
            formStatus: "draft",
          },
        ],
        flights: [
          {
            itineraryId: "exampleFlightItineraryId",
            formId: "exampleFormId",
            from: "City A",
            to: "City B",
            date: "2023-12-02",
            time: "08:00 AM",
            travelClass: "Business",
            isReturnTravel: "false",
            violations: {
              class: "Example Violation Class",
              amount: "Example Violation Amount",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2023-12-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Business",
            bkd_isReturnTravel: "false",
            modified: false,
            cancellationDate: new Date("2023-11-28"),
            cancellationReason: "Changed plans",
            status: "paid and cancelled",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {
                amount:"5000"
              },
            },
          },
          {
            itineraryId: "exampleFlightItineraryId2",
            formId: "exampleFormId",
            from: "City A",
            to: "City B",
            date: "2023-12-02",
            time: "08:00 AM",
            travelClass: "Business",
            isReturnTravel: "false",
            violations: {
              class: "Example Violation Class",
              amount: "Example Violation Amount",
            },
            bkd_from: "City A",
            bkd_to: "City B",
            bkd_date: "2023-12-02",
            bkd_time: "10:00 AM",
            bkd_travelClass: "Business",
            bkd_isReturnTravel: "false",
            modified: false,
            cancellationDate: new Date("2023-11-28"),
            cancellationReason: "Changed plans",
            status: "paid and cancelled",
            bookingDetails: {
              docURL: "exampleDocURL",
              docType: "exampleDocType",
              billDetails: {
                amount:"5000"
              },
            },
          },
        ],
        buses: [
            {
              itineraryId: "exampleBusItineraryId1",
              formId: "exampleFormId",
              from: "City C",
              to: "City D",
              date: "2023-12-03",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City C",
              bkd_to: "City D",
              bkd_date: "2023-12-03",
              bkd_time: "01:00 PM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleBusDocURL",
                docType: "exampleBusDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "exampleBusItineraryId2",
              formId: "exampleFormId",
              from: "City C",
              to: "City D",
              date: "2023-12-03",
              time: "10:00 AM",
              travelClass: "Economy",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City C",
              bkd_to: "City D",
              bkd_date: "2023-12-03",
              bkd_time: "01:00 PM",
              bkd_travelClass: "Economy",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleBusDocURL",
                docType: "exampleBusDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          trains: [
            {
              itineraryId: "TrainItineraryId1",
              formId: "exampleFormId",
              from: "City E",
              to: "City F",
              date: "2023-12-04",
              time: "02:00 PM",
              travelClass: "First Class",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City E",
              bkd_to: "City F",
              bkd_date: "2023-12-04",
              bkd_time: "05:00 PM",
              bkd_travelClass: "First Class",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleTrainDocURL",
                docType: "exampleTrainDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "TrainItineraryId2",
              formId: "exampleFormId",
              from: "City E",
              to: "City F",
              date: "2023-12-04",
              time: "02:00 PM",
              travelClass: "First Class",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_from: "City E",
              bkd_to: "City F",
              bkd_date: "2023-12-04",
              bkd_time: "05:00 PM",
              bkd_travelClass: "First Class",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleTrainDocURL",
                docType: "exampleTrainDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          hotels: [
            {
              itineraryId: "HotelItineraryId",
              formId: "exampleFormId",
              location: "Hotel G",
              locationPreference: "City View",
              class: "Luxury",
              checkIn: "2023-12-05",
              checkOut: "2023-12-07",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_location: "Hotel G",
              bkd_class: "Luxury",
              bkd_checkIn: "2023-12-05",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
            {
              itineraryId: "HotelItineraryId2",
              formId: "exampleFormId",
              location: "Hotel G",
              locationPreference: "City View",
              class: "Luxury",
              checkIn: "2023-12-05",
              checkOut: "2023-12-07",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_location: "Hotel G",
              bkd_class: "Luxury",
              bkd_checkIn: "2023-12-05",
              bkd_checkOut: "2023-12-07",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleHotelDocURL",
                docType: "exampleHotelDocType",
                billDetails: {
                  amount:"5000"
                },
              },
            },
          ],
          cabs: [
            {
              itineraryId: "exampleCabItineraryId",
              formId: "exampleFormId",
              date: "2023-12-08",
              class: "Sedan",
              preferredTime: "08:00 AM",
              pickupAddress: "City H",
              dropAddress: "City I",
              isReturnTravel: "false",
              violations: {
                class: "Example Violation Class",
                amount: "Example Violation Amount",
              },
              bkd_date: "2023-12-08",
              bkd_class: "Sedan",
              bkd_preferredTime: "08:00 AM",
              bkd_pickupAddress: "City H",
              bkd_dropAddress: "City I",
              bkd_isReturnTravel: "false",
              modified: false,
              cancellationDate: new Date("2023-11-28"),
              cancellationReason: "Changed plans",
              status: "paid and cancelled",
              bookingDetails: {
                docURL: "exampleCabDocURL",
                docType: "exampleCabDocType",
                billDetails: {
                  amount:"5000"
                },
              },
              type: "regular",
            },
          ],
        // Include similar data for buses, trains, hotels, and cabs
      },
      tripType: { oneWayTrip: true, roundTrip: false, multiCityTrip: false },
      travelDocuments: ["exampleDocument1", "exampleDocument2"],
      bookings: [
        {
          itineraryReference: {},
          docURL: "exampleDocURL",
          details: {},
          status: {},
        },
      ],
      approvers: [
        {
          empId: "exampleApproverEmpId",
          name: "Approver 1",
          status: "pending approval",
        },
      ],
      assignedTo: { empId: "exampleAssignedToEmpId", name: "Assignee" },
      bookedBy: { empId: "exampleBookedByEmpId", name: "Booker" },
      recoveredBy: { empId: "exampleRecoveredByEmpId", name: "Recoverer" },
      preferences: ["Preference 1", "Preference 2"],
      travelViolations: {},
      travelRequestDate: "2023-11-25",
      travelBookingDate: new Date(),
      travelCompletionDate: new Date("2023-12-10"),
      cancellationDate: new Date("2023-11-28"),
      travelRequestRejectionReason: "Rejected due to XYZ",
      isCancelled: false,
      cancellationReason: "",
      isCashAdvanceTaken: false,
      sentToTrip: false,
    },
    cashAdvancesData: [
      {
        tenantId: "exampleTenantId",
        travelRequestId: "exampleTravelRequestId",
        travelRequestNumber: "TR00001",
        cashAdvanceId: "exampleCashAdvanceId",
        cashAdvanceNumber: "CA00001",
        createdBy: {
          empId: "exampleCreatedByEmpId",
          name: "John Doe",
        },
        cashAdvanceStatus: "draft",
        cashAdvanceState: "section 0",
        amountDetails: [
          {
            amount: 1000,
            currency: {},
            mode: "Cash",
          },
        ],
        approvers: [
          {
            empId: "exampleApproverEmpId",
            name: "Approver 1",
            status: "pending approval",
          },
        ],
        assignedTo: { empId: "exampleAssignedToEmpId", name: "Assignee" },
        paidBy: { empId: "examplePaidByEmpId", name: "Payer" },
        recoveredBy: { empId: "exampleRecoveredByEmpId", name: "Recoverer" },
        cashAdvanceRequestDate: new Date(),
        cashAdvanceApprovalDate: new Date("2023-11-29"),
        cashAdvanceSettlementDate: new Date("2023-12-10"),
        cashAdvanceViolations: "Violations found",
        cashAdvanceRejectionReason: "Rejected due to XYZ",
      },
    ],


    travelExpenses:[
      {
      tenantId: 'sampleTenantId',
      tenantName: 'Sample Tenant',
      companyName: 'Sample Company',
      travelRequestId: "trid-6876876", // For travel expense only
      expenseHeaderId: 'expenseheaderid767',
      expenseHeaderNumber: 'EXP12345',
      expenseHeaderType: 'travel',
      createdBy: {
        empId: 'emp123',
        name: 'John Doe',
      },
      createdFor: {
        empId: 'emp456',
        name: 'Jane Doe',
      },
      teamMembers: [
        { empId: 'emp789', name: 'Alice Doe' },
        { empId: 'emp101', name: 'Bob Doe' },
      ],
      expenseHeaderStatus: 'draft',
     


      alreadyBookedExpenseLines: [
        {
          transactionData: {
            businessPurpose: 'Meeting',
            vendorName: 'Vendor A',
            billNumber: '123',
            billDate: '2023-01-01',
            grossAmount: 500,
            taxes: 50,
            totalAmount: 550,
            description: 'Expense description',
          },
          lineItemStatus: 'submit',
          expenseLineAllocation: [
            {
              headerName: 'Travel',
              headerValues: ['Flight', 'Hotel'],
            },
          ],
          expenseLineCategory: [
            {
              categoryName: 'Flights',
              accountLine: 'Travel Expenses',
            },
          ],
          modeOfPayment: 'Credit Card',
          isInMultiCurrency: false,
          isPersonalExpense: false,
          billImageUrl: 'http://example.com/bill-image.jpg',
          billRejectionReason: 'Invalid bill',
        },
      ],
      expenseLines: [
          {
            transactionData: {
              businessPurpose: 'Meeting',
              vendorName: 'Vendor A',
              billNumber: '123',
              billDate: '2023-01-01',
              grossAmount: 500,
              taxes: 50,
              totalAmount: 550,
              description: 'Expense description',
            },
            lineItemStatus: 'submit',
            expenseLineAllocation: [
              {
                headerName: 'Travel',
                headerValues: ['Flight', 'Hotel'],
              },
            ],
            expenseLineCategory: [
              {
                categoryName: 'Flights',
                accountLine: 'Travel Expenses',
              },
            ],
            modeOfPayment: 'Credit Card',
            isInMultiCurrency: false,
            isPersonalExpense: false,
            billImageUrl: 'http://example.com/bill-image.jpg',
            billRejectionReason: 'Invalid bill',
          },
       
      ],
      approvers: [
        {
          empId: 'emp999',
          name: 'Approver 1',
          status: 'pending approval',
        },
        {
          empId: 'emp888',
          name: 'Approver 2',
          status: 'pending approval',
        },
      ],
      expenseViolations: ['Category mismatch', 'Amount exceeds limit'],
      expenseRejectionReason: '',
      expenseSubmissionDate: new Date(),
      }
    ],
    expenseAmountStatus: {
      totalCashAmount: 1000,
      totalExpenseAmount: 1500,
      totalPersonalExpense: 500,
      remainingCash: 500,
    },
   




  };
 
  module.exports =  tripDummyData;



//  const { tenantId } = req.params;
        // const { currencyName, totalAmount, personalAmount, nonPersonalAmount,  } = req.body;

