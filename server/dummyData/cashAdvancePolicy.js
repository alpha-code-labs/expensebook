export const policies = {
    "policies": {
      "international": {
        "group 1": {
          "trip purpose": {
            "client meeting": { "allowed": true, "violationMessage": "Your company doesn't allow you to travel for meeting clients" },
            "training": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel for training" },
            "business": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel for business purposes" },
            "personal": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel for personal purposes" },
            "other": { "allowed": true, "violationMessage": "" }
          },
          "airfare class": {
            "economy": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel Economy Class" },
            "business": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel Business Class" },
            "premium economy": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel Premium Economy Class" },
            "private": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel Private Class" }
          },
          "airfare budget": 10000,
          "railway class": {
            "1st class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 1st class" },
            "2nd class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 2nd class" },
            "3rd class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 3rd class" }
          },
          "railway budget": 6000,
          "car rentals class": {
            "Sedan": { "allowed": true, "violationMessage": "Your company policies allow you to book Sedan cabs" },
            "Mini": { "allowed": true, "violationMessage": "Your company policies allow you to book mini cabs" }
          },
          "car rentals budget": { "amount": 1200, "violationMessage": "Car rental budget exceeded" },
          "hotel class": {
            "2 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 2-star hotels" },
            "3 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 3-star hotels" },
            "4 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 4-star hotels" },
            "5 star": { "allowed": false, "violationMessage": "Your company policies do not allow you to book 5-star hotels" }
          },
          "hotel budget": { "amount": 8000, "violationMessage": "Hotel booking amount exceeds the allowed limit" },
          "cash advance": { "amount": 15000, "violationMessage": "Maximum allowed cash advance limit exceeded" },
          "meal allowance": { "amount": 700, "violationMessage": "Meal allowance budget exceeded" },
          "expense submission deadline": { "days": 14, "violationMessage": "Your expense submission is overdue" },
          "per-diem allowance": { "amount": 10000, "violationMessage": "Per day allowance limit exceeded" }
        }
      },
      "domestic": {
        "group 1": {
          "trip purpose": {
            "client meeting": { "allowed": true, "violationMessage": "Your company doesn't allow you to travel for meeting clients" },
            "training": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel for training" },
            "business": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel for business purposes" },
            "personal": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel for personal purposes" },
            "other": { "allowed": true, "violationMessage": "" }
          },
          "airfare class": {
            "economy": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel Economy Class" },
            "business": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel Business Class" },
            "premium economy": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel Premium Economy Class" },
            "private": { "allowed": true, "violationMessage": "Your company policies do not allow you to travel Private Class" }
          },
          "airfare budget": 10000,
          "railway class": {
            "1st class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 1st class" },
            "2nd class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 2nd class" },
            "3rd class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 3rd class" }
          },
          "railway budget": 6000,
          "car rentals class": {
            "Sedan": { "allowed": true, "violationMessage": "Your company policies allow you to book Sedan cabs" },
            "Mini": { "allowed": true, "violationMessage": "Your company policies allow you to book mini cabs" }
          },
          "car rentals budget": { "amount": 1200, "violationMessage": "Car rental budget exceeded" },
          "hotel class": {
            "2 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 2-star hotels" },
            "3 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 3-star hotels" },
            "4 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 4-star hotels" },
            "5 star": { "allowed": false, "violationMessage": "Your company policies do not allow you to book 5-star hotels" }
          },
          "hotel budget": { "amount": 8000, "violationMessage": "Hotel booking amount exceeds the allowed limit" },
          "cash advance": { "amount": 15000, "violationMessage": "Maximum allowed cash advance limit exceeded" },
          "meal allowance": { "amount": 700, "violationMessage": "Meal allowance budget exceeded" },
          "expense submission deadline": { "days": 14, "violationMessage": "Your expense submission is overdue" },
          "per-diem allowance": { "amount": 10000, "violationMessage": "Per day allowance limit exceeded" }
        },
        "group 2": {
          "trip purpose": {
            "client meeting": { "allowed": true, "violationMessage": "Your company doesn't allow you to travel for meeting clients" },
            "training": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel for training" },
            "business": { "allowed": true, "violationMessage": "Your company policies allow you to travel for business purposes" },
            "personal": { "allowed": true, "violationMessage": "Your company policies allow you to travel for personal purposes" },
            "other": { "allowed": true, "violationMessage": "" }
          },
          "airfare class": {
            "economy": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel Economy Class" },
            "business": { "allowed": true, "violationMessage": "Your company policies allow you to travel Business Class" },
            "premium economy": { "allowed": true, "violationMessage": "Your company policies allow you to travel Premium Economy Class" },
            "private": { "allowed": true, "violationMessage": "Your company policies allow you to travel Private Class" }
          },
          "airfare budget": 12000,
          "railway class": {
            "1st class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 1st class" },
            "2nd class": { "allowed": false, "violationMessage": "Your company policies do not allow you to travel via 2nd class" },
            "3rd class": { "allowed": true, "violationMessage": "Your company policies allow you to travel via 3rd class" }
          },
          "railway budget": 8000,
          "car rentals class": {
            "Sedan": { "allowed": true, "violationMessage": "Your company policies allow you to book Sedan cabs" },
            "Mini": { "allowed": false, "violationMessage": "Your company policies do not allow you to book mini cabs" }
          },
          "car rentals budget": { "amount": 1500, "violationMessage": "Car rental budget exceeded" },
          "hotel class": {
            "2 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 2-star hotels" },
            "3 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 3-star hotels" },
            "4 star": { "allowed": true, "violationMessage": "Your company policies allow you to book 4-star hotels" },
            "5 star": { "allowed": false, "violationMessage": "Your company policies do not allow you to book 5-star hotels" }
          },
          "hotel budget": { "amount": 9000, "violationMessage": "Hotel booking amount exceeds the allowed limit" },
          "cash Advance": { "amount": 20000, "violationMessage": `Maximum allowed cash advance limit exceeded` },
          "meal allowance": { "amount": 800, "violationMessage": "Meal allowance budget exceeded" },
          "expense submission deadline": { "days": 14, "violationMessage": "Your expense submission is overdue" },
          "per-diem allowance": { "amount": 12000, "violationMessage": "Per day allowance limit exceeded" }
        }
      }
    }
  }