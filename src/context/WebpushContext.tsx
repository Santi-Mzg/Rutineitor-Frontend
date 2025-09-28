import React, { createContext, ReactNode, useEffect, useState } from "react"
import {
  checkPermissionStateAndAct,
  notificationUnsupported,
  registerAndSubscribe,
  unsubscribe
} from "../lib/actions/push"
import { useAuth } from "./AuthContext"


interface WebPushContextType {
  subscription: PushSubscription | null;
  unsupported: boolean
  register: () => void
  unregister: () => void
}

interface WebPushProviderProps {
    children: ReactNode;
}

export const WebPushContext = createContext<WebPushContextType>({
    subscription: null,
    unsupported: false,
    register: () => {},
    unregister: () => {}
})

export const WebPushProvider = ({ children }: WebPushProviderProps) => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [unsupported, setUnsupported] = useState(false)

  // Chequear soporte y suscripción
  useEffect(() => {
    const isUnsupported = notificationUnsupported()
    setUnsupported(isUnsupported)
    if (!isUnsupported && user?.id) {
      checkPermissionStateAndAct(user?.id, setSubscription)
    }
  }, [user])

  const register = () => {
    if (user?.id) {
      registerAndSubscribe(user.id, setSubscription)
    }
  }

  const unregister = () => {
    unsubscribe(setSubscription)
  }

  return (
    <WebPushContext.Provider value={{ subscription, unsupported, register, unregister }}>
      {children}
    </WebPushContext.Provider>
  )
}
