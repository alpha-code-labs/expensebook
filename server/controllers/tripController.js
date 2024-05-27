import reporting from '../models/reportingSchema.js';
import { getWeekRange, getMonthRange, getQuarterRange } from '../helpers/dateHelpers.js';
import hrmaster from '../models/hrCompanySchema.js';

// export const filterTrips = async (req, res) => {
//   const { filterBy, date } = req.body;
//   let filterCriteria = {};
//      console.log("filterTRIPs", req.body)
//   try {
//     if (filterBy && date) {
//       const parsedDate = new Date(date);

//       switch (filterBy) {
//         case 'date':
//           filterCriteria = {
//             'tripSchema.tripStateDate': {
//               $gte: parsedDate,
//               $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
//             },
//           };

//           console.log("filterCriteria", filterCriteria)
//           break;
//         case 'week':
//           const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
//           filterCriteria = {
//             'tripSchema.tripStateDate': {
//               $gte: startOfWeek,
//               $lt: endOfWeek,
//             },
//           };
//           break;
//         case 'month':
//           const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
//           filterCriteria = {
//             'tripSchema.tripStateDate': {
//               $gte: startOfMonth,
//               $lt: endOfMonth,
//             },
//           };
//           break;
//         case 'quarter':
//           const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
//           filterCriteria = {
//             'tripSchema.tripStateDate': {
//               $gte: startOfQuarter,
//               $lt: endOfQuarter,
//             },
//           };
//           break;
//         default:
//           return res.status(400).json({ message: 'Invalid filter criteria' });
//       }
//     }

//     const trips = await reporting.find(filterCriteria);
//     res.json(trips);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const filterTrips = async (req, res) => {
  const { filterBy, date } = req.body;
  let filterCriteria = {};

  console.log("filterTRIPs", req.body);

  try {
    if (filterBy && date) {
      const parsedDate = new Date(date);

      switch (filterBy) {
        case 'date':
          filterCriteria = {
            'tripSchema.tripCompletionDate': {
              $gte: parsedDate,
              $lt: new Date(parsedDate.setDate(parsedDate.getDate() + 1)),
            },
          };
          break;

        case 'week':
          const { startOfWeek, endOfWeek } = getWeekRange(parsedDate);
          filterCriteria = {
            'tripSchema.tripCompletionDate': {
              $gte: startOfWeek,
              $lt: new Date(endOfWeek.setDate(endOfWeek.getDate() + 1)),
            },
          };
          break;

        case 'month':
          const { startOfMonth, endOfMonth } = getMonthRange(parsedDate);
          filterCriteria = {
            'tripSchema.tripCompletionDate': {
              $gte: startOfMonth,
              $lt: new Date(endOfMonth.setDate(endOfMonth.getDate() + 1)),
            },
          };
          break;

        case 'quarter':
          const { startOfQuarter, endOfQuarter } = getQuarterRange(parsedDate);
          filterCriteria = {
            'tripSchema.tripCompletionDate': {
              $gte: startOfQuarter,
              $lt: new Date(endOfQuarter.setDate(endOfQuarter.getDate() + 1)),
            },
          };
          break;

        case 'year':
          const startOfYear = new Date(parsedDate.getFullYear(), 0, 1);
          const endOfYear = new Date(parsedDate.getFullYear() + 1, 0, 0);
          filterCriteria = {
            'tripSchema.tripCompletionDate': {
              $gte: startOfYear,
              $lt: new Date(endOfYear.setDate(endOfYear.getDate() + 1)),
            },
          };
          break;

        default:
          break;
      }

      console.log("filterCriteria", filterCriteria);
    }

    // Perform the database query using filterCriteria
    const trips = await reporting.find(filterCriteria);
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getExpenseRelatedHrData = async (req, res) => {
    try {
        const { tenantId, tenantName } = req.params;

        // Find the matching document in HRCompany based on tenantId and tenantName
        const companyDetails = await hrmaster.findOne({ tenantId, tenantName });

        if (!companyDetails) {
            return res.status(404).json({ message: 'Company details not found' });
        }

        // Extract and send the defaultCurrency
        const defaultCurrency = companyDetails.companyDetails.defaultCurrency;

        // Get travelAllocations
        const travelAllocations = companyDetails?.travelAllocations;

        // Get advanceSettlementOptions
        const advanceSettlementOptions = companyDetails?.advanceSettlementOptions;

        // Get expenseSettlementOptions
        const expenseSettlementOptions = companyDetails?.expenseSettlementOptions;

        res.status(200).json({ defaultCurrency, travelAllocations, advanceSettlementOptions, expenseSettlementOptions });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};




