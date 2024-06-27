import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";

//sendToOtherMicroservice(payload, comments, destination, source='onboarding', onlineVsBatch, action='full-update')


const msList = ['login', 'onboarding', 'travel', 'cash', 'dashboard', 'trip', 'expense', 'approval', 'finance', 'reporting']

export default async function sendUpdatedReplica(payload, microservices = msList){
    try{
        const comments = 'full-update for HR data due to changes in system configuration microservice';
        const source = 'system-config';
        const onlineVsBatch = 'online';

        const promises = microservices.map(ms=>sendToOtherMicroservice(payload, comments, ms, source, onlineVsBatch))

        await Promise.all(promises);

        return {success: true, error:null};
    }catch(e){
        return {success: false, error:e};
    }
}