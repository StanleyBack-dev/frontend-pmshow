import { graphql } from "@/server/graphql/generated";

export const myNotificationsDocument = graphql(`
  query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {
    myNotifications(unreadOnly: $unreadOnly, page: $page) {
      items {
        id
        type
        title
        body
        link
        readAt
        createdAt
      }
      total
      page
      totalPages
    }
  }
`);

export const unreadNotificationsCountDocument = graphql(`
  query UnreadNotificationsCount {
    unreadNotificationsCount
  }
`);

export const markNotificationReadDocument = graphql(`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id)
  }
`);

export const markAllNotificationsReadDocument = graphql(`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`);

export const notificationPreferencesDocument = graphql(`
  query NotificationPreferences {
    myNotificationPreferences {
      type
      emailEnabled
    }
  }
`);

export const setNotificationPreferenceDocument = graphql(`
  mutation SetNotificationPreference(
    $type: NotificationType!
    $emailEnabled: Boolean!
  ) {
    setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {
      type
      emailEnabled
    }
  }
`);

export const pushPublicKeyDocument = graphql(`
  query PushPublicKey {
    pushPublicKey
  }
`);

export const subscribePushDocument = graphql(`
  mutation SubscribePush($input: PushSubscriptionInput!) {
    subscribePush(input: $input)
  }
`);

export const unsubscribePushDocument = graphql(`
  mutation UnsubscribePush($endpoint: String!) {
    unsubscribePush(endpoint: $endpoint)
  }
`);

export const sendTestPushDocument = graphql(`
  mutation SendTestPush {
    sendTestPush
  }
`);
