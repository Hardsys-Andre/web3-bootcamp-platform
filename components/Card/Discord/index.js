import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '../../Button'
import { auth } from '../../../firebase/initFirebase'
import { getUserFromFirestore, updateUserDiscordIdinFirestore } from '../../../lib/user'
import { onAuthStateChanged } from 'firebase/auth'
import { useTranslation } from "react-i18next"

export default function DiscordCard() {
  const { data: session } = useSession()
  const [discordConnected, setDiscordConnected] = useState(false)
  const [user, setUser] = useState()
  const ref = React.createRef()
  const { t } = useTranslation()
  
  useEffect(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userSession = await getUserFromFirestore(user)
        setUser(userSession)
        if (session && session.discord && auth.currentUser?.uid) {
          await updateUserDiscordIdinFirestore(session.discord, auth.currentUser.uid)
          setDiscordConnected(true)
        } else if (userSession?.discord) setDiscordConnected(true)
      }
    })
  }, [session])

  //const disconnectDiscord = async () => {
  //  if (auth.currentUser) {
  //    const userSession = await getUserFromFirestore(auth.currentUser)
  //    if (userSession?.discord) {
  //      signOut({redirect: false})
  //      updateUserDiscordIdinFirestore(null, auth.currentUser.uid)
  //      setDiscordConnected(false)
  //    }
  //  }
  //}

  return (
    <>
      {!discordConnected && (
        <div className="flex flex-col rounded-lg  shadow-xl x-6 py-5 text-center gap-y-6 h-52 justify-center p-4">
              <p className="text-base  p-0 m-0">
                {t('connectYourDiscord')}
              </p>
              <p className="text-xs lg:text-base p-0 m-0">
                {t('accessSuperSecretChannels')}
              </p>

                <Button 
                ref={ref} 
                id="connect-discord" 
                onClick={() => signIn('discord')}
                >
                  {t('connectDiscordButton')}
                </Button>
        </div>
      )}
      {discordConnected && (
        <>
          <div className="flex flex-col rounded-lg  px-6 py-5 text-center gap-y-6 h-52 justify-center">
                <p className="text-base  p-0 m-0">
                  ✅ {user?.discord?.username || session?.discord.username} Conectado
                </p>
                <p className="text-xs lg:text-base text-gray-500 dark:text-gray-400 p-0 m-0">
                  {t('eagerToMeet')}
                </p>
                
                  <Button 
                  onClick={() => signIn('discord')}
                  >
                    {t('reconnectDiscordButton')}
                  </Button>
                {/*<div className="pt-4">
                <a className='cursor-pointer' onClick={() => disconnectDiscord()}>Desconectar</a>
                </div>*/}
              </div>
          
        </>
      )}
    </>
  )
}
