'use client'
import Image from 'next/image'
import styles from './page.module.css'
import Header from './components/Header'
import {v4 as uuidv4} from 'uuid'
import { useEffect, useState } from 'react'
import { db, storage } from './firebase.config'
import { collection, setDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function Home() {

  return (
    <main>
      <div className="">

      </div>
    </main>
    )
}
