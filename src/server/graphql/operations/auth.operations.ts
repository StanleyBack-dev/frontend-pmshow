import { graphql } from "@/server/graphql/generated";

export const loginDocument = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      accessTokenExpiresAt
      refreshToken
      refreshTokenExpiresAt
      user {
        id
        name
        username
        email
        group
        mustChangePassword
        permissions
        photoUrl
      }
    }
  }
`);

export const refreshSessionDocument = graphql(`
  mutation RefreshSession($refreshToken: String!) {
    refreshSessionTokens(refreshToken: $refreshToken) {
      accessToken
      accessTokenExpiresAt
      refreshToken
      refreshTokenExpiresAt
    }
  }
`);

export const logoutDocument = graphql(`
  mutation Logout {
    logout
  }
`);

export const meDocument = graphql(`
  query Me {
    me {
      id
      name
      username
      email
      group
      mustChangePassword
      permissions
      photoUrl
    }
  }
`);

export const changeMyPasswordDocument = graphql(`
  mutation ChangeMyPassword($input: ChangePasswordInput!) {
    changeMyPassword(input: $input)
  }
`);

export const updateMyProfileDocument = graphql(`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      id
      name
      username
      email
      group
      mustChangePassword
      permissions
      photoUrl
    }
  }
`);

export const setMyPhotoDocument = graphql(`
  mutation SetMyPhoto($photo: String!) {
    setMyPhoto(photo: $photo)
  }
`);

export const removeMyPhotoDocument = graphql(`
  mutation RemoveMyPhoto {
    removeMyPhoto
  }
`);

export const requestPasswordRecoveryDocument = graphql(`
  mutation RequestPasswordRecovery($login: String!) {
    requestPasswordRecovery(login: $login)
  }
`);

export const verifyPasswordRecoveryCodeDocument = graphql(`
  mutation VerifyPasswordRecoveryCode($input: VerifyRecoveryCodeInput!) {
    verifyPasswordRecoveryCode(input: $input)
  }
`);

export const resetPasswordWithRecoveryDocument = graphql(`
  mutation ResetPasswordWithRecovery($input: ResetPasswordInput!) {
    resetPasswordWithRecovery(input: $input)
  }
`);
