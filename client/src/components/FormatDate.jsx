import React from 'react';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

const FormatDate = ({ dateString }) => {
  const formattedDate = formatDate(dateString);

  return (
    <div>
      <p>Original Date: {dateString}</p>
      <p>Formatted Date: {formattedDate}</p>
    </div>
  );
};

export default FormatDate;
