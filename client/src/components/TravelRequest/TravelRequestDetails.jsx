import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../common/Loading.jsx';


const TravelRequestDetails = () => {
  const { travelRequestId } = useParams();
  const navigate = useNavigate();

  const [travelDetails, setTravelDetails] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/approvals/td/${travelRequestId}`)
      .then(response => {
        const transformedData = transformData(response.data);
        setTravelDetails(transformedData);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [travelRequestId]);

  const transformData = (data) => {
    // Implement your data transformation logic here
    const transformedData = {};
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        if (typeof data[key] === 'object') {
          transformedData[key] = transformData(data[key]);
        } else {
          transformedData[key] = data[key];
        }
      }
    }
    return transformedData;
  };

  const handleApprove = () => {
    // Implement the logic for approving the travel request
    // Make an API call to update the status to 'approved'
  };

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const handleRejectionConfirm = () => {
    // Implement the logic for rejecting the travel request
    // Make an API call to update the status to 'rejected' with or without reasons
  };

  const handleRejectionCancel = () => {
    setShowRejectionModal(false);
  };

  if (loading) {
    return <Loading />; 
  }
 if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {travelDetails ? (
        <div>

          <form>
            {Object.keys(travelDetails).map((field) => (
              <div key={field}>
                <label>{field}</label>
                <input type="text" value={travelDetails[field]} readOnly />
              </div>
      ))}
          </form>

          <div>
            <button onClick={handleApprove} className="approve-button">Approve</button>
            <button onClick={handleReject} className="deny-button">Reject</button>
          </div>
        </div>
      ) : (
        <div>No travel details available</div>
      )}

      {showRejectionModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reason for Rejection</h3>
            <textarea
              rows="4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div>
              <button onClick={handleRejectionConfirm}>Confirm</button>
              <button onClick={handleRejectionCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelRequestDetails;