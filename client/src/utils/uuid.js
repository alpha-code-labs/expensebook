import { v4 as uuidv4 } from 'uuid';


const generateUniqueIdentifier = () => {
  const prefix = 'travel';
  const uuid = uuidv4();
  return `${uuid}`;
};


export { generateUniqueIdentifier };


