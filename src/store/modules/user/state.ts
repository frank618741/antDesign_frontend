/*
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-28 11:26:33
 * @LastEditors: ZY
 * @LastEditTime: 2020-12-28 13:34:08
 */
export interface singleUserItem {
  userID: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phoneNumber: string;
}


export interface UserState{

  userInfo: Array<singleUserItem>;//表明是对象类型的数组
}

export const state = {
      
     userInfo: [
      {
        userID: '',
        name: '',
        role: '',
        department: '',
        email: '',
        phoneNumber: '',
      }
     ]
 
    
    
 }
  


