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
    "\n  fragment AbsenceFields on Absence {\n    id\n    userId\n    userName\n    warName\n    photoUrl\n    type\n    startsOn\n    endsOn\n    reason\n    status\n    reviewNote\n    reviewedAt\n    reviewedByName\n    cancelledAt\n    cancelledByName\n    registered\n    createdAt\n    attachments {\n      id\n      fileName\n      mimeType\n      sizeBytes\n    }\n  }\n": typeof types.AbsenceFieldsFragmentDoc,
    "\n  mutation RequestAbsenceAttachmentUploads($files: [AttachmentFileInput!]!) {\n    requestAbsenceAttachmentUploads(files: $files) {\n      storageKey\n      upload {\n        url\n        fields\n      }\n    }\n  }\n": typeof types.RequestAbsenceAttachmentUploadsDocument,
    "\n  query AbsenceAttachmentUrl($id: ID!, $download: Boolean!) {\n    absenceAttachmentUrl(id: $id, download: $download)\n  }\n": typeof types.AbsenceAttachmentUrlDocument,
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
    "\n  query RecordStamp($entity: String!, $id: ID!) {\n    recordStamp(entity: $entity, id: $id) {\n      createdAt\n      createdByName\n      updatedAt\n      updatedByName\n    }\n  }\n": typeof types.RecordStampDocument,
    "\n  fragment ArtistFields on Artist {\n    id\n    name\n    archived\n    createdAt\n  }\n": typeof types.ArtistFieldsFragmentDoc,
    "\n  query Artists($includeArchived: Boolean!) {\n    artists(includeArchived: $includeArchived) {\n      ...ArtistFields\n    }\n  }\n": typeof types.ArtistsDocument,
    "\n  query ArtistsPage($filter: ArtistFilterInput, $page: PageInput) {\n    artistsPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        name\n        archived\n        createdAt\n        songCount\n      }\n    }\n  }\n": typeof types.ArtistsPageDocument,
    "\n  mutation CreateArtist($input: ArtistInput!) {\n    createArtist(input: $input) {\n      ...ArtistFields\n    }\n  }\n": typeof types.CreateArtistDocument,
    "\n  mutation UpdateArtist($id: ID!, $input: ArtistInput!) {\n    updateArtist(id: $id, input: $input) {\n      ...ArtistFields\n    }\n  }\n": typeof types.UpdateArtistDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n        photoUrl\n        onboardingCompleted\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n": typeof types.RefreshSessionDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n      photoUrl\n      onboardingCompleted\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation CompleteOnboarding {\n    completeOnboarding\n  }\n": typeof types.CompleteOnboardingDocument,
    "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n": typeof types.ChangeMyPasswordDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n      photoUrl\n      onboardingCompleted\n    }\n  }\n": typeof types.UpdateMyProfileDocument,
    "\n  mutation SetMyPhoto($photo: String!) {\n    setMyPhoto(photo: $photo)\n  }\n": typeof types.SetMyPhotoDocument,
    "\n  mutation RemoveMyPhoto {\n    removeMyPhoto\n  }\n": typeof types.RemoveMyPhotoDocument,
    "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n": typeof types.RequestPasswordRecoveryDocument,
    "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n": typeof types.VerifyPasswordRecoveryCodeDocument,
    "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n": typeof types.ResetPasswordWithRecoveryDocument,
    "\n  query BandFunctions($includeArchived: Boolean!) {\n    bandFunctions(includeArchived: $includeArchived) {\n      id\n      name\n      archived\n    }\n  }\n": typeof types.BandFunctionsDocument,
    "\n  query BandFunctionsPage($filter: BandFunctionFilterInput, $page: PageInput) {\n    bandFunctionsPage(filter: $filter, page: $page) {\n      items {\n        id\n        name\n        archived\n        memberCount\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": typeof types.BandFunctionsPageDocument,
    "\n  mutation CreateBandFunction($input: CreateBandFunctionInput!) {\n    createBandFunction(input: $input) {\n      id\n      name\n      archived\n    }\n  }\n": typeof types.CreateBandFunctionDocument,
    "\n  mutation UpdateBandFunction($id: ID!, $input: UpdateBandFunctionInput!) {\n    updateBandFunction(id: $id, input: $input) {\n      id\n      name\n      archived\n    }\n  }\n": typeof types.UpdateBandFunctionDocument,
    "\n  fragment BroadcastFields on Broadcast {\n    id\n    title\n    body\n    audience\n    section\n    eventId\n    sendEmail\n    recipients\n    authorName\n    createdAt\n  }\n": typeof types.BroadcastFieldsFragmentDoc,
    "\n  query Broadcasts {\n    broadcasts {\n      ...BroadcastFields\n    }\n  }\n": typeof types.BroadcastsDocument,
    "\n  mutation SendBroadcast($input: BroadcastInput!) {\n    sendBroadcast(input: $input) {\n      ...BroadcastFields\n    }\n  }\n": typeof types.SendBroadcastDocument,
    "\n  query BandDashboard {\n    bandDashboard {\n      activeMembers\n      awayMembers\n      upcomingEvents\n      eventsWithoutRoster\n      pendingAcks\n      swapRequests\n      pendingAbsences\n      absentToday\n      failedNotifications\n    }\n  }\n": typeof types.BandDashboardDocument,
    "\n  fragment DutyScheduleFields on DutySchedule {\n    id\n    title\n    startsOn\n    endsOn\n    venueId\n    uniform\n    notes\n    audienceKind\n    sections\n    status\n    cancellationReason\n    dayCount\n    memberCount\n    createdAt\n  }\n": typeof types.DutyScheduleFieldsFragmentDoc,
    "\n  query DutySchedulesPage($filter: DutyScheduleFilterInput, $page: PageInput) {\n    dutySchedulesPage(filter: $filter, page: $page) {\n      items {\n        ...DutyScheduleFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": typeof types.DutySchedulesPageDocument,
    "\n  query DutySchedule($id: ID!) {\n    dutySchedule(id: $id) {\n      id\n      title\n      startsOn\n      endsOn\n      venueId\n      uniform\n      notes\n      audienceKind\n      sections\n      status\n      cancellationReason\n      dayCount\n      memberCount\n      createdAt\n      venue {\n        id\n        name\n        fullAddress\n      }\n      days {\n        id\n        status\n        startsAt\n        endsAt\n      }\n      members {\n        userId\n        name\n        profile {\n          warName\n          rank\n          section\n        }\n      }\n    }\n  }\n": typeof types.DutyScheduleDocument,
    "\n  mutation CreateDutySchedule($input: DutyScheduleInput!) {\n    createDutySchedule(input: $input) {\n      ...DutyScheduleFields\n    }\n  }\n": typeof types.CreateDutyScheduleDocument,
    "\n  mutation CancelDutySchedule($id: ID!, $input: CancelDutyScheduleInput!) {\n    cancelDutySchedule(id: $id, input: $input) {\n      ...DutyScheduleFields\n    }\n  }\n": typeof types.CancelDutyScheduleDocument,
    "\n  mutation VerifyEnrollmentCode($code: String!) {\n    verifyEnrollmentCode(code: $code)\n  }\n": typeof types.VerifyEnrollmentCodeDocument,
    "\n  query EnrollmentInstruments($formToken: String!) {\n    enrollmentInstruments(formToken: $formToken) {\n      id\n      name\n    }\n  }\n": typeof types.EnrollmentInstrumentsDocument,
    "\n  mutation SubmitEnrollment($input: SubmitEnrollmentInput!) {\n    submitEnrollment(input: $input)\n  }\n": typeof types.SubmitEnrollmentDocument,
    "\n  fragment EnrollmentInviteFields on EnrollmentInvite {\n    id\n    code\n    label\n    expiresAt\n    revokedAt\n    createdAt\n    requestCount\n  }\n": typeof types.EnrollmentInviteFieldsFragmentDoc,
    "\n  fragment EnrollmentRequestFields on EnrollmentRequest {\n    id\n    status\n    fullName\n    email\n    phone\n    military\n    militaryId\n    rank\n    warName\n    instruments {\n      instrumentId\n      primary\n    }\n    createdAt\n    reviewedAt\n    rejectionReason\n    userId\n    photoUrl\n  }\n": typeof types.EnrollmentRequestFieldsFragmentDoc,
    "\n  query EnrollmentInvites {\n    enrollmentInvites {\n      ...EnrollmentInviteFields\n    }\n  }\n": typeof types.EnrollmentInvitesDocument,
    "\n  mutation CreateEnrollmentInvite($input: CreateEnrollmentInviteInput!) {\n    createEnrollmentInvite(input: $input) {\n      ...EnrollmentInviteFields\n    }\n  }\n": typeof types.CreateEnrollmentInviteDocument,
    "\n  mutation RevokeEnrollmentInvite($id: ID!) {\n    revokeEnrollmentInvite(id: $id) {\n      ...EnrollmentInviteFields\n    }\n  }\n": typeof types.RevokeEnrollmentInviteDocument,
    "\n  query EnrollmentRequests(\n    $filter: EnrollmentRequestFilterInput\n    $page: PageInput\n  ) {\n    enrollmentRequests(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...EnrollmentRequestFields\n      }\n    }\n    pendingEnrollmentCount\n  }\n": typeof types.EnrollmentRequestsDocument,
    "\n  mutation ApproveEnrollmentRequest(\n    $id: ID!\n    $data: EnrollmentDataInput!\n    $group: UserGroup!\n  ) {\n    approveEnrollmentRequest(id: $id, data: $data, group: $group) {\n      request {\n        ...EnrollmentRequestFields\n      }\n      access {\n        temporaryPassword\n        emailSent\n        user {\n          ...UserAccountFields\n        }\n      }\n    }\n  }\n": typeof types.ApproveEnrollmentRequestDocument,
    "\n  mutation RejectEnrollmentRequest($id: ID!, $reason: String!) {\n    rejectEnrollmentRequest(id: $id, reason: $reason) {\n      ...EnrollmentRequestFields\n    }\n  }\n": typeof types.RejectEnrollmentRequestDocument,
    "\n  fragment EventFields on Event {\n    id\n    title\n    type\n    status\n    callTime\n    startsAt\n    endsAt\n    venueId\n    uniform\n    requester\n    documentRef\n    notes\n    cancellationReason\n    venue {\n      ...VenueFields\n    }\n  }\n": typeof types.EventFieldsFragmentDoc,
    "\n  fragment VenueFields on Venue {\n    id\n    name\n    zipCode\n    street\n    number\n    complement\n    district\n    city\n    state\n    fullAddress\n    mapsUrl\n    notes\n    archived\n  }\n": typeof types.VenueFieldsFragmentDoc,
    "\n  query EventsPage($filter: EventPageFilterInput, $page: PageInput) {\n    eventsPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...EventFields\n        setlistCount\n        rosterSummary {\n          status\n          assignments\n        }\n      }\n    }\n  }\n": typeof types.EventsPageDocument,
    "\n  query VenuesPage($filter: VenueFilterInput, $page: PageInput) {\n    venuesPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...VenueFields\n      }\n    }\n  }\n": typeof types.VenuesPageDocument,
    "\n  query ZipCodeAddress($zipCode: String!) {\n    zipCodeAddress(zipCode: $zipCode) {\n      zipCode\n      street\n      district\n      city\n      state\n    }\n  }\n": typeof types.ZipCodeAddressDocument,
    "\n  query Events($filter: EventFilterInput) {\n    events(filter: $filter) {\n      ...EventFields\n      myAssignment {\n        functionName\n        instrumentName\n      }\n    }\n  }\n": typeof types.EventsDocument,
    "\n  query UpcomingEvents($limit: Int!) {\n    upcomingEvents(limit: $limit) {\n      ...EventFields\n    }\n  }\n": typeof types.UpcomingEventsDocument,
    "\n  query Event($id: ID!) {\n    event(id: $id) {\n      ...EventFields\n      setlist {\n        position\n        songId\n        notes\n        song {\n          id\n          title\n          musicalKey\n          durationSeconds\n          lyrics\n          archivedAt\n          media {\n            id\n            kind\n            title\n          }\n        }\n      }\n    }\n  }\n": typeof types.EventDocument,
    "\n  mutation CreateEvent($input: EventInput!) {\n    createEvent(input: $input) {\n      ...EventFields\n    }\n  }\n": typeof types.CreateEventDocument,
    "\n  mutation UpdateEvent($id: ID!, $input: EventInput!) {\n    updateEvent(id: $id, input: $input) {\n      ...EventFields\n    }\n  }\n": typeof types.UpdateEventDocument,
    "\n  mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {\n    changeEventStatus(id: $id, status: $status, reason: $reason) {\n      ...EventFields\n    }\n  }\n": typeof types.ChangeEventStatusDocument,
    "\n  mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {\n    setEventSetlist(id: $id, input: $input) {\n      position\n      songId\n    }\n  }\n": typeof types.SetEventSetlistDocument,
    "\n  query Venues($includeArchived: Boolean!) {\n    venues(includeArchived: $includeArchived) {\n      ...VenueFields\n    }\n  }\n": typeof types.VenuesDocument,
    "\n  mutation CreateVenue($input: VenueInput!) {\n    createVenue(input: $input) {\n      ...VenueFields\n    }\n  }\n": typeof types.CreateVenueDocument,
    "\n  mutation UpdateVenue($id: ID!, $input: VenueInput!) {\n    updateVenue(id: $id, input: $input) {\n      ...VenueFields\n    }\n  }\n": typeof types.UpdateVenueDocument,
    "\n  fragment MemberProfileFields on MemberProfile {\n    userId\n    warName\n    rank\n    registration\n    phone\n    section\n    status\n    notes\n    updatedAt\n    instruments {\n      instrumentId\n      name\n      primary\n    }\n    functions {\n      functionId\n      name\n    }\n  }\n": typeof types.MemberProfileFieldsFragmentDoc,
    "\n  query Roster($filter: RosterFilterInput, $page: PageInput) {\n    roster(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        userId\n        name\n        username\n        active\n        photoUrl\n        profile {\n          ...MemberProfileFields\n        }\n      }\n    }\n  }\n": typeof types.RosterDocument,
    "\n  query MemberProfile($userId: ID!) {\n    memberProfile(userId: $userId) {\n      ...MemberProfileFields\n    }\n  }\n": typeof types.MemberProfileDocument,
    "\n  query MyMemberProfile {\n    myMemberProfile {\n      ...MemberProfileFields\n    }\n  }\n": typeof types.MyMemberProfileDocument,
    "\n  mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {\n    saveMemberProfile(userId: $userId, input: $input) {\n      ...MemberProfileFields\n    }\n  }\n": typeof types.SaveMemberProfileDocument,
    "\n  query Instruments($includeArchived: Boolean!) {\n    instruments(includeArchived: $includeArchived) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": typeof types.InstrumentsDocument,
    "\n  query InstrumentsPage($filter: InstrumentFilterInput, $page: PageInput) {\n    instrumentsPage(filter: $filter, page: $page) {\n      items {\n        id\n        name\n        section\n        archived\n        memberCount\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": typeof types.InstrumentsPageDocument,
    "\n  mutation CreateInstrument($input: CreateInstrumentInput!) {\n    createInstrument(input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": typeof types.CreateInstrumentDocument,
    "\n  mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {\n    updateInstrument(id: $id, input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": typeof types.UpdateInstrumentDocument,
    "\n  query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {\n    myNotifications(unreadOnly: $unreadOnly, page: $page) {\n      items {\n        id\n        type\n        title\n        body\n        link\n        readAt\n        createdAt\n      }\n      total\n      page\n      totalPages\n    }\n  }\n": typeof types.MyNotificationsDocument,
    "\n  query UnreadNotificationsCount {\n    unreadNotificationsCount\n  }\n": typeof types.UnreadNotificationsCountDocument,
    "\n  mutation MarkNotificationRead($id: ID!) {\n    markNotificationRead(id: $id)\n  }\n": typeof types.MarkNotificationReadDocument,
    "\n  mutation MarkAllNotificationsRead {\n    markAllNotificationsRead\n  }\n": typeof types.MarkAllNotificationsReadDocument,
    "\n  query NotificationPreferences {\n    myNotificationPreferences {\n      type\n      emailEnabled\n    }\n  }\n": typeof types.NotificationPreferencesDocument,
    "\n  mutation SetNotificationPreference(\n    $type: NotificationType!\n    $emailEnabled: Boolean!\n  ) {\n    setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {\n      type\n      emailEnabled\n    }\n  }\n": typeof types.SetNotificationPreferenceDocument,
    "\n  query PushPublicKey {\n    pushPublicKey\n  }\n": typeof types.PushPublicKeyDocument,
    "\n  mutation SubscribePush($input: PushSubscriptionInput!) {\n    subscribePush(input: $input)\n  }\n": typeof types.SubscribePushDocument,
    "\n  mutation UnsubscribePush($endpoint: String!) {\n    unsubscribePush(endpoint: $endpoint)\n  }\n": typeof types.UnsubscribePushDocument,
    "\n  mutation SendTestPush {\n    sendTestPush\n  }\n": typeof types.SendTestPushDocument,
    "\n  fragment SongFields on Song {\n    id\n    title\n    artistId\n    artist {\n      id\n      name\n    }\n    stage\n    arranger\n    category\n    musicalKey\n    bpm\n    durationSeconds\n    lyrics\n    notes\n    tags\n    archivedAt\n    createdAt\n    updatedAt\n  }\n": typeof types.SongFieldsFragmentDoc,
    "\n  fragment MediaAssetFields on MediaAsset {\n    id\n    songId\n    kind\n    status\n    title\n    mimeType\n    sizeBytes\n    durationSeconds\n    youtubeVideoId\n    thumbnailUrl\n    createdAt\n  }\n": typeof types.MediaAssetFieldsFragmentDoc,
    "\n  query Songs($filter: SongFilterInput, $page: PageInput, $archived: Boolean!) {\n    songs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...SongFields\n        media {\n          id\n          kind\n          title\n          youtubeVideoId\n        }\n      }\n    }\n    songTags\n    songTitles(archived: $archived)\n    artists(includeArchived: false) {\n      id\n      name\n      archived\n    }\n  }\n": typeof types.SongsDocument,
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
    "\n  query FindLyrics($artist: String!, $title: String!) {\n    findLyrics(artist: $artist, title: $title) {\n      artist\n      title\n      lyrics\n      sourceUrl\n    }\n  }\n": typeof types.FindLyricsDocument,
    "\n  query SearchYoutube($query: String!) {\n    searchYoutube(query: $query) {\n      videoId\n      title\n      channelTitle\n      thumbnailUrl\n      publishedAt\n      durationSeconds\n    }\n  }\n": typeof types.SearchYoutubeDocument,
    "\n  fragment AssignmentFields on Assignment {\n    userId\n    functionId\n    functionName\n    instrumentId\n    instrumentName\n    notes\n    overrideReason\n    ackStatus\n    ackNote\n    ackAt\n    person {\n      name\n      warName\n      rank\n      registration\n      phone\n      section\n      photoUrl\n    }\n  }\n": typeof types.AssignmentFieldsFragmentDoc,
    "\n  fragment RosterFields on Roster {\n    eventId\n    status\n    version\n    publishedAt\n    uncoveredSections\n    assignments {\n      ...AssignmentFields\n    }\n  }\n": typeof types.RosterFieldsFragmentDoc,
    "\n  query EventRoster($eventId: ID!) {\n    eventRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": typeof types.EventRosterDocument,
    "\n  query RosterCandidates($eventId: ID!) {\n    rosterCandidates(eventId: $eventId) {\n      userId\n      name\n      warName\n      photoUrl\n      rank\n      registration\n      phone\n      section\n      memberStatus\n      instruments {\n        instrumentId\n        name\n        primary\n      }\n      functions {\n        functionId\n        name\n      }\n      blocker\n      absence {\n        type\n        startsOn\n        endsOn\n      }\n      busyWith {\n        eventId\n        title\n      }\n    }\n  }\n": typeof types.RosterCandidatesDocument,
    "\n  fragment MyAssignmentFields on MyAssignment {\n    eventId\n    functionId\n    functionName\n    instrumentId\n    instrumentName\n    ackStatus\n    ackNote\n    event {\n      id\n      title\n      type\n      status\n      callTime\n      startsAt\n      endsAt\n      venue {\n        id\n        name\n      }\n    }\n  }\n": typeof types.MyAssignmentFieldsFragmentDoc,
    "\n  query MyAssignments($acknowledged: Boolean) {\n    myAssignments(acknowledged: $acknowledged) {\n      ...MyAssignmentFields\n    }\n  }\n": typeof types.MyAssignmentsDocument,
    "\n  query MyAssignmentsPage($tab: MyAssignmentTab!, $page: PageInput) {\n    myAssignmentsPage(tab: $tab, page: $page) {\n      items {\n        ...MyAssignmentFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n    myAssignmentCounts {\n      acknowledged\n      pending\n      duty\n    }\n  }\n": typeof types.MyAssignmentsPageDocument,
    "\n  query SwapRequests($page: PageInput) {\n    swapRequests(page: $page) {\n      items {\n        ...MyAssignmentFields\n        userId\n        ackAt\n        person {\n          name\n          warName\n          rank\n          section\n          photoUrl\n        }\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": typeof types.SwapRequestsDocument,
    "\n  mutation KeepOnRoster($eventId: ID!, $userId: ID!, $note: String) {\n    keepOnRoster(eventId: $eventId, userId: $userId, note: $note) {\n      userId\n      ackStatus\n    }\n  }\n": typeof types.KeepOnRosterDocument,
    "\n  mutation SaveRoster($eventId: ID!, $input: RosterInput!) {\n    saveRoster(eventId: $eventId, input: $input) {\n      ...RosterFields\n    }\n  }\n": typeof types.SaveRosterDocument,
    "\n  mutation PublishRoster($eventId: ID!) {\n    publishRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": typeof types.PublishRosterDocument,
    "\n  mutation AcknowledgeRoster(\n    $eventId: ID!\n    $answer: AckAnswer!\n    $note: String\n  ) {\n    acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {\n      ackStatus\n      ackNote\n    }\n  }\n": typeof types.AcknowledgeRosterDocument,
    "\n  fragment SupportRequestFields on SupportRequest {\n    id\n    protocol\n    userId\n    userName\n    warName\n    category\n    subject\n    message\n    status\n    reply\n    repliedAt\n    repliedByName\n    finalizedAt\n    finalizedByName\n    createdAt\n  }\n": typeof types.SupportRequestFieldsFragmentDoc,
    "\n  query SupportPage($page: PageInput) {\n    supportQuota {\n      limit\n      sentToday\n      remaining\n      nextAllowedAt\n    }\n    mySupportRequests(page: $page) {\n      items {\n        ...SupportRequestFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": typeof types.SupportPageDocument,
    "\n  query SupportRequests($status: SupportStatus, $page: PageInput) {\n    supportRequests(status: $status, page: $page) {\n      items {\n        ...SupportRequestFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": typeof types.SupportRequestsDocument,
    "\n  mutation SendSupportRequest($input: SupportRequestInput!) {\n    sendSupportRequest(input: $input) {\n      ...SupportRequestFields\n    }\n  }\n": typeof types.SendSupportRequestDocument,
    "\n  mutation ReplySupportRequest($id: ID!, $reply: String!) {\n    replySupportRequest(id: $id, reply: $reply) {\n      ...SupportRequestFields\n    }\n  }\n": typeof types.ReplySupportRequestDocument,
    "\n  mutation FinalizeSupportRequest($id: ID!) {\n    finalizeSupportRequest(id: $id) {\n      ...SupportRequestFields\n    }\n  }\n": typeof types.FinalizeSupportRequestDocument,
};
const documents: Documents = {
    "\n  fragment AbsenceFields on Absence {\n    id\n    userId\n    userName\n    warName\n    photoUrl\n    type\n    startsOn\n    endsOn\n    reason\n    status\n    reviewNote\n    reviewedAt\n    reviewedByName\n    cancelledAt\n    cancelledByName\n    registered\n    createdAt\n    attachments {\n      id\n      fileName\n      mimeType\n      sizeBytes\n    }\n  }\n": types.AbsenceFieldsFragmentDoc,
    "\n  mutation RequestAbsenceAttachmentUploads($files: [AttachmentFileInput!]!) {\n    requestAbsenceAttachmentUploads(files: $files) {\n      storageKey\n      upload {\n        url\n        fields\n      }\n    }\n  }\n": types.RequestAbsenceAttachmentUploadsDocument,
    "\n  query AbsenceAttachmentUrl($id: ID!, $download: Boolean!) {\n    absenceAttachmentUrl(id: $id, download: $download)\n  }\n": types.AbsenceAttachmentUrlDocument,
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
    "\n  query RecordStamp($entity: String!, $id: ID!) {\n    recordStamp(entity: $entity, id: $id) {\n      createdAt\n      createdByName\n      updatedAt\n      updatedByName\n    }\n  }\n": types.RecordStampDocument,
    "\n  fragment ArtistFields on Artist {\n    id\n    name\n    archived\n    createdAt\n  }\n": types.ArtistFieldsFragmentDoc,
    "\n  query Artists($includeArchived: Boolean!) {\n    artists(includeArchived: $includeArchived) {\n      ...ArtistFields\n    }\n  }\n": types.ArtistsDocument,
    "\n  query ArtistsPage($filter: ArtistFilterInput, $page: PageInput) {\n    artistsPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        name\n        archived\n        createdAt\n        songCount\n      }\n    }\n  }\n": types.ArtistsPageDocument,
    "\n  mutation CreateArtist($input: ArtistInput!) {\n    createArtist(input: $input) {\n      ...ArtistFields\n    }\n  }\n": types.CreateArtistDocument,
    "\n  mutation UpdateArtist($id: ID!, $input: ArtistInput!) {\n    updateArtist(id: $id, input: $input) {\n      ...ArtistFields\n    }\n  }\n": types.UpdateArtistDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n        photoUrl\n        onboardingCompleted\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation RefreshSession($refreshToken: String!) {\n    refreshSessionTokens(refreshToken: $refreshToken) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n    }\n  }\n": types.RefreshSessionDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n      photoUrl\n      onboardingCompleted\n    }\n  }\n": types.MeDocument,
    "\n  mutation CompleteOnboarding {\n    completeOnboarding\n  }\n": types.CompleteOnboardingDocument,
    "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n": types.ChangeMyPasswordDocument,
    "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n      photoUrl\n      onboardingCompleted\n    }\n  }\n": types.UpdateMyProfileDocument,
    "\n  mutation SetMyPhoto($photo: String!) {\n    setMyPhoto(photo: $photo)\n  }\n": types.SetMyPhotoDocument,
    "\n  mutation RemoveMyPhoto {\n    removeMyPhoto\n  }\n": types.RemoveMyPhotoDocument,
    "\n  mutation RequestPasswordRecovery($login: String!) {\n    requestPasswordRecovery(login: $login)\n  }\n": types.RequestPasswordRecoveryDocument,
    "\n  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {\n    verifyPasswordRecoveryCode(input: $input)\n  }\n": types.VerifyPasswordRecoveryCodeDocument,
    "\n  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {\n    resetPasswordWithRecovery(input: $input)\n  }\n": types.ResetPasswordWithRecoveryDocument,
    "\n  query BandFunctions($includeArchived: Boolean!) {\n    bandFunctions(includeArchived: $includeArchived) {\n      id\n      name\n      archived\n    }\n  }\n": types.BandFunctionsDocument,
    "\n  query BandFunctionsPage($filter: BandFunctionFilterInput, $page: PageInput) {\n    bandFunctionsPage(filter: $filter, page: $page) {\n      items {\n        id\n        name\n        archived\n        memberCount\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": types.BandFunctionsPageDocument,
    "\n  mutation CreateBandFunction($input: CreateBandFunctionInput!) {\n    createBandFunction(input: $input) {\n      id\n      name\n      archived\n    }\n  }\n": types.CreateBandFunctionDocument,
    "\n  mutation UpdateBandFunction($id: ID!, $input: UpdateBandFunctionInput!) {\n    updateBandFunction(id: $id, input: $input) {\n      id\n      name\n      archived\n    }\n  }\n": types.UpdateBandFunctionDocument,
    "\n  fragment BroadcastFields on Broadcast {\n    id\n    title\n    body\n    audience\n    section\n    eventId\n    sendEmail\n    recipients\n    authorName\n    createdAt\n  }\n": types.BroadcastFieldsFragmentDoc,
    "\n  query Broadcasts {\n    broadcasts {\n      ...BroadcastFields\n    }\n  }\n": types.BroadcastsDocument,
    "\n  mutation SendBroadcast($input: BroadcastInput!) {\n    sendBroadcast(input: $input) {\n      ...BroadcastFields\n    }\n  }\n": types.SendBroadcastDocument,
    "\n  query BandDashboard {\n    bandDashboard {\n      activeMembers\n      awayMembers\n      upcomingEvents\n      eventsWithoutRoster\n      pendingAcks\n      swapRequests\n      pendingAbsences\n      absentToday\n      failedNotifications\n    }\n  }\n": types.BandDashboardDocument,
    "\n  fragment DutyScheduleFields on DutySchedule {\n    id\n    title\n    startsOn\n    endsOn\n    venueId\n    uniform\n    notes\n    audienceKind\n    sections\n    status\n    cancellationReason\n    dayCount\n    memberCount\n    createdAt\n  }\n": types.DutyScheduleFieldsFragmentDoc,
    "\n  query DutySchedulesPage($filter: DutyScheduleFilterInput, $page: PageInput) {\n    dutySchedulesPage(filter: $filter, page: $page) {\n      items {\n        ...DutyScheduleFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": types.DutySchedulesPageDocument,
    "\n  query DutySchedule($id: ID!) {\n    dutySchedule(id: $id) {\n      id\n      title\n      startsOn\n      endsOn\n      venueId\n      uniform\n      notes\n      audienceKind\n      sections\n      status\n      cancellationReason\n      dayCount\n      memberCount\n      createdAt\n      venue {\n        id\n        name\n        fullAddress\n      }\n      days {\n        id\n        status\n        startsAt\n        endsAt\n      }\n      members {\n        userId\n        name\n        profile {\n          warName\n          rank\n          section\n        }\n      }\n    }\n  }\n": types.DutyScheduleDocument,
    "\n  mutation CreateDutySchedule($input: DutyScheduleInput!) {\n    createDutySchedule(input: $input) {\n      ...DutyScheduleFields\n    }\n  }\n": types.CreateDutyScheduleDocument,
    "\n  mutation CancelDutySchedule($id: ID!, $input: CancelDutyScheduleInput!) {\n    cancelDutySchedule(id: $id, input: $input) {\n      ...DutyScheduleFields\n    }\n  }\n": types.CancelDutyScheduleDocument,
    "\n  mutation VerifyEnrollmentCode($code: String!) {\n    verifyEnrollmentCode(code: $code)\n  }\n": types.VerifyEnrollmentCodeDocument,
    "\n  query EnrollmentInstruments($formToken: String!) {\n    enrollmentInstruments(formToken: $formToken) {\n      id\n      name\n    }\n  }\n": types.EnrollmentInstrumentsDocument,
    "\n  mutation SubmitEnrollment($input: SubmitEnrollmentInput!) {\n    submitEnrollment(input: $input)\n  }\n": types.SubmitEnrollmentDocument,
    "\n  fragment EnrollmentInviteFields on EnrollmentInvite {\n    id\n    code\n    label\n    expiresAt\n    revokedAt\n    createdAt\n    requestCount\n  }\n": types.EnrollmentInviteFieldsFragmentDoc,
    "\n  fragment EnrollmentRequestFields on EnrollmentRequest {\n    id\n    status\n    fullName\n    email\n    phone\n    military\n    militaryId\n    rank\n    warName\n    instruments {\n      instrumentId\n      primary\n    }\n    createdAt\n    reviewedAt\n    rejectionReason\n    userId\n    photoUrl\n  }\n": types.EnrollmentRequestFieldsFragmentDoc,
    "\n  query EnrollmentInvites {\n    enrollmentInvites {\n      ...EnrollmentInviteFields\n    }\n  }\n": types.EnrollmentInvitesDocument,
    "\n  mutation CreateEnrollmentInvite($input: CreateEnrollmentInviteInput!) {\n    createEnrollmentInvite(input: $input) {\n      ...EnrollmentInviteFields\n    }\n  }\n": types.CreateEnrollmentInviteDocument,
    "\n  mutation RevokeEnrollmentInvite($id: ID!) {\n    revokeEnrollmentInvite(id: $id) {\n      ...EnrollmentInviteFields\n    }\n  }\n": types.RevokeEnrollmentInviteDocument,
    "\n  query EnrollmentRequests(\n    $filter: EnrollmentRequestFilterInput\n    $page: PageInput\n  ) {\n    enrollmentRequests(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...EnrollmentRequestFields\n      }\n    }\n    pendingEnrollmentCount\n  }\n": types.EnrollmentRequestsDocument,
    "\n  mutation ApproveEnrollmentRequest(\n    $id: ID!\n    $data: EnrollmentDataInput!\n    $group: UserGroup!\n  ) {\n    approveEnrollmentRequest(id: $id, data: $data, group: $group) {\n      request {\n        ...EnrollmentRequestFields\n      }\n      access {\n        temporaryPassword\n        emailSent\n        user {\n          ...UserAccountFields\n        }\n      }\n    }\n  }\n": types.ApproveEnrollmentRequestDocument,
    "\n  mutation RejectEnrollmentRequest($id: ID!, $reason: String!) {\n    rejectEnrollmentRequest(id: $id, reason: $reason) {\n      ...EnrollmentRequestFields\n    }\n  }\n": types.RejectEnrollmentRequestDocument,
    "\n  fragment EventFields on Event {\n    id\n    title\n    type\n    status\n    callTime\n    startsAt\n    endsAt\n    venueId\n    uniform\n    requester\n    documentRef\n    notes\n    cancellationReason\n    venue {\n      ...VenueFields\n    }\n  }\n": types.EventFieldsFragmentDoc,
    "\n  fragment VenueFields on Venue {\n    id\n    name\n    zipCode\n    street\n    number\n    complement\n    district\n    city\n    state\n    fullAddress\n    mapsUrl\n    notes\n    archived\n  }\n": types.VenueFieldsFragmentDoc,
    "\n  query EventsPage($filter: EventPageFilterInput, $page: PageInput) {\n    eventsPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...EventFields\n        setlistCount\n        rosterSummary {\n          status\n          assignments\n        }\n      }\n    }\n  }\n": types.EventsPageDocument,
    "\n  query VenuesPage($filter: VenueFilterInput, $page: PageInput) {\n    venuesPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...VenueFields\n      }\n    }\n  }\n": types.VenuesPageDocument,
    "\n  query ZipCodeAddress($zipCode: String!) {\n    zipCodeAddress(zipCode: $zipCode) {\n      zipCode\n      street\n      district\n      city\n      state\n    }\n  }\n": types.ZipCodeAddressDocument,
    "\n  query Events($filter: EventFilterInput) {\n    events(filter: $filter) {\n      ...EventFields\n      myAssignment {\n        functionName\n        instrumentName\n      }\n    }\n  }\n": types.EventsDocument,
    "\n  query UpcomingEvents($limit: Int!) {\n    upcomingEvents(limit: $limit) {\n      ...EventFields\n    }\n  }\n": types.UpcomingEventsDocument,
    "\n  query Event($id: ID!) {\n    event(id: $id) {\n      ...EventFields\n      setlist {\n        position\n        songId\n        notes\n        song {\n          id\n          title\n          musicalKey\n          durationSeconds\n          lyrics\n          archivedAt\n          media {\n            id\n            kind\n            title\n          }\n        }\n      }\n    }\n  }\n": types.EventDocument,
    "\n  mutation CreateEvent($input: EventInput!) {\n    createEvent(input: $input) {\n      ...EventFields\n    }\n  }\n": types.CreateEventDocument,
    "\n  mutation UpdateEvent($id: ID!, $input: EventInput!) {\n    updateEvent(id: $id, input: $input) {\n      ...EventFields\n    }\n  }\n": types.UpdateEventDocument,
    "\n  mutation ChangeEventStatus($id: ID!, $status: EventStatus!, $reason: String) {\n    changeEventStatus(id: $id, status: $status, reason: $reason) {\n      ...EventFields\n    }\n  }\n": types.ChangeEventStatusDocument,
    "\n  mutation SetEventSetlist($id: ID!, $input: SetlistInput!) {\n    setEventSetlist(id: $id, input: $input) {\n      position\n      songId\n    }\n  }\n": types.SetEventSetlistDocument,
    "\n  query Venues($includeArchived: Boolean!) {\n    venues(includeArchived: $includeArchived) {\n      ...VenueFields\n    }\n  }\n": types.VenuesDocument,
    "\n  mutation CreateVenue($input: VenueInput!) {\n    createVenue(input: $input) {\n      ...VenueFields\n    }\n  }\n": types.CreateVenueDocument,
    "\n  mutation UpdateVenue($id: ID!, $input: VenueInput!) {\n    updateVenue(id: $id, input: $input) {\n      ...VenueFields\n    }\n  }\n": types.UpdateVenueDocument,
    "\n  fragment MemberProfileFields on MemberProfile {\n    userId\n    warName\n    rank\n    registration\n    phone\n    section\n    status\n    notes\n    updatedAt\n    instruments {\n      instrumentId\n      name\n      primary\n    }\n    functions {\n      functionId\n      name\n    }\n  }\n": types.MemberProfileFieldsFragmentDoc,
    "\n  query Roster($filter: RosterFilterInput, $page: PageInput) {\n    roster(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        userId\n        name\n        username\n        active\n        photoUrl\n        profile {\n          ...MemberProfileFields\n        }\n      }\n    }\n  }\n": types.RosterDocument,
    "\n  query MemberProfile($userId: ID!) {\n    memberProfile(userId: $userId) {\n      ...MemberProfileFields\n    }\n  }\n": types.MemberProfileDocument,
    "\n  query MyMemberProfile {\n    myMemberProfile {\n      ...MemberProfileFields\n    }\n  }\n": types.MyMemberProfileDocument,
    "\n  mutation SaveMemberProfile($userId: ID!, $input: MemberProfileInput!) {\n    saveMemberProfile(userId: $userId, input: $input) {\n      ...MemberProfileFields\n    }\n  }\n": types.SaveMemberProfileDocument,
    "\n  query Instruments($includeArchived: Boolean!) {\n    instruments(includeArchived: $includeArchived) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": types.InstrumentsDocument,
    "\n  query InstrumentsPage($filter: InstrumentFilterInput, $page: PageInput) {\n    instrumentsPage(filter: $filter, page: $page) {\n      items {\n        id\n        name\n        section\n        archived\n        memberCount\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": types.InstrumentsPageDocument,
    "\n  mutation CreateInstrument($input: CreateInstrumentInput!) {\n    createInstrument(input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": types.CreateInstrumentDocument,
    "\n  mutation UpdateInstrument($id: ID!, $input: UpdateInstrumentInput!) {\n    updateInstrument(id: $id, input: $input) {\n      id\n      name\n      section\n      archived\n    }\n  }\n": types.UpdateInstrumentDocument,
    "\n  query MyNotifications($unreadOnly: Boolean!, $page: PageInput) {\n    myNotifications(unreadOnly: $unreadOnly, page: $page) {\n      items {\n        id\n        type\n        title\n        body\n        link\n        readAt\n        createdAt\n      }\n      total\n      page\n      totalPages\n    }\n  }\n": types.MyNotificationsDocument,
    "\n  query UnreadNotificationsCount {\n    unreadNotificationsCount\n  }\n": types.UnreadNotificationsCountDocument,
    "\n  mutation MarkNotificationRead($id: ID!) {\n    markNotificationRead(id: $id)\n  }\n": types.MarkNotificationReadDocument,
    "\n  mutation MarkAllNotificationsRead {\n    markAllNotificationsRead\n  }\n": types.MarkAllNotificationsReadDocument,
    "\n  query NotificationPreferences {\n    myNotificationPreferences {\n      type\n      emailEnabled\n    }\n  }\n": types.NotificationPreferencesDocument,
    "\n  mutation SetNotificationPreference(\n    $type: NotificationType!\n    $emailEnabled: Boolean!\n  ) {\n    setNotificationPreference(type: $type, emailEnabled: $emailEnabled) {\n      type\n      emailEnabled\n    }\n  }\n": types.SetNotificationPreferenceDocument,
    "\n  query PushPublicKey {\n    pushPublicKey\n  }\n": types.PushPublicKeyDocument,
    "\n  mutation SubscribePush($input: PushSubscriptionInput!) {\n    subscribePush(input: $input)\n  }\n": types.SubscribePushDocument,
    "\n  mutation UnsubscribePush($endpoint: String!) {\n    unsubscribePush(endpoint: $endpoint)\n  }\n": types.UnsubscribePushDocument,
    "\n  mutation SendTestPush {\n    sendTestPush\n  }\n": types.SendTestPushDocument,
    "\n  fragment SongFields on Song {\n    id\n    title\n    artistId\n    artist {\n      id\n      name\n    }\n    stage\n    arranger\n    category\n    musicalKey\n    bpm\n    durationSeconds\n    lyrics\n    notes\n    tags\n    archivedAt\n    createdAt\n    updatedAt\n  }\n": types.SongFieldsFragmentDoc,
    "\n  fragment MediaAssetFields on MediaAsset {\n    id\n    songId\n    kind\n    status\n    title\n    mimeType\n    sizeBytes\n    durationSeconds\n    youtubeVideoId\n    thumbnailUrl\n    createdAt\n  }\n": types.MediaAssetFieldsFragmentDoc,
    "\n  query Songs($filter: SongFilterInput, $page: PageInput, $archived: Boolean!) {\n    songs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...SongFields\n        media {\n          id\n          kind\n          title\n          youtubeVideoId\n        }\n      }\n    }\n    songTags\n    songTitles(archived: $archived)\n    artists(includeArchived: false) {\n      id\n      name\n      archived\n    }\n  }\n": types.SongsDocument,
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
    "\n  query FindLyrics($artist: String!, $title: String!) {\n    findLyrics(artist: $artist, title: $title) {\n      artist\n      title\n      lyrics\n      sourceUrl\n    }\n  }\n": types.FindLyricsDocument,
    "\n  query SearchYoutube($query: String!) {\n    searchYoutube(query: $query) {\n      videoId\n      title\n      channelTitle\n      thumbnailUrl\n      publishedAt\n      durationSeconds\n    }\n  }\n": types.SearchYoutubeDocument,
    "\n  fragment AssignmentFields on Assignment {\n    userId\n    functionId\n    functionName\n    instrumentId\n    instrumentName\n    notes\n    overrideReason\n    ackStatus\n    ackNote\n    ackAt\n    person {\n      name\n      warName\n      rank\n      registration\n      phone\n      section\n      photoUrl\n    }\n  }\n": types.AssignmentFieldsFragmentDoc,
    "\n  fragment RosterFields on Roster {\n    eventId\n    status\n    version\n    publishedAt\n    uncoveredSections\n    assignments {\n      ...AssignmentFields\n    }\n  }\n": types.RosterFieldsFragmentDoc,
    "\n  query EventRoster($eventId: ID!) {\n    eventRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": types.EventRosterDocument,
    "\n  query RosterCandidates($eventId: ID!) {\n    rosterCandidates(eventId: $eventId) {\n      userId\n      name\n      warName\n      photoUrl\n      rank\n      registration\n      phone\n      section\n      memberStatus\n      instruments {\n        instrumentId\n        name\n        primary\n      }\n      functions {\n        functionId\n        name\n      }\n      blocker\n      absence {\n        type\n        startsOn\n        endsOn\n      }\n      busyWith {\n        eventId\n        title\n      }\n    }\n  }\n": types.RosterCandidatesDocument,
    "\n  fragment MyAssignmentFields on MyAssignment {\n    eventId\n    functionId\n    functionName\n    instrumentId\n    instrumentName\n    ackStatus\n    ackNote\n    event {\n      id\n      title\n      type\n      status\n      callTime\n      startsAt\n      endsAt\n      venue {\n        id\n        name\n      }\n    }\n  }\n": types.MyAssignmentFieldsFragmentDoc,
    "\n  query MyAssignments($acknowledged: Boolean) {\n    myAssignments(acknowledged: $acknowledged) {\n      ...MyAssignmentFields\n    }\n  }\n": types.MyAssignmentsDocument,
    "\n  query MyAssignmentsPage($tab: MyAssignmentTab!, $page: PageInput) {\n    myAssignmentsPage(tab: $tab, page: $page) {\n      items {\n        ...MyAssignmentFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n    myAssignmentCounts {\n      acknowledged\n      pending\n      duty\n    }\n  }\n": types.MyAssignmentsPageDocument,
    "\n  query SwapRequests($page: PageInput) {\n    swapRequests(page: $page) {\n      items {\n        ...MyAssignmentFields\n        userId\n        ackAt\n        person {\n          name\n          warName\n          rank\n          section\n          photoUrl\n        }\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": types.SwapRequestsDocument,
    "\n  mutation KeepOnRoster($eventId: ID!, $userId: ID!, $note: String) {\n    keepOnRoster(eventId: $eventId, userId: $userId, note: $note) {\n      userId\n      ackStatus\n    }\n  }\n": types.KeepOnRosterDocument,
    "\n  mutation SaveRoster($eventId: ID!, $input: RosterInput!) {\n    saveRoster(eventId: $eventId, input: $input) {\n      ...RosterFields\n    }\n  }\n": types.SaveRosterDocument,
    "\n  mutation PublishRoster($eventId: ID!) {\n    publishRoster(eventId: $eventId) {\n      ...RosterFields\n    }\n  }\n": types.PublishRosterDocument,
    "\n  mutation AcknowledgeRoster(\n    $eventId: ID!\n    $answer: AckAnswer!\n    $note: String\n  ) {\n    acknowledgeRoster(eventId: $eventId, answer: $answer, note: $note) {\n      ackStatus\n      ackNote\n    }\n  }\n": types.AcknowledgeRosterDocument,
    "\n  fragment SupportRequestFields on SupportRequest {\n    id\n    protocol\n    userId\n    userName\n    warName\n    category\n    subject\n    message\n    status\n    reply\n    repliedAt\n    repliedByName\n    finalizedAt\n    finalizedByName\n    createdAt\n  }\n": types.SupportRequestFieldsFragmentDoc,
    "\n  query SupportPage($page: PageInput) {\n    supportQuota {\n      limit\n      sentToday\n      remaining\n      nextAllowedAt\n    }\n    mySupportRequests(page: $page) {\n      items {\n        ...SupportRequestFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": types.SupportPageDocument,
    "\n  query SupportRequests($status: SupportStatus, $page: PageInput) {\n    supportRequests(status: $status, page: $page) {\n      items {\n        ...SupportRequestFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n": types.SupportRequestsDocument,
    "\n  mutation SendSupportRequest($input: SupportRequestInput!) {\n    sendSupportRequest(input: $input) {\n      ...SupportRequestFields\n    }\n  }\n": types.SendSupportRequestDocument,
    "\n  mutation ReplySupportRequest($id: ID!, $reply: String!) {\n    replySupportRequest(id: $id, reply: $reply) {\n      ...SupportRequestFields\n    }\n  }\n": types.ReplySupportRequestDocument,
    "\n  mutation FinalizeSupportRequest($id: ID!) {\n    finalizeSupportRequest(id: $id) {\n      ...SupportRequestFields\n    }\n  }\n": types.FinalizeSupportRequestDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AbsenceFields on Absence {\n    id\n    userId\n    userName\n    warName\n    photoUrl\n    type\n    startsOn\n    endsOn\n    reason\n    status\n    reviewNote\n    reviewedAt\n    reviewedByName\n    cancelledAt\n    cancelledByName\n    registered\n    createdAt\n    attachments {\n      id\n      fileName\n      mimeType\n      sizeBytes\n    }\n  }\n"): typeof import('./graphql').AbsenceFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestAbsenceAttachmentUploads($files: [AttachmentFileInput!]!) {\n    requestAbsenceAttachmentUploads(files: $files) {\n      storageKey\n      upload {\n        url\n        fields\n      }\n    }\n  }\n"): typeof import('./graphql').RequestAbsenceAttachmentUploadsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AbsenceAttachmentUrl($id: ID!, $download: Boolean!) {\n    absenceAttachmentUrl(id: $id, download: $download)\n  }\n"): typeof import('./graphql').AbsenceAttachmentUrlDocument;
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
export function graphql(source: "\n  query RecordStamp($entity: String!, $id: ID!) {\n    recordStamp(entity: $entity, id: $id) {\n      createdAt\n      createdByName\n      updatedAt\n      updatedByName\n    }\n  }\n"): typeof import('./graphql').RecordStampDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ArtistFields on Artist {\n    id\n    name\n    archived\n    createdAt\n  }\n"): typeof import('./graphql').ArtistFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Artists($includeArchived: Boolean!) {\n    artists(includeArchived: $includeArchived) {\n      ...ArtistFields\n    }\n  }\n"): typeof import('./graphql').ArtistsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ArtistsPage($filter: ArtistFilterInput, $page: PageInput) {\n    artistsPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        id\n        name\n        archived\n        createdAt\n        songCount\n      }\n    }\n  }\n"): typeof import('./graphql').ArtistsPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateArtist($input: ArtistInput!) {\n    createArtist(input: $input) {\n      ...ArtistFields\n    }\n  }\n"): typeof import('./graphql').CreateArtistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateArtist($id: ID!, $input: ArtistInput!) {\n    updateArtist(id: $id, input: $input) {\n      ...ArtistFields\n    }\n  }\n"): typeof import('./graphql').UpdateArtistDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      accessTokenExpiresAt\n      refreshToken\n      refreshTokenExpiresAt\n      user {\n        id\n        name\n        username\n        email\n        group\n        mustChangePassword\n        permissions\n        photoUrl\n        onboardingCompleted\n      }\n    }\n  }\n"): typeof import('./graphql').LoginDocument;
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
export function graphql(source: "\n  query Me {\n    me {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n      photoUrl\n      onboardingCompleted\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteOnboarding {\n    completeOnboarding\n  }\n"): typeof import('./graphql').CompleteOnboardingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ChangeMyPassword($input: ChangePasswordInput!) {\n    changeMyPassword(input: $input)\n  }\n"): typeof import('./graphql').ChangeMyPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {\n    updateMyProfile(input: $input) {\n      id\n      name\n      username\n      email\n      group\n      mustChangePassword\n      permissions\n      photoUrl\n      onboardingCompleted\n    }\n  }\n"): typeof import('./graphql').UpdateMyProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetMyPhoto($photo: String!) {\n    setMyPhoto(photo: $photo)\n  }\n"): typeof import('./graphql').SetMyPhotoDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveMyPhoto {\n    removeMyPhoto\n  }\n"): typeof import('./graphql').RemoveMyPhotoDocument;
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
export function graphql(source: "\n  query BandFunctions($includeArchived: Boolean!) {\n    bandFunctions(includeArchived: $includeArchived) {\n      id\n      name\n      archived\n    }\n  }\n"): typeof import('./graphql').BandFunctionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BandFunctionsPage($filter: BandFunctionFilterInput, $page: PageInput) {\n    bandFunctionsPage(filter: $filter, page: $page) {\n      items {\n        id\n        name\n        archived\n        memberCount\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n"): typeof import('./graphql').BandFunctionsPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBandFunction($input: CreateBandFunctionInput!) {\n    createBandFunction(input: $input) {\n      id\n      name\n      archived\n    }\n  }\n"): typeof import('./graphql').CreateBandFunctionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateBandFunction($id: ID!, $input: UpdateBandFunctionInput!) {\n    updateBandFunction(id: $id, input: $input) {\n      id\n      name\n      archived\n    }\n  }\n"): typeof import('./graphql').UpdateBandFunctionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BroadcastFields on Broadcast {\n    id\n    title\n    body\n    audience\n    section\n    eventId\n    sendEmail\n    recipients\n    authorName\n    createdAt\n  }\n"): typeof import('./graphql').BroadcastFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Broadcasts {\n    broadcasts {\n      ...BroadcastFields\n    }\n  }\n"): typeof import('./graphql').BroadcastsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendBroadcast($input: BroadcastInput!) {\n    sendBroadcast(input: $input) {\n      ...BroadcastFields\n    }\n  }\n"): typeof import('./graphql').SendBroadcastDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BandDashboard {\n    bandDashboard {\n      activeMembers\n      awayMembers\n      upcomingEvents\n      eventsWithoutRoster\n      pendingAcks\n      swapRequests\n      pendingAbsences\n      absentToday\n      failedNotifications\n    }\n  }\n"): typeof import('./graphql').BandDashboardDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DutyScheduleFields on DutySchedule {\n    id\n    title\n    startsOn\n    endsOn\n    venueId\n    uniform\n    notes\n    audienceKind\n    sections\n    status\n    cancellationReason\n    dayCount\n    memberCount\n    createdAt\n  }\n"): typeof import('./graphql').DutyScheduleFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DutySchedulesPage($filter: DutyScheduleFilterInput, $page: PageInput) {\n    dutySchedulesPage(filter: $filter, page: $page) {\n      items {\n        ...DutyScheduleFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n"): typeof import('./graphql').DutySchedulesPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DutySchedule($id: ID!) {\n    dutySchedule(id: $id) {\n      id\n      title\n      startsOn\n      endsOn\n      venueId\n      uniform\n      notes\n      audienceKind\n      sections\n      status\n      cancellationReason\n      dayCount\n      memberCount\n      createdAt\n      venue {\n        id\n        name\n        fullAddress\n      }\n      days {\n        id\n        status\n        startsAt\n        endsAt\n      }\n      members {\n        userId\n        name\n        profile {\n          warName\n          rank\n          section\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').DutyScheduleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDutySchedule($input: DutyScheduleInput!) {\n    createDutySchedule(input: $input) {\n      ...DutyScheduleFields\n    }\n  }\n"): typeof import('./graphql').CreateDutyScheduleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelDutySchedule($id: ID!, $input: CancelDutyScheduleInput!) {\n    cancelDutySchedule(id: $id, input: $input) {\n      ...DutyScheduleFields\n    }\n  }\n"): typeof import('./graphql').CancelDutyScheduleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VerifyEnrollmentCode($code: String!) {\n    verifyEnrollmentCode(code: $code)\n  }\n"): typeof import('./graphql').VerifyEnrollmentCodeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EnrollmentInstruments($formToken: String!) {\n    enrollmentInstruments(formToken: $formToken) {\n      id\n      name\n    }\n  }\n"): typeof import('./graphql').EnrollmentInstrumentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SubmitEnrollment($input: SubmitEnrollmentInput!) {\n    submitEnrollment(input: $input)\n  }\n"): typeof import('./graphql').SubmitEnrollmentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EnrollmentInviteFields on EnrollmentInvite {\n    id\n    code\n    label\n    expiresAt\n    revokedAt\n    createdAt\n    requestCount\n  }\n"): typeof import('./graphql').EnrollmentInviteFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EnrollmentRequestFields on EnrollmentRequest {\n    id\n    status\n    fullName\n    email\n    phone\n    military\n    militaryId\n    rank\n    warName\n    instruments {\n      instrumentId\n      primary\n    }\n    createdAt\n    reviewedAt\n    rejectionReason\n    userId\n    photoUrl\n  }\n"): typeof import('./graphql').EnrollmentRequestFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EnrollmentInvites {\n    enrollmentInvites {\n      ...EnrollmentInviteFields\n    }\n  }\n"): typeof import('./graphql').EnrollmentInvitesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEnrollmentInvite($input: CreateEnrollmentInviteInput!) {\n    createEnrollmentInvite(input: $input) {\n      ...EnrollmentInviteFields\n    }\n  }\n"): typeof import('./graphql').CreateEnrollmentInviteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeEnrollmentInvite($id: ID!) {\n    revokeEnrollmentInvite(id: $id) {\n      ...EnrollmentInviteFields\n    }\n  }\n"): typeof import('./graphql').RevokeEnrollmentInviteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EnrollmentRequests(\n    $filter: EnrollmentRequestFilterInput\n    $page: PageInput\n  ) {\n    enrollmentRequests(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...EnrollmentRequestFields\n      }\n    }\n    pendingEnrollmentCount\n  }\n"): typeof import('./graphql').EnrollmentRequestsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ApproveEnrollmentRequest(\n    $id: ID!\n    $data: EnrollmentDataInput!\n    $group: UserGroup!\n  ) {\n    approveEnrollmentRequest(id: $id, data: $data, group: $group) {\n      request {\n        ...EnrollmentRequestFields\n      }\n      access {\n        temporaryPassword\n        emailSent\n        user {\n          ...UserAccountFields\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ApproveEnrollmentRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RejectEnrollmentRequest($id: ID!, $reason: String!) {\n    rejectEnrollmentRequest(id: $id, reason: $reason) {\n      ...EnrollmentRequestFields\n    }\n  }\n"): typeof import('./graphql').RejectEnrollmentRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventFields on Event {\n    id\n    title\n    type\n    status\n    callTime\n    startsAt\n    endsAt\n    venueId\n    uniform\n    requester\n    documentRef\n    notes\n    cancellationReason\n    venue {\n      ...VenueFields\n    }\n  }\n"): typeof import('./graphql').EventFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VenueFields on Venue {\n    id\n    name\n    zipCode\n    street\n    number\n    complement\n    district\n    city\n    state\n    fullAddress\n    mapsUrl\n    notes\n    archived\n  }\n"): typeof import('./graphql').VenueFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EventsPage($filter: EventPageFilterInput, $page: PageInput) {\n    eventsPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...EventFields\n        setlistCount\n        rosterSummary {\n          status\n          assignments\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').EventsPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VenuesPage($filter: VenueFilterInput, $page: PageInput) {\n    venuesPage(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...VenueFields\n      }\n    }\n  }\n"): typeof import('./graphql').VenuesPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ZipCodeAddress($zipCode: String!) {\n    zipCodeAddress(zipCode: $zipCode) {\n      zipCode\n      street\n      district\n      city\n      state\n    }\n  }\n"): typeof import('./graphql').ZipCodeAddressDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Events($filter: EventFilterInput) {\n    events(filter: $filter) {\n      ...EventFields\n      myAssignment {\n        functionName\n        instrumentName\n      }\n    }\n  }\n"): typeof import('./graphql').EventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UpcomingEvents($limit: Int!) {\n    upcomingEvents(limit: $limit) {\n      ...EventFields\n    }\n  }\n"): typeof import('./graphql').UpcomingEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Event($id: ID!) {\n    event(id: $id) {\n      ...EventFields\n      setlist {\n        position\n        songId\n        notes\n        song {\n          id\n          title\n          musicalKey\n          durationSeconds\n          lyrics\n          archivedAt\n          media {\n            id\n            kind\n            title\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').EventDocument;
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
export function graphql(source: "\n  fragment MemberProfileFields on MemberProfile {\n    userId\n    warName\n    rank\n    registration\n    phone\n    section\n    status\n    notes\n    updatedAt\n    instruments {\n      instrumentId\n      name\n      primary\n    }\n    functions {\n      functionId\n      name\n    }\n  }\n"): typeof import('./graphql').MemberProfileFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Roster($filter: RosterFilterInput, $page: PageInput) {\n    roster(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        userId\n        name\n        username\n        active\n        photoUrl\n        profile {\n          ...MemberProfileFields\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').RosterDocument;
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
export function graphql(source: "\n  query InstrumentsPage($filter: InstrumentFilterInput, $page: PageInput) {\n    instrumentsPage(filter: $filter, page: $page) {\n      items {\n        id\n        name\n        section\n        archived\n        memberCount\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n"): typeof import('./graphql').InstrumentsPageDocument;
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
export function graphql(source: "\n  query PushPublicKey {\n    pushPublicKey\n  }\n"): typeof import('./graphql').PushPublicKeyDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SubscribePush($input: PushSubscriptionInput!) {\n    subscribePush(input: $input)\n  }\n"): typeof import('./graphql').SubscribePushDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnsubscribePush($endpoint: String!) {\n    unsubscribePush(endpoint: $endpoint)\n  }\n"): typeof import('./graphql').UnsubscribePushDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendTestPush {\n    sendTestPush\n  }\n"): typeof import('./graphql').SendTestPushDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SongFields on Song {\n    id\n    title\n    artistId\n    artist {\n      id\n      name\n    }\n    stage\n    arranger\n    category\n    musicalKey\n    bpm\n    durationSeconds\n    lyrics\n    notes\n    tags\n    archivedAt\n    createdAt\n    updatedAt\n  }\n"): typeof import('./graphql').SongFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaAssetFields on MediaAsset {\n    id\n    songId\n    kind\n    status\n    title\n    mimeType\n    sizeBytes\n    durationSeconds\n    youtubeVideoId\n    thumbnailUrl\n    createdAt\n  }\n"): typeof import('./graphql').MediaAssetFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Songs($filter: SongFilterInput, $page: PageInput, $archived: Boolean!) {\n    songs(filter: $filter, page: $page) {\n      total\n      page\n      limit\n      totalPages\n      items {\n        ...SongFields\n        media {\n          id\n          kind\n          title\n          youtubeVideoId\n        }\n      }\n    }\n    songTags\n    songTitles(archived: $archived)\n    artists(includeArchived: false) {\n      id\n      name\n      archived\n    }\n  }\n"): typeof import('./graphql').SongsDocument;
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
export function graphql(source: "\n  query FindLyrics($artist: String!, $title: String!) {\n    findLyrics(artist: $artist, title: $title) {\n      artist\n      title\n      lyrics\n      sourceUrl\n    }\n  }\n"): typeof import('./graphql').FindLyricsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchYoutube($query: String!) {\n    searchYoutube(query: $query) {\n      videoId\n      title\n      channelTitle\n      thumbnailUrl\n      publishedAt\n      durationSeconds\n    }\n  }\n"): typeof import('./graphql').SearchYoutubeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AssignmentFields on Assignment {\n    userId\n    functionId\n    functionName\n    instrumentId\n    instrumentName\n    notes\n    overrideReason\n    ackStatus\n    ackNote\n    ackAt\n    person {\n      name\n      warName\n      rank\n      registration\n      phone\n      section\n      photoUrl\n    }\n  }\n"): typeof import('./graphql').AssignmentFieldsFragmentDoc;
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
export function graphql(source: "\n  query RosterCandidates($eventId: ID!) {\n    rosterCandidates(eventId: $eventId) {\n      userId\n      name\n      warName\n      photoUrl\n      rank\n      registration\n      phone\n      section\n      memberStatus\n      instruments {\n        instrumentId\n        name\n        primary\n      }\n      functions {\n        functionId\n        name\n      }\n      blocker\n      absence {\n        type\n        startsOn\n        endsOn\n      }\n      busyWith {\n        eventId\n        title\n      }\n    }\n  }\n"): typeof import('./graphql').RosterCandidatesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MyAssignmentFields on MyAssignment {\n    eventId\n    functionId\n    functionName\n    instrumentId\n    instrumentName\n    ackStatus\n    ackNote\n    event {\n      id\n      title\n      type\n      status\n      callTime\n      startsAt\n      endsAt\n      venue {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').MyAssignmentFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyAssignments($acknowledged: Boolean) {\n    myAssignments(acknowledged: $acknowledged) {\n      ...MyAssignmentFields\n    }\n  }\n"): typeof import('./graphql').MyAssignmentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyAssignmentsPage($tab: MyAssignmentTab!, $page: PageInput) {\n    myAssignmentsPage(tab: $tab, page: $page) {\n      items {\n        ...MyAssignmentFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n    myAssignmentCounts {\n      acknowledged\n      pending\n      duty\n    }\n  }\n"): typeof import('./graphql').MyAssignmentsPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SwapRequests($page: PageInput) {\n    swapRequests(page: $page) {\n      items {\n        ...MyAssignmentFields\n        userId\n        ackAt\n        person {\n          name\n          warName\n          rank\n          section\n          photoUrl\n        }\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n"): typeof import('./graphql').SwapRequestsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation KeepOnRoster($eventId: ID!, $userId: ID!, $note: String) {\n    keepOnRoster(eventId: $eventId, userId: $userId, note: $note) {\n      userId\n      ackStatus\n    }\n  }\n"): typeof import('./graphql').KeepOnRosterDocument;
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SupportRequestFields on SupportRequest {\n    id\n    protocol\n    userId\n    userName\n    warName\n    category\n    subject\n    message\n    status\n    reply\n    repliedAt\n    repliedByName\n    finalizedAt\n    finalizedByName\n    createdAt\n  }\n"): typeof import('./graphql').SupportRequestFieldsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SupportPage($page: PageInput) {\n    supportQuota {\n      limit\n      sentToday\n      remaining\n      nextAllowedAt\n    }\n    mySupportRequests(page: $page) {\n      items {\n        ...SupportRequestFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n"): typeof import('./graphql').SupportPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SupportRequests($status: SupportStatus, $page: PageInput) {\n    supportRequests(status: $status, page: $page) {\n      items {\n        ...SupportRequestFields\n      }\n      total\n      page\n      limit\n      totalPages\n    }\n  }\n"): typeof import('./graphql').SupportRequestsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendSupportRequest($input: SupportRequestInput!) {\n    sendSupportRequest(input: $input) {\n      ...SupportRequestFields\n    }\n  }\n"): typeof import('./graphql').SendSupportRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReplySupportRequest($id: ID!, $reply: String!) {\n    replySupportRequest(id: $id, reply: $reply) {\n      ...SupportRequestFields\n    }\n  }\n"): typeof import('./graphql').ReplySupportRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FinalizeSupportRequest($id: ID!) {\n    finalizeSupportRequest(id: $id) {\n      ...SupportRequestFields\n    }\n  }\n"): typeof import('./graphql').FinalizeSupportRequestDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
