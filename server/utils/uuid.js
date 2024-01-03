import { v4 as uuidv4 } from 'uuid';

const generateUniqueIdentifier = () => {
  const prefix = 'trip';
  const uuid = uuidv4();

  return `${prefix}_${uuid}`;
};

export { generateUniqueIdentifier };
