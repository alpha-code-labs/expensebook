// to generate and add expense report number
const generateIncrementalNumber = (tenantName, incrementalValue = 1) => {
    try {
      console.log("generateIncrementalNumber",tenantName, incrementalValue )
        // Validate tenantName
        if (typeof tenantName !== 'string' || tenantName.trim() === '') {
            throw new Error('Invalid tenantName parameter');
        }
  
        if (typeof incrementalValue !== 'number' || incrementalValue < 0 || !Number.isFinite(incrementalValue)) {
            throw new Error('Invalid incrementalValue parameter');
        }
  
        // Format tenantName
        const formattedTenant = formatTenantId(tenantName).substring(0, 2).toUpperCase();
        console.log("formattedTenant:", formattedTenant);
  
        // Ensure incrementalValue is a valid number
        const paddedIncrementalValue = incrementalValue.toString().padStart(6, '0');
        console.log("paddedIncrementalValue:", paddedIncrementalValue);
  
        return `ER${formattedTenant}${paddedIncrementalValue}`;
    } catch (error) {
        console.error('Error in generateIncrementalNumber:', error);
        throw new Error('An error occurred while generating the incremental number.');
    }
  };