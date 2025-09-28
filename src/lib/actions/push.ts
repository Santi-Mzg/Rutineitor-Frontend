import { sendWebPushRequest, subscribeRequest, unsubscribeRequest } from "../../api/web-push";

export function notificationUnsupported(): boolean {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  }
  return unsupported;
}

export function checkPermissionStateAndAct(
  userId: string | undefined,
  onSubscribe: (subs: PushSubscription | null) => void,
): void {
  const state: NotificationPermission = Notification.permission;
  switch (state) {
    case 'denied':
      break;
    case 'granted':
      registerAndSubscribe(userId, onSubscribe);
      break;
    case 'default':
      break;
  }
}

export async function registerAndSubscribe(
  userId: string | undefined,
  onSubscribe: (subs: PushSubscription | null) => void,
): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
        
    if (!existingSubscription) 
      await subscribe(userId, onSubscribe);
    else 
      onSubscribe(existingSubscription);

  } catch (e) {
    console.error('Failed to register service-worker: ', e);
  }
}

async function subscribe(
  userId: string | undefined,
  onSubscribe: (subs: PushSubscription | null) => void
): Promise<void> {
  
  try {
    const registration = await navigator.serviceWorker.ready;

  const convertedKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '');

    // Crear nueva suscripción con la VAPID actual
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey,
    });

    console.info('Created subscription Object: ', newSubscription.toJSON());

    await subscribeRequest(userId, newSubscription);
    onSubscribe(newSubscription);
  } catch (e) {
    console.error('Failed to subscribe cause of: ', e);
  }
}

export async function unsubscribe(
  onSubscribe: (subs: PushSubscription | null) => void
): Promise<void> {
    try{
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        
        if (existingSubscription) {
            console.log('Unsubscribing existing push subscription...');
            await existingSubscription.unsubscribe();
            
            await unsubscribeRequest(existingSubscription.endpoint);

            onSubscribe(null);
            console.log('Unsubscribed successfully.');
        }
    }
    catch (e) {
        console.error('Failed to unsubscribe cause of: ', e);
    }
}

export async function sendWebPush(title: string | null, message: string | null,): Promise<void> {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
        

  const pushBody = {
    title: title ?? 'Test Push Notification',
    body: message ?? 'This is a test push message',
    image: '/next.png',
    icon: 'nextjs.png',
    url: 'https://google.com',
  };
  
  if(subscription) {
    const res = await sendWebPushRequest(subscription.endpoint, pushBody);

    // const result = await res.json();
    console.log(res);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}