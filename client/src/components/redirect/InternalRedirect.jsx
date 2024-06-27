import { useEffect } from "react";
import { useParams } from "react-router-dom";

const InternalRedirect = ({addon}) => {
  const { tenantId, empId } = useParams();

  const dashboardUrl = import.meta.env.VITE_DASHBOARD_PAGE_URL

  useEffect(() => {
    window.location.href = `${dashboardUrl}/${tenantId}/${empId}/${addon}`;
  }, [dashboardUrl, tenantId, empId,addon]);

  return null;
};

export default InternalRedirect;
