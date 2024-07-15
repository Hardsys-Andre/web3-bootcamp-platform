import { Link, Input, red } from '@nextui-org/react'
import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import ThemeSwitch from '../ThemeSwitch'
import { Button as NUButton } from '@nextui-org/react'
import constants from '../../lib/constants'
import { Navbar, Text, Dropdown, Button, useModal, Modal, Grid, Avatar, Image } from '@nextui-org/react'
import { GiExitDoor } from 'react-icons/gi'
import { useTranslation } from "react-i18next"

import { 
  FaEthereum,
  FaGlobeAmericas,
 } from 'react-icons/fa'
import { MdGroup } from "react-icons/md"

import { useSession, signOut } from 'next-auth/react'
import { getUserFromFirestore, updateUserInFirestore } from '../../lib/user'
import { checkReferral, saveReferralCookie } from '../../lib/store_referral'

import { useTheme } from 'next-themes'

export default function NavbarComponent() {
  const { setVisible, bindings } = useModal()
  const [firestoreUser, setFirestoreUser] = useState()
  const [link, setLink] = useState('')
  const ref = React.createRef()
  const navbarLinks = [
    {
      name: 'Builds',
      href: '/courses',
    },
    {
      name: 'Study Groups',
      href: '/study-groups',
    },
    {
      name: 'Tasks',
      href: '/tasks',
    },
  ]

  const [profile, setProfile] = useState(false)
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()

  const { theme } = useTheme()
  const isLight = theme === 'light'

  const languageMap = {
    en: 'English',
    pt: 'Português (BR)',
  }

  const getUser = async () => {
    
    if (user?.uid)
      return await getUserFromFirestore(user).then((u) => {
        if (!u) return
        checkReferral(u, updateUserInFirestore)
        setFirestoreUser(u)
      })
  }

  useEffect(() => {
    saveReferralCookie().then(getUser)
    if (typeof window !== 'undefined') {
      setLink(window.location.origin + '?referred_by=' + user?.uid)
    }
  }, [user])

  return (
    <>
      <Navbar variant={'floating'} isBordered={false}>
        <Navbar.Brand css={{ gap: '$14' }}>
          <Link href="/">
          <Image width={42} height={42} src="/assets/img/w3d-logo-symbol-ac.svg" />
          <Text weight={'bold'} css={{ fontSize: '40px' }}>WEB<span style={{ color: '#99E24D' }}>3</span>DEV</Text>
          </Link>
          <ThemeSwitch />
          <Dropdown>
          <Dropdown.Trigger css={{ background: 'none' }}>
          <NUButton
              auto="true" 
              css={{ background: 'none' }}
            >
              <FaGlobeAmericas size={35} color= {isLight ? 'gray' : 'white'}/>
            </NUButton>
      </Dropdown.Trigger>
          <Dropdown.Menu
            css={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {i18n.options.whitelist
          .filter((l) => l !== i18n.resolvedLanguage)
          .map((l) => (
            <Dropdown.Item key={l}>
              <Link href={`?lang=${l}`}>
                <Text weight="bold">{languageMap[l]}</Text>
              </Link>
            </Dropdown.Item>
          ))}
          </Dropdown.Menu>
        </Dropdown>
        </Navbar.Brand>
        

        <Navbar.Content hideIn={'sm'} css={{ gap: '$5', width: '100%', justifyContent: 'right'}}>
          <Link href="/courses">
            <NUButton
              auto="true"
              css={{ background: 'none'}}
            >
              <Text weight={'normal'} css={{ color: isLight ? 'black' : 'white', fontSize: 20  }}>Builds</Text>
            </NUButton>
          </Link>
          <Link href="/study-groups">
            <Button
              auto="true" 
              css={{ background: 'none' }}
            >
              <Text weight={'normal'} css={{ color: isLight ? 'black' : 'white', fontSize: 20  }}>Study Groups</Text>
            </Button>
          </Link>
          <Link href="/tasks">
            <Button
              auto="true" 
              css={{ background: 'none' }}
            >
              <Text weight={'normal'} css={{ color: isLight ? 'black' : 'white', fontSize: 20  }}>Tasks</Text>
            </Button>
          </Link>
        </Navbar.Content>
        

        <Navbar.Content css={{ gap: '$5'}}>
          {user?.uid && (
            <Navbar.Content hideIn={'md'}>
              <NUButton
                auto="true"
                css={{ background: '#17c964' }}
                color={''}
                onPress={() => setVisible(true)}
              >
                <Text weight={'bold'}>{t('indicateAndWin')}</Text>
              </NUButton>
              <Modal
                scroll
                width="600px"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                {...bindings}
              >
                <Modal.Header>
                  <Text id="modal-title" size={18}>
                    {t('shareLinkDescription')}
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Text id="modal-description">
                    <Input width="100%" value={link}></Input>
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <NUButton auto="true" flat onPress={() => setVisible(false)}>
                    {t('close')}
                  </NUButton>
                </Modal.Footer>
              </Modal>
            </Navbar.Content>
          )}
          {user ? (
            <Navbar.Content hideIn={'md'}>
              <Dropdown onChange={() => setProfile(!profile)}>
                <Dropdown.Button
                  borderWeight={'light'}
                  flat
                  color={''}
                  css={{ paddingBlock: '$10' }}
                  bordered
                >
                  <Avatar
                    size="md"
                    src={firestoreUser?.photoUrl || '/assets/img/default_avatar.svg'}
                    bordered
                  />
                  {/* <Navbar.CollapseItem 
                        css={{ display:'flex', alignItems:'center', justifyContent:'center' }}
                        >
                          <Button color={''} onPress={() => setVisible(true)} >
                            <Text weight={'bold'} >Indique e Ganhe</Text>
                          </Button>
                        </Navbar.CollapseItem> */}
                </Dropdown.Button>
                <Dropdown.Menu
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '$5',
                  }}
                >
                  <Dropdown.Item>
                    <Link href="/profile">
                      <Text weight={'bold'}>{t('myProfile')}</Text>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Button
                      animated={false}
                      color={'error'}
                      onClick={() => {
                        signOut({ redirect: false })
                        logout()
                      }}
                    >
                      {t('logout')}
                    </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Content>
          ) : (
            <Navbar.Content hideIn={'sm'}>
              <Link href="/auth">
                <Button id="login" ref={ref}
                css={{ background: 'none' }}
                >
                  <Text weight={'normal'} css={{ fontSize: 20 }}>{t('accessPlatform')}</Text>
                </Button>
              </Link>
            </Navbar.Content>
          )}
          <Navbar.Toggle showIn="md" />
        </Navbar.Content>
        <Navbar.Collapse>
          {!user && (
            <Navbar.CollapseItem
              key="login"
              css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Link href="/auth">
                <Button color={'secondary'} bordered>
                  <Text weight={'bold'}>{t('accessPlatform')}</Text>
                </Button>
              </Link>
            </Navbar.CollapseItem>
          )}
          {navbarLinks.map((item, index) => (
            <Navbar.CollapseItem
              key={item.name}
              css={{ display: 'flex', alignItems: 'center', justifyContent: 'center', h: 'auto' }}
            >
              <Link href={item.href}>
                <Text weight={'bold'}>{item.name}</Text>
              </Link>
            </Navbar.CollapseItem>
          ))}

          {user && (
            <div>
              <Navbar.CollapseItem key="profile-item">
                <div className="mr-auto ml-auto flex flex-col items-center justify-center gap-x-4 px-6">
                  <Link href="/profile" className="mb-3 flex gap-7">
                    <Text weight={'extrabold'}>{t('myProfile')}</Text>
                    <Avatar
                      bordered
                      className="h-10 w-10 rounded-full object-cover"
                      src={firestoreUser?.photoUrl || '/assets/img/default_avatar.svg'}
                      alt={t('profilePicture')}
                    />
                    <Button icon={<GiExitDoor />} auto="true" color={'error'} onClick={logout} />
                  </Link>
                </div>
              </Navbar.CollapseItem>

              <Navbar.CollapseItem
                key="indicate-item"
                css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Button css={{ background: '#17c964' }} color={''} onPress={() => setVisible(true)}>
                  <Text weight={'bold'}>{t('indicateAndWin')}</Text>
                </Button>
              </Navbar.CollapseItem>
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
