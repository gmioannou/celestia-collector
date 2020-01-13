import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

const authUrl = environment.authUrl

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { 
    console.log(environment.message)
  }

  login_user: any = null;

  async login(userData) {
    try {
      const res = await axios.post(authUrl + '/users/login', userData)
      const token = res.data
      
      if (res.status == 200) {
        localStorage.setItem('bearer_token', 'Bearer ' + token);
      } else {
        localStorage.removeItem('bearer_token');
      }
    } catch(err) {
      console.log(err.message)
    } finally {
      await this.init_login();
    }
  }

  async register(userData) {
    try {
      const res = await axios.post(authUrl + '/users/register', userData)
      console.log("Register response: ", res)
    } catch (err) {
      console.log(err.message)
    }

  }

  delay(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Success")
      }, num)
    })
  }
  
  async init_login(){
    const stored_token = localStorage.getItem('bearer_token');
    if (stored_token) {
      const headers = {Authorization: stored_token}
      const res = await axios.post(authUrl + '/users/', {}, {headers: headers});
      this.login_user = res.data;
      console.log('Signin', this.login_user.email);
    } else {
      console.log('Signout')
      this.login_user = null;
    }
  }

  logout() {
    localStorage.removeItem('bearer_token');
    this.init_login();
  }
}
