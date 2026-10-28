import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  changeMyPasswordDocument,
  loginDocument,
  logoutDocument,
  meDocument,
  refreshSessionDocument,
  removeMyPhotoDocument,
  requestPasswordRecoveryDocument,
  resetPasswordWithRecoveryDocument,
  setMyPhotoDocument,
  updateMyProfileDocument,
  verifyPasswordRecoveryCodeDocument,
} from "@/server/graphql/operations/auth.operations";
import type { SessionTokens } from "@/server/auth/session";
import type { SessionUser } from "@/shared/contracts/api";

export const authService = {
  async login(
    login: string,
    password: string,
  ): Promise<{ tokens: SessionTokens; user: SessionUser }> {
    const { login: result } = await backendGraphql(loginDocument, {
      variables: { input: { login, password } },
    });
    const { user, ...tokens } = result;
    return { tokens, user };
  },

  async refresh(refreshToken: string): Promise<SessionTokens> {
    const { refreshSessionTokens } = await backendGraphql(
      refreshSessionDocument,
      { variables: { refreshToken } },
    );
    return refreshSessionTokens;
  },

  async logout(token: string): Promise<void> {
    await backendGraphql(logoutDocument, { token });
  },

  async me(token: string): Promise<SessionUser> {
    const { me } = await backendGraphql(meDocument, { token });
    return me;
  },

  async changePassword(
    token: string,
    input: { currentPassword: string; newPassword: string },
  ): Promise<void> {
    await backendGraphql(changeMyPasswordDocument, {
      token,
      variables: { input },
    });
  },

  async updateProfile(
    token: string,
    input: { name: string; email: string },
  ): Promise<SessionUser> {
    const { updateMyProfile } = await backendGraphql(updateMyProfileDocument, {
      token,
      variables: { input },
    });
    return updateMyProfile;
  },

  /** Returns the new photo's short-lived link. */
  async setPhoto(token: string, photo: string): Promise<string> {
    const { setMyPhoto } = await backendGraphql(setMyPhotoDocument, {
      token,
      variables: { photo },
    });
    return setMyPhoto;
  },

  async removePhoto(token: string): Promise<void> {
    await backendGraphql(removeMyPhotoDocument, { token });
  },

  async requestRecovery(login: string): Promise<void> {
    await backendGraphql(requestPasswordRecoveryDocument, {
      variables: { login },
    });
  },

  async verifyRecoveryCode(login: string, code: string): Promise<string> {
    const { verifyPasswordRecoveryCode } = await backendGraphql(
      verifyPasswordRecoveryCodeDocument,
      { variables: { input: { login, code } } },
    );
    return verifyPasswordRecoveryCode;
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    await backendGraphql(resetPasswordWithRecoveryDocument, {
      variables: { input: { resetToken, newPassword } },
    });
  },
};
