import travelPolicy from '../test_data/travelPolicy.json'

export default function policyValidation(group, policy, value){
    const allowed = travelPolicy.policy.find(value)
    const status = allowed ? 'allowed' : 'not allowed'
    const message = allowed ? '' : travelPolicy.policy.violationMessage

    return {status, message}
}