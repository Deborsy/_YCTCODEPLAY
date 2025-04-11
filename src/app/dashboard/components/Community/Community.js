import React from 'react'
import { FaWhatsapp } from "react-icons/fa";
import styles from './Community.module.css'

const Community = () => {
  return (
    <div className={styles.container}>
        <h1 className='text-2xl font-bold'>Join the live chat in the community</h1>
        <br />
        <a className={styles.link} href='https://chat.whatsapp.com/HzjmPGNkLJYEyhJmeFj2Qy'>Click here <span><FaWhatsapp size={20} /></span></a>
    </div>
  )
}

export default Community