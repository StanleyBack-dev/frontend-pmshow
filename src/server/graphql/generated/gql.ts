/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment AbsenceFields on Absence {\n    id\n    userId\n    userName\n    warName\n    type\n    startsOn\n    endsOn\n    reason\n    status\n    reviewNote\n    reviewedAt\n    createdAt\n  }\n": typeof types.AbsenceFieldsFragmentDoc,
    "\n  query MyAbsences {\n    myAbsences {\n      ...AbsenceFields\n    }\n  }\n": typeof types.MyAbsencesDocument,
    "\n  query Absences($filter: AbsenceFilterInput) {\n    absences(filter: $filter) {\n      ...AbsenceFields\n    }\n  }\n": typeof types.AbsencesDocument,
    "\n  mutation RequestAbsence($input: AbsenceInput!) {\n    requestAbsence(input: $input) {\n      ...AbsenceFields\n    }\n  }\n": typeof types.RequestAbsenceDocument,
    "\n  mutation RegisterAbsence($userId: ID!, $input: AbsenceInput!) {\n    registerAbsence(userId: $userId, input: $input) {\n      ...AbsenceFields\n    }\n  }\n": typeof types.RegisterAbsenceDocument,
    "\n  mutation ReviewAbsence($id: ID!, $approve: Boolean!, $note: String) {\n    reviewAbsence(id: $id, approve: $approve, note: $note) {\n      ...AbsenceFields\n    }\n  }\n": typeof types.ReviewAbsenceDocument,
    "\n  mutation CancelAbsence($id: ID!) {\n    cancelAbsence(id: $id) {\n      ...AbsenceFields\n    }\n  }\n": typeof types.CancelAbsenceDocument,
    "\n  query Users($filter: UserFilterInput, $page: PageInput) {\n    users(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...UserAccountFields\n      }\n    }\n  }\n": typeof types.UsersDocument,
    "\n  fragment UserAccountFields on UserAccount {\n    id\n    name\n    email\n    username\n    group\n    active\n    mustChangePassword\n    lockedUntil\n    locked\n    lastLoginAt\n    deactivatedAt\n    createdAt\n  }\n": typeof types.UserAccountFieldsFragmentDoc,
    "\n  query User($id: ID!) {\n    user(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.UserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.UpdateUserDocument,
    "\n  mutation SetUserActive($id: ID!, $active: Boolean!) {\n    setUserActive(id: $id, active: $active) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.SetUserActiveDocument,
    "\n  mutation ResetUserPassword($id: ID!) {\n    resetUserPassword(id: $id) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": typeof types.ResetUserPasswordDocument,
    "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.UnlockUserDocument,
    "\n  mutation RevokeUserSessions($id: ID!) {\n    revokeUserSessions(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": typeof types.RevokeUserSessionsDocument,
    "\n  query UserPermissions($id: ID!) {\n    userPermissions(id: $id) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": typeof types.UserPermissionsDocument,
    "\n  mutation SetUserPermissions($input: SetUserPermissionsInput!) {\n    setUserPermissions(input: $input) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": typeof types.SetUserPermissionsDocument,
    "\n  query AuditLogs($filter: AuditFilterInput, $page: PageInput) {\n    auditLogs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        actorId\n        actorName\n        action\n        entity\n        entityId\n        before\n        after\n        ip\n        createdAt\n      }\n    }\n  }\n": typeof types.AuditLogsDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n": typeof types.RefreshSessionDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n": typeof types.ChangeMyPasswordDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": typeof types.UpdateMyProfileDocument,
    "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n": typeof types.RequestPasswordRecoveryDocument,
    "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n": typeof types.VerifyPasswordRecoveryCodeDocument,
    "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n": typeof types.ResetPasswordWithRecoveryDocument,
    "\n  fragment EventFields on Event {\n    id\n    title\n    type\n    status\n    callTime\n    startsAt\n    endsAt\n    venueId\n    uniform\n    requester\n    documentRef\n    notes\n    cancellationReason\n    venue {\n      ...VenueFields\n    }\n  }\n": typeof types.EventFieldsFragmentDoc,
    "\n  fragment VenueFields on Venue {\n    id\n    name\n    address\n    city\n    mapsUrl\n    notes\n    archived\n  }\n": typeof types.VenueFieldsFragmentDoc,
    "\n  query Events($filter: EventFilterInput) {\n    events(filter: $filter) {\n      ...EventFields\n    }\n  }\n": typeof types.EventsDocument,
    "\n  query UpcomingEvents($limit: Int!) {\n    upcomingEvents(limit: $limit) {\n      ...EventFields\n    }\n  }\n": typeof types.UpcomingEventsDocument,
    "\n  query Event($id: ID!) {\n    event(id: $id) {\n      ...EventFields\n      setlist {\n        position\n        songId\n        notes\n        song {\n          id\n          title\n          musicalKey\n          durationSeconds\n          archivedAt\n          media {\n            id\n            kind\n            title\n          }\n        }\n      }\n    }\n  }\n": typeof types.EventDocument,
    "\n  mutation CreateEvent($input: EventInput!) {\n    createEvent(input: $input) {\n      ...EventFields\n    }\n  }\n": typeof types.CreateEventDocument,
    "\n  mutation UpdateEvent($id: ID!, $input: EventInput!) {\n    updateEvent(id: $id, input: $input) {\n      ...EventFields\n    }\n  }\n": typeof types.UpdateEventDocument,
    "\n  mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {\n    changeEventStatus(id: $id, status: $status, reason: $reason) {\n      ...EventFields\n    }\n  }\n": typeof types.ChangeEventStatusDocument,
    "\n  mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {\n    setEventSetlist(id: $id, input: $input) {\n      position\n      songId\n    }\n  }\n": typeof types.SetEventSetlistDocument,
    "\n  query Venues($includeArchived: Boolean!) {\n    venues(includeArchived: $includeArchived) {\n      ...VenueFields\n    }\n  }\n": typeof types.VenuesDocument,
    "\n  mutation CreateVenue($input: VenueInput!) {\n    createVenue(input: $input) {\n      ...VenueFields\n    }\n  }\n": typeof types.CreateVenueDocument,
    "\n  mutation UpdateVenue($id: ID!, $input: VenueInput!) {\n    updateVenue(id: $id, input: $input) {\n      ...VenueFields\n    }\n  }\n": typeof types.UpdateVenueDocument,
    "\n  fragment MemberProfileFields on MemberProfile {\n    userId\n    warName\n    rank\n    registration\n    phone\n    section\n    status\n    notes\n    updatedAt\n    instruments {\n      instrumentId\n      name\n      primary\n    }\n  }\n": typeof types.MemberProfileFieldsFragmentDoc,
    "\n  query Roster($filter: RosterFilterInput, $page: PageInput) {\n    roster(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        userId\n        name\n        username\n        active\n        profile {\n          ...MemberProfileFields\n        }\n      }\n    }\n  }\n": typeof types.RosterDocument,
    "\n  query MemberProfile($userId: ID!) {\n    memberProfile(userId: $userId) {\n      ...MemberProfileFields\n    }\n  }\n": typeof types.MemberProfileDocument,
    "\n  query MyMemberProfile {\n    myMemberProfile {\n      ...MemberProfileFields\n    }\n  }\n": typeof types.MyMemberProfileDocument,
    "\n  mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {\n    saveMemberProfile(userId: $userId, input: $input) {\n      ...MemberProfileFields\n    }\n  }\n": typeof types.SaveMemberProfileDocument,
    "\n  query Instruments($includeArchived: Boolean!) {\n    instruments(includeArchived: $includeArchived) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": typeof types.InstrumentsDocument,
    "\n  mutation CreateInstrument($input: CreateInstrumentInput!) {\n    createInstrument(input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": typeof types.CreateInstrumentDocument,
    "\n  mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {\n    updateInstrument(id: $id, input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": typeof types.UpdateInstrumentDocument,
    "\n  query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {\n    myNotifications(unreadOnly: $unreadOnly, page: $page) {\n      items {\n        id\n        type\n        title\n        body\n        link\n        readAt\n        createdAt\n      }\n      total\n      page\n      totalPages\n    }\n  }\n": typeof types.MyNotificationsDocument,
    "\n  query UnreadNotificationsCount {\n    unreadNotificationsCount\n  }\n": typeof types.UnreadNotificationsCountDocument,
    "\n  mutation MarkNotificationRead($id: ID!) {\n    markNotificationRead(id: $id)\n  }\n": typeof types.MarkNotificationReadDocument,
    "\n  mutation MarkAllNotificationsRead {\n    markAllNotificationsRead\n  }\n": typeof types.MarkAllNotificationsReadDocument,
    "\n  query NotificationPreferences {\n    myNotificationPreferences {\n      type\n      emailEnabled\n    }\n  }\n": typeof types.NotificationPreferencesDocument,
    "\n  mutation SetNotificationPreference(\n    $type: NotificationType!\n    $emailEnabled: Boolean!\n  ) {\n    setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {\n      type\n      emailEnabled\n    }\n  }\n": typeof types.SetNotificationPreferenceDocument,
    "\n  fragment SongFields on Song {\n    id\n    title\n    artist\n    arranger\n    category\n    musicalKey\n    bpm\n    durationSeconds\n    lyrics\n    notes\n    tags\n    archivedAt\n    createdAt\n    updatedAt\n  }\n": typeof types.SongFieldsFragmentDoc,
    "\n  fragment MediaAssetFields on MediaAsset {\n    id\n    songId\n    kind\n    status\n    title\n    mimeType\n    sizeBytes\n    durationSeconds\n    youtubeVideoId\n    thumbnailUrl\n    createdAt\n  }\n": typeof types.MediaAssetFieldsFragmentDoc,
    "\n  query Songs($filter: SongFilterInput, $page: PageInput) {\n    songs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...SongFields\n      }\n    }\n    songTags\n  }\n": typeof types.SongsDocument,
    "\n  query Song($id: ID!) {\n    song(id: $id) {\n      ...SongFields\n      media {\n        ...MediaAssetFields\n      }\n    }\n  }\n": typeof types.SongDocument,
    "\n  mutation CreateSong($input: SongInput!) {\n    createSong(input: $input) {\n      ...SongFields\n    }\n  }\n": typeof types.CreateSongDocument,
    "\n  mutation UpdateSong($id: ID!, $input: SongInput!) {\n    updateSong(id: $id, input: $input) {\n      ...SongFields\n    }\n  }\n": typeof types.UpdateSongDocument,
    "\n  mutation SetSongArchived($id: ID!, $archived: Boolean!) {\n    setSongArchived(id: $id, archived: $archived) {\n      ...SongFields\n    }\n  }\n": typeof types.SetSongArchivedDocument,
    "\n  mutation AddYoutubeVideo($input: AddYoutubeVideoInput!) {\n    addYoutubeVideo(input: $input) {\n      ...MediaAssetFields\n    }\n  }\n": typeof types.AddYoutubeVideoDocument,
    "\n  mutation RequestAudioUpload($input: RequestAudioUploadInput!) {\n    requestAudioUpload(input: $input) {\n      asset {\n        ...MediaAssetFields\n      }\n      upload {\n        url\n        fields\n        expiresAt\n      }\n    }\n  }\n": typeof types.RequestAudioUploadDocument,
    "\n  mutation ConfirmAudioUpload($input: ConfirmAudioUploadInput!) {\n    confirmAudioUpload(input: $input) {\n      ...MediaAssetFields\n    }\n  }\n": typeof types.ConfirmAudioUploadDocument,
    "\n  mutation RenameMedia($id: ID!, $title: String!) {\n    renameMedia(id: $id, title: $title) {\n      ...MediaAssetFields\n    }\n  }\n": typeof types.RenameMediaDocument,
    "\n  mutation RemoveMedia($id: ID!) {\n    removeMedia(id: $id)\n  }\n": typeof types.RemoveMediaDocument,
    "\n  query AudioPlaybackUrl($assetId: ID!) {\n    audioPlaybackUrl(assetId: $assetId)\n  }\n": typeof types.AudioPlaybackUrlDocument,
    "\n  query AudioDownloadUrl($assetId: ID!) {\n    audioDownloadUrl(assetId: $assetId)\n  }\n": typeof types.AudioDownloadUrlDocument,
    "\n  fragment AssignmentFields on Assignment {\n    userId\n    role\n    instrumentId\n    instrumentName\n    notes\n    overrideReason\n    ackStatus\n    ackNote\n    ackAt\n    person {\n      name\n      warName\n      rank\n      section\n    }\n  }\n": typeof types.AssignmentFieldsFragmentDoc,
    "\n  fragment RosterFields on Roster {\n    eventId\n    status\n    version\n    publishedAt\n    uncoveredSections\n    assignments {\n      ...AssignmentFields\n    }\n  }\n": typeof types.RosterFieldsFragmentDoc,
    "\n  query EventRoster($eventId: ID!) {\n    eventRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": typeof types.EventRosterDocument,
    "\n  query RosterCandidates($eventId: ID!) {\n    rosterCandidates(eventId: $eventId) {\n      userId\n      name\n      warName\n      rank\n      section\n      memberStatus\n      instruments {\n        instrumentId\n        name\n        primary\n      }\n      blocker\n      absence {\n        type\n        startsOn\n        endsOn\n      }\n      busyWith {\n        eventId\n        title\n      }\n    }\n  }\n": typeof types.RosterCandidatesDocument,
    "\n  query MyAssignments {\n    myAssignments {\n      eventId\n      role\n      instrumentId\n      instrumentName\n      ackStatus\n      ackNote\n      event {\n        id\n        title\n        type\n        status\n        callTime\n        startsAt\n        endsAt\n        venue {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.MyAssignmentsDocument,
    "\n  mutation SaveRoster($eventId: ID!, $input: RosterInput!) {\n    saveRoster(eventId: $eventId, input: $input) {\n      ...RosterFields\n    }\n  }\n": typeof types.SaveRosterDocument,
    "\n  mutation PublishRoster($eventId: ID!) {\n    publishRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": typeof types.PublishRosterDocument,
    "\n  mutation AcknowledgeRoster(\n    $eventId: ID!\n    $answer: AckAnswer!\n    $note: String\n  ) {\n    acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {\n      ackStatus\n      ackNote\n    }\n  }\n": typeof types.AcknowledgeRosterDocument,
};
const documents: Documents = {
    "\n  fragment AbsenceFields on Absence {\n    id\n    userId\n    userName\n    warName\n    type\n    startsOn\n    endsOn\n    reason\n    status\n    reviewNote\n    reviewedAt\n    createdAt\n  }\n": types.AbsenceFieldsFragmentDoc,
    "\n  query MyAbsences {\n    myAbsences {\n      ...AbsenceFields\n    }\n  }\n": types.MyAbsencesDocument,
    "\n  query Absences($filter: AbsenceFilterInput) {\n    absences(filter: $filter) {\n      ...AbsenceFields\n    }\n  }\n": types.AbsencesDocument,
    "\n  mutation RequestAbsence($input: AbsenceInput!) {\n    requestAbsence(input: $input) {\n      ...AbsenceFields\n    }\n  }\n": types.RequestAbsenceDocument,
    "\n  mutation RegisterAbsence($userId: ID!, $input: AbsenceInput!) {\n    registerAbsence(userId: $userId, input: $input) {\n      ...AbsenceFields\n    }\n  }\n": types.RegisterAbsenceDocument,
    "\n  mutation ReviewAbsence($id: ID!, $approve: Boolean!, $note: String) {\n    reviewAbsence(id: $id, approve: $approve, note: $note) {\n      ...AbsenceFields\n    }\n  }\n": types.ReviewAbsenceDocument,
    "\n  mutation CancelAbsence($id: ID!) {\n    cancelAbsence(id: $id) {\n      ...AbsenceFields\n    }\n  }\n": types.CancelAbsenceDocument,
    "\n  query Users($filter: UserFilterInput, $page: PageInput) {\n    users(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...UserAccountFields\n      }\n    }\n  }\n": types.UsersDocument,
    "\n  fragment UserAccountFields on UserAccount {\n    id\n    name\n    email\n    username\n    group\n    active\n    mustChangePassword\n    lockedUntil\n    locked\n    lastLoginAt\n    deactivatedAt\n    createdAt\n  }\n": types.UserAccountFieldsFragmentDoc,
    "\n  query User($id: ID!) {\n    user(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": types.UserDocument,
    "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      ...UserAccountFields\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation SetUserActive($id: ID!, $active: Boolean!) {\n    setUserActive(id: $id, active: $active) {\n      ...UserAccountFields\n    }\n  }\n": types.SetUserActiveDocument,
    "\n  mutation ResetUserPassword($id: ID!) {\n    resetUserPassword(id: $id) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n": types.ResetUserPasswordDocument,
    "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": types.UnlockUserDocument,
    "\n  mutation RevokeUserSessions($id: ID!) {\n    revokeUserSessions(id: $id) {\n      ...UserAccountFields\n    }\n  }\n": types.RevokeUserSessionsDocument,
    "\n  query UserPermissions($id: ID!) {\n    userPermissions(id: $id) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": types.UserPermissionsDocument,
    "\n  mutation SetUserPermissions($input: SetUserPermissionsInput!) {\n    setUserPermissions(input: $input) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n": types.SetUserPermissionsDocument,
    "\n  query AuditLogs($filter: AuditFilterInput, $page: PageInput) {\n    auditLogs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        actorId\n        actorName\n        action\n        entity\n        entityId\n        before\n        after\n        ip\n        createdAt\n      }\n    }\n  }\n": types.AuditLogsDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n": types.RefreshSessionDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": types.MeDocument,
    "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n": types.ChangeMyPasswordDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n": types.UpdateMyProfileDocument,
    "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n": types.RequestPasswordRecoveryDocument,
    "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n": types.VerifyPasswordRecoveryCodeDocument,
    "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n": types.ResetPasswordWithRecoveryDocument,
    "\n  fragment EventFields on Event {\n    id\n    title\n    type\n    status\n    callTime\n    startsAt\n    endsAt\n    venueId\n    uniform\n    requester\n    documentRef\n    notes\n    cancellationReason\n    venue {\n      ...VenueFields\n    }\n  }\n": types.EventFieldsFragmentDoc,
    "\n  fragment VenueFields on Venue {\n    id\n    name\n    address\n    city\n    mapsUrl\n    notes\n    archived\n  }\n": types.VenueFieldsFragmentDoc,
    "\n  query Events($filter: EventFilterInput) {\n    events(filter: $filter) {\n      ...EventFields\n    }\n  }\n": types.EventsDocument,
    "\n  query UpcomingEvents($limit: Int!) {\n    upcomingEvents(limit: $limit) {\n      ...EventFields\n    }\n  }\n": types.UpcomingEventsDocument,
    "\n  query Event($id: ID!) {\n    event(id: $id) {\n      ...EventFields\n      setlist {\n        position\n        songId\n        notes\n        song {\n          id\n          title\n          musicalKey\n          durationSeconds\n          archivedAt\n          media {\n            id\n            kind\n            title\n          }\n        }\n      }\n    }\n  }\n": types.EventDocument,
    "\n  mutation CreateEvent($input: EventInput!) {\n    createEvent(input: $input) {\n      ...EventFields\n    }\n  }\n": types.CreateEventDocument,
    "\n  mutation UpdateEvent($id: ID!, $input: EventInput!) {\n    updateEvent(id: $id, input: $input) {\n      ...EventFields\n    }\n  }\n": types.UpdateEventDocument,
    "\n  mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {\n    changeEventStatus(id: $id, status: $status, reason: $reason) {\n      ...EventFields\n    }\n  }\n": types.ChangeEventStatusDocument,
    "\n  mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {\n    setEventSetlist(id: $id, input: $input) {\n      position\n      songId\n    }\n  }\n": types.SetEventSetlistDocument,
    "\n  query Venues($includeArchived: Boolean!) {\n    venues(includeArchived: $includeArchived) {\n      ...VenueFields\n    }\n  }\n": types.VenuesDocument,
    "\n  mutation CreateVenue($input: VenueInput!) {\n    createVenue(input: $input) {\n      ...VenueFields\n    }\n  }\n": types.CreateVenueDocument,
    "\n  mutation UpdateVenue($id: ID!, $input: VenueInput!) {\n    updateVenue(id: $id, input: $input) {\n      ...VenueFields\n    }\n  }\n": types.UpdateVenueDocument,
    "\n  fragment MemberProfileFields on MemberProfile {\n    userId\n    warName\n    rank\n    registration\n    phone\n    section\n    status\n    notes\n    updatedAt\n    instruments {\n      instrumentId\n      name\n      primary\n    }\n  }\n": types.MemberProfileFieldsFragmentDoc,
    "\n  query Roster($filter: RosterFilterInput, $page: PageInput) {\n    roster(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        userId\n        name\n        username\n        active\n        profile {\n          ...MemberProfileFields\n        }\n      }\n    }\n  }\n": types.RosterDocument,
    "\n  query MemberProfile($userId: ID!) {\n    memberProfile(userId: $userId) {\n      ...MemberProfileFields\n    }\n  }\n": types.MemberProfileDocument,
    "\n  query MyMemberProfile {\n    myMemberProfile {\n      ...MemberProfileFields\n    }\n  }\n": types.MyMemberProfileDocument,
    "\n  mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {\n    saveMemberProfile(userId: $userId, input: $input) {\n      ...MemberProfileFields\n    }\n  }\n": types.SaveMemberProfileDocument,
    "\n  query Instruments($includeArchived: Boolean!) {\n    instruments(includeArchived: $includeArchived) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": types.InstrumentsDocument,
    "\n  mutation CreateInstrument($input: CreateInstrumentInput!) {\n    createInstrument(input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": types.CreateInstrumentDocument,
    "\n  mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {\n    updateInstrument(id: $id, input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": types.UpdateInstrumentDocument,
    "\n  query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {\n    myNotifications(unreadOnly: $unreadOnly, page: $page) {\n      items {\n        id\n        type\n        title\n        body\n        link\n        readAt\n        createdAt\n      }\n      total\n      page\n      totalPages\n    }\n  }\n": types.MyNotificationsDocument,
    "\n  query UnreadNotificationsCount {\n    unreadNotificationsCount\n  }\n": types.UnreadNotificationsCountDocument,
    "\n  mutation MarkNotificationRead($id: ID!) {\n    markNotificationRead(id: $id)\n  }\n": types.MarkNotificationReadDocument,
    "\n  mutation MarkAllNotificationsRead {\n    markAllNotificationsRead\n  }\n": types.MarkAllNotificationsReadDocument,
    "\n  query NotificationPreferences {\n    myNotificationPreferences {\n      type\n      emailEnabled\n    }\n  }\n": types.NotificationPreferencesDocument,
    "\n  mutation SetNotificationPreference(\n    $type: NotificationType!\n    $emailEnabled: Boolean!\n  ) {\n    setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {\n      type\n      emailEnabled\n    }\n  }\n": types.SetNotificationPreferenceDocument,
    "\n  fragment SongFields on Song {\n    id\n    title\n    artist\n    arranger\n    category\n    musicalKey\n    bpm\n    durationSeconds\n    lyrics\n    notes\n    tags\n    archivedAt\n    createdAt\n    updatedAt\n  }\n": types.SongFieldsFragmentDoc,
    "\n  fragment MediaAssetFields on MediaAsset {\n    id\n    songId\n    kind\n    status\n    title\n    mimeType\n    sizeBytes\n    durationSeconds\n    youtubeVideoId\n    thumbnailUrl\n    createdAt\n  }\n": types.MediaAssetFieldsFragmentDoc,
    "\n  query Songs($filter: SongFilterInput, $page: PageInput) {\n    songs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...SongFields\n      }\n    }\n    songTags\n  }\n": types.SongsDocument,
    "\n  query Song($id: ID!) {\n    song(id: $id) {\n      ...SongFields\n      media {\n        ...MediaAssetFields\n      }\n    }\n  }\n": types.SongDocument,
    "\n  mutation CreateSong($input: SongInput!) {\n    createSong(input: $input) {\n      ...SongFields\n    }\n  }\n": types.CreateSongDocument,
    "\n  mutation UpdateSong($id: ID!, $input: SongInput!) {\n    updateSong(id: $id, input: $input) {\n      ...SongFields\n    }\n  }\n": types.UpdateSongDocument,
    "\n  mutation SetSongArchived($id: ID!, $archived: Boolean!) {\n    setSongArchived(id: $id, archived: $archived) {\n      ...SongFields\n    }\n  }\n": types.SetSongArchivedDocument,
    "\n  mutation AddYoutubeVideo($input: AddYoutubeVideoInput!) {\n    addYoutubeVideo(input: $input) {\n      ...MediaAssetFields\n    }\n  }\n": types.AddYoutubeVideoDocument,
    "\n  mutation RequestAudioUpload($input: RequestAudioUploadInput!) {\n    requestAudioUpload(input: $input) {\n      asset {\n        ...MediaAssetFields\n      }\n      upload {\n        url\n        fields\n        expiresAt\n      }\n    }\n  }\n": types.RequestAudioUploadDocument,
    "\n  mutation ConfirmAudioUpload($input: ConfirmAudioUploadInput!) {\n    confirmAudioUpload(input: $input) {\n      ...MediaAssetFields\n    }\n  }\n": types.ConfirmAudioUploadDocument,
    "\n  mutation RenameMedia($id: ID!, $title: String!) {\n    renameMedia(id: $id, title: $title) {\n      ...MediaAssetFields\n    }\n  }\n": types.RenameMediaDocument,
    "\n  mutation RemoveMedia($id: ID!) {\n    removeMedia(id: $id)\n  }\n": types.RemoveMediaDocument,
    "\n  query AudioPlaybackUrl($assetId: ID!) {\n    audioPlaybackUrl(assetId: $assetId)\n  }\n": types.AudioPlaybackUrlDocument,
    "\n  query AudioDownloadUrl($assetId: ID!) {\n    audioDownloadUrl(assetId: $assetId)\n  }\n": types.AudioDownloadUrlDocument,
    "\n  fragment AssignmentFields on Assignment {\n    userId\n    role\n    instrumentId\n    instrumentName\n    notes\n    overrideReason\n    ackStatus\n    ackNote\n    ackAt\n    person {\n      name\n      warName\n      rank\n      section\n    }\n  }\n": types.AssignmentFieldsFragmentDoc,
    "\n  fragment RosterFields on Roster {\n    eventId\n    status\n    version\n    publishedAt\n    uncoveredSections\n    assignments {\n      ...AssignmentFields\n    }\n  }\n": types.RosterFieldsFragmentDoc,
    "\n  query EventRoster($eventId: ID!) {\n    eventRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": types.EventRosterDocument,
    "\n  query RosterCandidates($eventId: ID!) {\n    rosterCandidates(eventId: $eventId) {\n      userId\n      name\n      warName\n      rank\n      section\n      memberStatus\n      instruments {\n        instrumentId\n        name\n        primary\n      }\n      blocker\n      absence {\n        type\n        startsOn\n        endsOn\n      }\n      busyWith {\n        eventId\n        title\n      }\n    }\n  }\n": types.RosterCandidatesDocument,
    "\n  query MyAssignments {\n    myAssignments {\n      eventId\n      role\n      instrumentId\n      instrumentName\n      ackStatus\n      ackNote\n      event {\n        id\n        title\n        type\n        status\n        callTime\n        startsAt\n        endsAt\n        venue {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.MyAssignmentsDocument,
    "\n  mutation SaveRoster($eventId: ID!, $input: RosterInput!) {\n    saveRoster(eventId: $eventId, input: $input) {\n      ...RosterFields\n    }\n  }\n": types.SaveRosterDocument,
    "\n  mutation PublishRoster($eventId: ID!) {\n    publishRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": types.PublishRosterDocument,
    "\n  mutation AcknowledgeRoster(\n    $eventId: ID!\n    $answer: AckAnswer!\n    $note: String\n  ) {\n    acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {\n      ackStatus\n      ackNote\n    }\n  }\n": types.AcknowledgeRosterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AbsenceFields on Absence {\n    id\n    userId\n    userName\n    warName\n    type\n    startsOn\n    endsOn\n    reason\n    status\n    reviewNote\n    reviewedAt\n    createdAt\n  }\n"): typeof import('./graphql').AbsenceFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyAbsences {\n    myAbsences {\n      ...AbsenceFields\n    }\n  }\n"): typeof import('./graphql').MyAbsencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Absences($filter: AbsenceFilterInput) {\n    absences(filter: $filter) {\n      ...AbsenceFields\n    }\n  }\n"): typeof import('./graphql').AbsencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestAbsence($input: AbsenceInput!) {\n    requestAbsence(input: $input) {\n      ...AbsenceFields\n    }\n  }\n"): typeof import('./graphql').RequestAbsenceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterAbsence($userId: ID!, $input: AbsenceInput!) {\n    registerAbsence(userId: $userId, input: $input) {\n      ...AbsenceFields\n    }\n  }\n"): typeof import('./graphql').RegisterAbsenceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReviewAbsence($id: ID!, $approve: Boolean!, $note: String) {\n    reviewAbsence(id: $id, approve: $approve, note: $note) {\n      ...AbsenceFields\n    }\n  }\n"): typeof import('./graphql').ReviewAbsenceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelAbsence($id: ID!) {\n    cancelAbsence(id: $id) {\n      ...AbsenceFields\n    }\n  }\n"): typeof import('./graphql').CancelAbsenceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Users($filter: UserFilterInput, $page: PageInput) {\n    users(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...UserAccountFields\n      }\n    }\n  }\n"): typeof import('./graphql').UsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserAccountFields on UserAccount {\n    id\n    name\n    email\n    username\n    group\n    active\n    mustChangePassword\n    lockedUntil\n    locked\n    lastLoginAt\n    deactivatedAt\n    createdAt\n  }\n"): typeof import('./graphql').UserAccountFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query User($id: ID!) {\n    user(id: $id) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').UserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n"): typeof import('./graphql').CreateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n    updateUser(id: $id, input: $input) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').UpdateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetUserActive($id: ID!, $active: Boolean!) {\n    setUserActive(id: $id, active: $active) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').SetUserActiveDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetUserPassword($id: ID!) {\n    resetUserPassword(id: $id) {\n      temporaryPassword\n      emailSent\n      user {\n        ...UserAccountFields\n      }\n    }\n  }\n"): typeof import('./graphql').ResetUserPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnlockUser($id: ID!) {\n    unlockUser(id: $id) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').UnlockUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeUserSessions($id: ID!) {\n    revokeUserSessions(id: $id) {\n      ...UserAccountFields\n    }\n  }\n"): typeof import('./graphql').RevokeUserSessionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UserPermissions($id: ID!) {\n    userPermissions(id: $id) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n"): typeof import('./graphql').UserPermissionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetUserPermissions($input: SetUserPermissionsInput!) {\n    setUserPermissions(input: $input) {\n      effective\n      defaults\n      overrides {\n        permission\n        allowed\n      }\n    }\n  }\n"): typeof import('./graphql').SetUserPermissionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AuditLogs($filter: AuditFilterInput, $page: PageInput) {\n    auditLogs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        actorId\n        actorName\n        action\n        entity\n        entityId\n        before\n        after\n        ip\n        createdAt\n      }\n    }\n  }\n"): typeof import('./graphql').AuditLogsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n      }\n    }\n  }\n"): typeof import('./graphql').LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n"): typeof import('./graphql').RefreshSessionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): typeof import('./graphql').LogoutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n"): typeof import('./graphql').ChangeMyPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n    }\n  }\n"): typeof import('./graphql').UpdateMyProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n"): typeof import('./graphql').RequestPasswordRecoveryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n"): typeof import('./graphql').VerifyPasswordRecoveryCodeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n"): typeof import('./graphql').ResetPasswordWithRecoveryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventFields on Event {\n    id\n    title\n    type\n    status\n    callTime\n    startsAt\n    endsAt\n    venueId\n    uniform\n    requester\n    documentRef\n    notes\n    cancellationReason\n    venue {\n      ...VenueFields\n    }\n  }\n"): typeof import('./graphql').EventFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VenueFields on Venue {\n    id\n    name\n    address\n    city\n    mapsUrl\n    notes\n    archived\n  }\n"): typeof import('./graphql').VenueFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Events($filter: EventFilterInput) {\n    events(filter: $filter) {\n      ...EventFields\n    }\n  }\n"): typeof import('./graphql').EventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UpcomingEvents($limit: Int!) {\n    upcomingEvents(limit: $limit) {\n      ...EventFields\n    }\n  }\n"): typeof import('./graphql').UpcomingEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Event($id: ID!) {\n    event(id: $id) {\n      ...EventFields\n      setlist {\n        position\n        songId\n        notes\n        song {\n          id\n          title\n          musicalKey\n          durationSeconds\n          archivedAt\n          media {\n            id\n            kind\n            title\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').EventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEvent($input: EventInput!) {\n    createEvent(input: $input) {\n      ...EventFields\n    }\n  }\n"): typeof import('./graphql').CreateEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateEvent($id: ID!, $input: EventInput!) {\n    updateEvent(id: $id, input: $input) {\n      ...EventFields\n    }\n  }\n"): typeof import('./graphql').UpdateEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {\n    changeEventStatus(id: $id, status: $status, reason: $reason) {\n      ...EventFields\n    }\n  }\n"): typeof import('./graphql').ChangeEventStatusDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {\n    setEventSetlist(id: $id, input: $input) {\n      position\n      songId\n    }\n  }\n"): typeof import('./graphql').SetEventSetlistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Venues($includeArchived: Boolean!) {\n    venues(includeArchived: $includeArchived) {\n      ...VenueFields\n    }\n  }\n"): typeof import('./graphql').VenuesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateVenue($input: VenueInput!) {\n    createVenue(input: $input) {\n      ...VenueFields\n    }\n  }\n"): typeof import('./graphql').CreateVenueDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateVenue($id: ID!, $input: VenueInput!) {\n    updateVenue(id: $id, input: $input) {\n      ...VenueFields\n    }\n  }\n"): typeof import('./graphql').UpdateVenueDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MemberProfileFields on MemberProfile {\n    userId\n    warName\n    rank\n    registration\n    phone\n    section\n    status\n    notes\n    updatedAt\n    instruments {\n      instrumentId\n      name\n      primary\n    }\n  }\n"): typeof import('./graphql').MemberProfileFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Roster($filter: RosterFilterInput, $page: PageInput) {\n    roster(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        userId\n        name\n        username\n        active\n        profile {\n          ...MemberProfileFields\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').RosterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MemberProfile($userId: ID!) {\n    memberProfile(userId: $userId) {\n      ...MemberProfileFields\n    }\n  }\n"): typeof import('./graphql').MemberProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyMemberProfile {\n    myMemberProfile {\n      ...MemberProfileFields\n    }\n  }\n"): typeof import('./graphql').MyMemberProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {\n    saveMemberProfile(userId: $userId, input: $input) {\n      ...MemberProfileFields\n    }\n  }\n"): typeof import('./graphql').SaveMemberProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Instruments($includeArchived: Boolean!) {\n    instruments(includeArchived: $includeArchived) {\n      id\n      name\n      section\n      archived\n    }\n  }\n"): typeof import('./graphql').InstrumentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateInstrument($input: CreateInstrumentInput!) {\n    createInstrument(input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n"): typeof import('./graphql').CreateInstrumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {\n    updateInstrument(id: $id, input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n"): typeof import('./graphql').UpdateInstrumentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {\n    myNotifications(unreadOnly: $unreadOnly, page: $page) {\n      items {\n        id\n        type\n        title\n        body\n        link\n        readAt\n        createdAt\n      }\n      total\n      page\n      totalPages\n    }\n  }\n"): typeof import('./graphql').MyNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UnreadNotificationsCount {\n    unreadNotificationsCount\n  }\n"): typeof import('./graphql').UnreadNotificationsCountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkNotificationRead($id: ID!) {\n    markNotificationRead(id: $id)\n  }\n"): typeof import('./graphql').MarkNotificationReadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkAllNotificationsRead {\n    markAllNotificationsRead\n  }\n"): typeof import('./graphql').MarkAllNotificationsReadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NotificationPreferences {\n    myNotificationPreferences {\n      type\n      emailEnabled\n    }\n  }\n"): typeof import('./graphql').NotificationPreferencesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetNotificationPreference(\n    $type: NotificationType!\n    $emailEnabled: Boolean!\n  ) {\n    setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {\n      type\n      emailEnabled\n    }\n  }\n"): typeof import('./graphql').SetNotificationPreferenceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SongFields on Song {\n    id\n    title\n    artist\n    arranger\n    category\n    musicalKey\n    bpm\n    durationSeconds\n    lyrics\n    notes\n    tags\n    archivedAt\n    createdAt\n    updatedAt\n  }\n"): typeof import('./graphql').SongFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaAssetFields on MediaAsset {\n    id\n    songId\n    kind\n    status\n    title\n    mimeType\n    sizeBytes\n    durationSeconds\n    youtubeVideoId\n    thumbnailUrl\n    createdAt\n  }\n"): typeof import('./graphql').MediaAssetFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Songs($filter: SongFilterInput, $page: PageInput) {\n    songs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...SongFields\n      }\n    }\n    songTags\n  }\n"): typeof import('./graphql').SongsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Song($id: ID!) {\n    song(id: $id) {\n      ...SongFields\n      media {\n        ...MediaAssetFields\n      }\n    }\n  }\n"): typeof import('./graphql').SongDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSong($input: SongInput!) {\n    createSong(input: $input) {\n      ...SongFields\n    }\n  }\n"): typeof import('./graphql').CreateSongDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSong($id: ID!, $input: SongInput!) {\n    updateSong(id: $id, input: $input) {\n      ...SongFields\n    }\n  }\n"): typeof import('./graphql').UpdateSongDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetSongArchived($id: ID!, $archived: Boolean!) {\n    setSongArchived(id: $id, archived: $archived) {\n      ...SongFields\n    }\n  }\n"): typeof import('./graphql').SetSongArchivedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddYoutubeVideo($input: AddYoutubeVideoInput!) {\n    addYoutubeVideo(input: $input) {\n      ...MediaAssetFields\n    }\n  }\n"): typeof import('./graphql').AddYoutubeVideoDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestAudioUpload($input: RequestAudioUploadInput!) {\n    requestAudioUpload(input: $input) {\n      asset {\n        ...MediaAssetFields\n      }\n      upload {\n        url\n        fields\n        expiresAt\n      }\n    }\n  }\n"): typeof import('./graphql').RequestAudioUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmAudioUpload($input: ConfirmAudioUploadInput!) {\n    confirmAudioUpload(input: $input) {\n      ...MediaAssetFields\n    }\n  }\n"): typeof import('./graphql').ConfirmAudioUploadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RenameMedia($id: ID!, $title: String!) {\n    renameMedia(id: $id, title: $title) {\n      ...MediaAssetFields\n    }\n  }\n"): typeof import('./graphql').RenameMediaDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveMedia($id: ID!) {\n    removeMedia(id: $id)\n  }\n"): typeof import('./graphql').RemoveMediaDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AudioPlaybackUrl($assetId: ID!) {\n    audioPlaybackUrl(assetId: $assetId)\n  }\n"): typeof import('./graphql').AudioPlaybackUrlDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AudioDownloadUrl($assetId: ID!) {\n    audioDownloadUrl(assetId: $assetId)\n  }\n"): typeof import('./graphql').AudioDownloadUrlDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AssignmentFields on Assignment {\n    userId\n    role\n    instrumentId\n    instrumentName\n    notes\n    overrideReason\n    ackStatus\n    ackNote\n    ackAt\n    person {\n      name\n      warName\n      rank\n      section\n    }\n  }\n"): typeof import('./graphql').AssignmentFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RosterFields on Roster {\n    eventId\n    status\n    version\n    publishedAt\n    uncoveredSections\n    assignments {\n      ...AssignmentFields\n    }\n  }\n"): typeof import('./graphql').RosterFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EventRoster($eventId: ID!) {\n    eventRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n"): typeof import('./graphql').EventRosterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RosterCandidates($eventId: ID!) {\n    rosterCandidates(eventId: $eventId) {\n      userId\n      name\n      warName\n      rank\n      section\n      memberStatus\n      instruments {\n        instrumentId\n        name\n        primary\n      }\n      blocker\n      absence {\n        type\n        startsOn\n        endsOn\n      }\n      busyWith {\n        eventId\n        title\n      }\n    }\n  }\n"): typeof import('./graphql').RosterCandidatesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyAssignments {\n    myAssignments {\n      eventId\n      role\n      instrumentId\n      instrumentName\n      ackStatus\n      ackNote\n      event {\n        id\n        title\n        type\n        status\n        callTime\n        startsAt\n        endsAt\n        venue {\n          id\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').MyAssignmentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveRoster($eventId: ID!, $input: RosterInput!) {\n    saveRoster(eventId: $eventId, input: $input) {\n      ...RosterFields\n    }\n  }\n"): typeof import('./graphql').SaveRosterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PublishRoster($eventId: ID!) {\n    publishRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n"): typeof import('./graphql').PublishRosterDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcknowledgeRoster(\n    $eventId: ID!\n    $answer: AckAnswer!\n    $note: String\n  ) {\n    acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {\n      ackStatus\n      ackNote\n    }\n  }\n"): typeof import('./graphql').AcknowledgeRosterDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
