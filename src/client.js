import DES from './des'
import ServiceServer from './server'
import Kerberos_Server from './kerberos_server'
import { Component } from 'react';

const KerberosServer = new Kerberos_Server()

class ClientController extends Component  {
  state = {
    name: '',
    secretKey: '',
    sessionKey: ''
  };
  constructor(props_name,props_key ) {
    super();
    this.state = { name: props_name,
    secretKey: props_key };
  }

  auth() {
    console.log(`Entered data: ${this.state.name}, ${this.state.secretKey}`);
    const authenticationResponse = this.authenticate()
    const tgsResponse = this.getTicket(authenticationResponse, 1234)
    console.log(`Tgs Response: ${JSON.stringify(tgsResponse)}`);
    this.checkService(tgsResponse)
    return this.getServiceInfo(this.state.sessionKey)
  }

  authenticate() {
    console.log(`Send name: ${this.state.name} to AS`);
    const response = KerberosServer._authenticateUser(JSON.stringify({ name: this.state.name }))

    console.log(`
---- CLIENT ----
Encrypted response data:
    ${response}\n`);

    const result = JSON.parse(response);
    let des = new DES(this.state.secretKey)
    let decryptedResult = des.decryptToObject(result);
    decryptedResult = decryptedResult.substring(0, decryptedResult.lastIndexOf('}') + 1);

    console.log(`
Decrypted response data:
    ${decryptedResult}\n`);

    return  JSON.parse(decryptedResult);
  }

  getTicket(authenticationResponse, serviceId) {
    const authBlock = {
      name: this.state.name,
      time: new Date().getTime(),
    };

    console.log(`
Auth Block:
    ${JSON.stringify(authBlock)}\n`);

    const encryptedAuthBlock = new DES(authenticationResponse.sessionKey).encryptObject(JSON.stringify(authBlock));
    
    console.log(`
Encrypted auth Block:
    ${encryptedAuthBlock}\n`);

    const response = KerberosServer._grantTicket(JSON.stringify({
          tgt: authenticationResponse.tgt,
          auth_block: encryptedAuthBlock,
          service_id: serviceId,
        }))

    const result = JSON.parse(response);
    let data = new DES(authenticationResponse.sessionKey).decryptToObject((result));
    data = data.substring(0, data.lastIndexOf('}') + 1);

    console.log(`
---- CLIENT ----
Granting ticket
Decrypted response data:
    ${data}\n`);

    return {
      tgs: JSON.parse(data).encryptedTgs,
      clientServiceSessionKey: JSON.parse(data).clientServiceSessionKey,
    };
  }

  checkService(tgsResponse) {
    const initialTime = new Date();
    const authBlock = {
      name: this.state.name,
      time: initialTime.getTime(),
    };
    
    const encryptedBlock = new DES(tgsResponse.clientServiceSessionKey).encryptObject(JSON.stringify(authBlock));
    const serviceRequest = {
      tgs: tgsResponse.tgs,
      authBlock: encryptedBlock,
    };

    const serviceResponse = ServiceServer._checkService(JSON.stringify(serviceRequest))

    console.log(`
----- CLIENT -----
Service Response:
    ${serviceResponse}`)

    if (serviceResponse) {
      let decryptedResponse = new DES(tgsResponse.clientServiceSessionKey).decryptToObject(serviceResponse);
      this.state.sessionKey = tgsResponse.clientServiceSessionKey

      console.log(`
Checking service
Decrypted response:
    ${JSON.stringify(decryptedResponse)}\n`);

      const isValid = initialTime.getTime() + 1 === decryptedResponse.time;
      if (!isValid) {
        console.log('INVALID SERVICE RESPONSE');
        return false;
      }
      console.log('VALID SERVICE RESPONSE');
      return true;
    }
    return false;
  }

  getServiceInfo(key) {
    const response = ServiceServer._checkUser(this.state.name)

    console.log(`
----- CLIENT -----
Response:
    ${response}\n`);

    const result = new DES(key).decryptToObject(response);

    console.log(`
Service information
Decrypted response:
    ${result}\n`);

    return result
  }
}
export default ClientController;
