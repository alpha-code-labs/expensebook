import { v4 as uuidv4 } from 'uuid';

const generateUniqueIdentifier = () => {
  const prefix = 'trip_paid_and_cancelled';
  const uuid = uuidv4();

  return `${prefix}_${uuid}`;
};

export { generateUniqueIdentifier };
