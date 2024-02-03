import { v4 as uuidv4 } from 'uuid';


// const generateUniqueIdentifier = () => {
//   const prefix = 'travel';
//   const uuid = uuidv4();
//   return `${prefix}_${uuid}`;
// };


const generateUniqueIdentifier = () => {
    const prefix = 'travel';
    return Math.random()*10000;
  };



export { generateUniqueIdentifier };


