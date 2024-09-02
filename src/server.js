import DES from './des'
import { Component } from 'react';

class ServiceServer extends Component{
  constructor() {
    super();
    this.secretKeys = {
      "tgs_ss": 'tgs_ss',
    };
    this.usersSessionKeys = {};
  }

  _checkService(bodyData) {
    const encryptedTgs = JSON.parse(bodyData).tgs;
    const tgsJson = new DES(this.secretKeys['tgs_ss']).decryptToObject(encryptedTgs);
    const tgs = JSON.parse(
      tgsJson.substring(0, tgsJson.lastIndexOf('}') + 1)
    );

    console.log(`
    ----- SERVER -----
    Tgs: 
    ${JSON.stringify(tgs)}`)

    if (tgs['time'] + tgs['period'] < Date.now()) {
      throw new Error('TICKET IS EXPIRED');
    }

    const clientServiceSessionKey = tgs['clientServiceSessionKey'];

    const authBlockJson = new DES(clientServiceSessionKey).decryptToObject(JSON.parse(bodyData).authBlock);
    const authBlock = JSON.parse(
      authBlockJson.substring(0, authBlockJson.lastIndexOf('}') + 1)
    );

    console.log(`Client Service Session Key: ${clientServiceSessionKey}`)
    console.log(`Auth Block: ${JSON.stringify(authBlock)}`)

    if (authBlock['name'] !== tgs['name']) {
      throw new Error("Clients in ticket and auth block are different");
    }

    this.usersSessionKeys[authBlock['name']] = clientServiceSessionKey;

    const response = { time: new Date(authBlock['time']).getTime() + 1 };

    console.log(`Response time: ${JSON.stringify(response)}`)

    let des= new DES(clientServiceSessionKey);
    return des.encryptObject(response);
  }

  _checkUser(name) {
    
    console.log(`
    ----- SERVER -----
    Check user`)

    if (this.usersSessionKeys.hasOwnProperty(name)) {
      return new DES(this.usersSessionKeys[name]).encryptObject('INFORMATION')
    }
    return JSON.stringify('Invalid request', this.usersSessionKeys[name])
  }
}

export default new ServiceServer();
