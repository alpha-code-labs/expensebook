import Trip from '../models/tripSchema.js'; 

const applyTenantFilter = async (req, res, next) => {
  const { tenantId } = req.params;

  try {
    // Query MongoDB to check if the tenantId exists in your Tenant collection
    const existingTenant = await Trip.findOne({ tenantId: tenantId });

    if (!existingTenant) {
      return res.status(403).json({ error: 'Invalid tenantId' });
    }

    // Valid tenantId, allow access to controller actions
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validating tenantId' });
  }
};

export { applyTenantFilter };
