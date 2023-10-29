import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TravelRequest from "../components/TravelRequest.jsx"
import SearchBar from "../components/common/SearchBar.jsx";

const TravelRequestsPage = () => {
    const navigate = useNavigate();
    const [travelRequests, setTravelRequests] = useState([]);
    const [searchType, setSearchType] = useState("tripName");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTravelRequests, setFilteredTravelRequests] = useState([]);
    const [cash, setCash] = useState([]);
  
    // For Travel Requests
    useEffect(() => {
      axios
        .get("http://localhost:8080/api/approvals/tr/emp004")
        .then((response) => {
          setTravelRequests(response.data);
        })
        .catch((error) => {
          console.log("Error Fetching Travel Requests:", error);
        });
    }, []);
  
    // For cash Advance
    useEffect(() => {
      axios
        .get("YOUR_CASH_ADVANCE_API_URL_HERE") // Replace with your cash advance API URL
        .then((response) => {
          setCash(response.data.cash);
        })
        .catch((error) => {
          console.log("Error Fetching Cash Advance data:", error);
        });
    }, []);
  
    // Handle search input change
    const handleSearchChange = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
  
      // Filter the travel requests based on the search term and selected search type
      const filteredResults = travelRequests.filter((request) => {
        switch (searchType) {
          case "tripName":
            return request.tripPurpose.toLowerCase().includes(term);
          case "destination":
            return (
              request.departureCity[0]?.from.toLowerCase().includes(term) ||
              request.departureCity[0]?.to.toLowerCase().includes(term)
            );
          case "employeeName":
            return request.createdBy.toLowerCase().includes(term);
          default:
            return true;
        }
      });
  
      setFilteredTravelRequests(filteredResults);
    };
  
    // Handle search type change
    const handleSearchTypeChange = (type) => {
      setSearchType(type);
      setSearchTerm(""); // Clear the search term when changing search type
      setFilteredTravelRequests([]); // Clear filtered results
    };

  return (
    <div className="relative rounded-2xl bg-white box-border w-[912px] h-[439px] overflow-scroll shrink-0 text-left text-base text-black font-cabin border-[1px] border-solid border-gainsboro-200">
      <div className="absolute top-[24px] left-[36px]">Travel Requests</div>
      <div className="absolute top-[154px] left-[8px] flex flex-col items-start justify-between gap-[4px] text-sm text-ebgrey-600">
          <div className="bg-white flex flex-row items-start justify-center gap-[24px]">
            <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[calc(50%-8px)] left-[27px] font-medium">
                Employee Name
              </div>
            </div>
            <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[calc(50%-8px)] left-[calc(50%-26px)] font-medium">
                Travel Name
              </div>
            </div>
            <div className="relative w-[140px] h-14 overflow-hidden shrink-0">
              <div className="absolute top-[20px] left-[calc(50%-32px)] font-medium">
                Destinations
              </div>
            </div>
            <div className="relative w-60 h-14 overflow-hidden shrink-0">
              <div className="absolute top-[20px] left-[calc(50%-32px)] font-medium">
                Dates
              </div>
            </div>
            <div className="relative w-60 h-14 overflow-hidden shrink-0">
              <div className="absolute top-[20px] left-[calc(50%-32px)] font-medium">
                Actions
              </div>
            </div> 
          </div>
          <SearchBar
  searchType={searchType}
  handleSearchTypeChange={handleSearchTypeChange}
  searchTerm={searchTerm}
  handleSearchChange={handleSearchChange}
/>

{/* Render Travel Requests */}
{filteredTravelRequests.map((request) => (
  <TravelRequest key={request.id} request={request} />
))}
</div>
</div>
  );
};

export default TravelRequestsPage;
