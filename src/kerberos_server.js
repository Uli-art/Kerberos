import DES from './des'
import { Component } from 'react';

class Kerberos_Server extends Component {
  constructor() {
    super();
    this.secretKeys = {
      'Ulya': 'USecretKey',
      'Kely': 'JSecretKey',
      "tgs_ss": 'tgs_ss',
    };
    this.sessionKeys = {};
    this.clientServiceSessionKey = '';

    this._tgtDuration = 24 * 60 * 60 * 1000;
    this._asTgsKey = 'tgs_ss';
  }

  _authenticateUser(body) {
    const { name } = JSON.parse(body);
    if (!name || !this.secretKeys[name]) return null;

    const tgt = {
      name,
      serverId: 'TGS',
      time: new Date().getTime(),
      duration: this._tgtDuration,
    };
    const encryptedTGT = new DES(this._asTgsKey).encryptObject(JSON.stringify(tgt));

    console.log(`Encrypted tgt with as_tgt_key: ${encryptedTGT}`);

    const sessionKey = this._generateSessionKey(name);
    this.sessionKeys[name] = sessionKey;

    const responseData = {
      tgt: encryptedTGT,
      sessionKey,
    };

    console.log(`---- AS ----
    Not encrypted response data: ${JSON.stringify(responseData)}`)
    return JSON.stringify(new DES(this.secretKeys[name]).encryptObject(JSON.stringify(responseData)));
  }

  _grantTicket(body) {
    const encryptedTGT = JSON.parse(body).tgt;

    const decryptedTGT = new DES( this._asTgsKey).decryptToObject(encryptedTGT);

    console.log(`
    ---- KERBEROS_SERVER -----
    Decrypted TGT:
    ${decryptedTGT}`)

    const tgtObject = JSON.parse(
      decryptedTGT.substring(0, decryptedTGT.lastIndexOf('}') + 1)
    );

    const isExpired = new Date(tgtObject.time + tgtObject.duration) < new Date();
    if (isExpired) {
      throw new Error('Ticket expired');
    }

    const clientServiceSessionKey = this._generateClientSessionKey(
      tgtObject.name,
      JSON.parse(body).service_id
    );
    this.clientServiceSessionKey = clientServiceSessionKey;

    const tgs = {
      name: tgtObject.name,
      serviceId: JSON.parse(body).service_id,
      time: new Date().getTime(),
      period: 60 * 60 * 1000,
      clientServiceSessionKey,
    };

    console.log(`
    TGS:
    ${JSON.stringify(tgs)}`)

    const encryptedTgs = new DES(this.secretKeys['tgs_ss']).encryptObject(JSON.stringify(tgs));
    const response = {
      encryptedTgs: encryptedTgs,
      clientServiceSessionKey,
    };

    console.log(`
    Encrypted TGS:
    ${JSON.stringify(encryptedTgs)}`)
    console.log(`Session Key: ${ this.sessionKeys[tgtObject.name]}`)

    return JSON.stringify(new DES( this.sessionKeys[tgtObject.name]).encryptObject(JSON.stringify(response)));
  }

  _generateClientSessionKey(name, serviceId) {
    return `Client${name}SessionKey${serviceId}`;
  }

  _generateSessionKey(name) {
    return `${name}SessionKey`;
  }
}

export default Kerberos_Server;
