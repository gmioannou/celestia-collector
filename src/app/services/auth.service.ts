import { Injectable } from '@angular/core';
import axios from 'axios';

const BASE_URL = "http://celestia.cut.ac.cy:5000/api"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login_user: any = null;

  async login(userData) {
    try {
      const res = await axios.post(BASE_URL + '/users/login', userData)
      if (res.status == 200) {
        localStorage.setItem('bearer_token', res.data);
      } else {
        localStorage.removeItem('bearer_token');
      }
    } catch(err) {
      console.log(err)
    } finally {
      await this.init_login();
    }
  }

  async register(userData) {
    try {
      const res = await axios.post(BASE_URL + '/users/register', userData)
      if (res.status == 200) {
        console.log("-->>", res)
      }
    } catch (err) {
      console.log(err)
    }

  }

  delay(num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("success")
      }, num)
    })
  }
  
  async init_login(){
    console.log('init login')
    const stored_token = localStorage.getItem('bearer_token');
    if (stored_token) {
      const headers = {Authorization: stored_token}
      const res = await axios.post(BASE_URL + '/users/', {}, {headers: headers});
      this.login_user = res.data;
      console.log(this.login_user);
    } else {
      console.log('not login')
      this.login_user = null;
    }
  }

  logout() {
    localStorage.removeItem('bearer_token');
    this.init_login();
  }
}
