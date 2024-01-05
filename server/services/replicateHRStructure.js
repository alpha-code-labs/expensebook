import axios from 'axios'

async function replicateHrStructure(hrCompany, receivingMSEndpoint){
    try{
        const response = await axios.post(receivingMSEndpoint, {hrCompany})
        return response
    }catch(e){
        console.log(e)
    }
}

export default replicateHrStructure