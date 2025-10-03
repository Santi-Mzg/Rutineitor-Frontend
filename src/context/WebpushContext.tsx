import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import {
  checkPermissionStateAndAct,
  notificationUnsupported,
  registerAndSubscribe,
  unsubscribe,
  sendWebPush
} from "../lib/actions/push"
import { useAuth } from "./AuthContext"


interface WebPushContextType {
  subscription: PushSubscription | null;
  unsupported: boolean
  register: () => void
  unregister: () => void
  sendNotification: (title: string | null, message: string | null) => void
}

interface WebPushProviderProps {
    children: ReactNode;
}

export const WebPushContext = createContext<WebPushContextType>({
    subscription: null,
    unsupported: false,
    register: () => {},
    unregister: () => {},
    sendNotification: (title: string | null, message: string | null) => {}
})

export const useWebPush = () => {
    const context = useContext(WebPushContext)
    if (!context) throw new Error("useWebPush must be used within a WebPushProvider")
    return context
}

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
  }, [user?.id])


  const register = () => {

    if (user?.id) {
      registerAndSubscribe(user.id, setSubscription)
    }
  }

  const unregister = () => {
    unsubscribe(setSubscription)
  }

  const sendNotification = (title: string | null, message: string | null) => {
    if (subscription) {
      sendWebPush(title, message)
    }
  }

  return (
    <WebPushContext.Provider value={{ subscription, unsupported, register, unregister, sendNotification }}>
      {children}
    </WebPushContext.Provider>
  )
}
