export default (provider) => {
    // provider here is an abstraction of redis or in memory node
    // implement your logic
    
    const save = (key, item) => {
      provider.save(key, item);
      // return promise callback etc
    }    
 
    const getItem = (key) => {
       provider.get(key);
    } 
 
    return {
      save,
      getItem,
    }
 }