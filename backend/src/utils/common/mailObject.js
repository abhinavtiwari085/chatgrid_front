import { APP_LINK, MAIL_ID } from '../../config/serverConfig.js';

export const workspaceJoinMail = function (workspace) {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a workspace',
    text: `Congratulations! You have been added to the workspace ${workspace.name}`
  };
};

export const workspaceInviteMail = function ({ workspace, sender, inviteLink }) {
  const wsName = workspace?.name || 'a workspace';
  const adminName = sender?.username || 'Admin';
  const link = inviteLink || `${APP_LINK}`;
  const subject = `You have been invited to join ${wsName}`;
  const text = `Hey you have been invited to join this workspace by ${adminName} Click here to join the workspace\n${link}`;
  const html = `
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:1.5;">
      <p>Hey you have been invited to join this <strong>${workspace.name} </strong>workspace by <strong>${adminName}</strong> Open the link to join the workspace</p>
      <p><a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></p>
    </div>
  `;
  return {
    from: MAIL_ID,
    subject,
    text,
    html
  };
};

export const verifyEmailMail = function (verificationToken) {
  return {
    from: MAIL_ID,
    subject: 'Welcome to the app. Please verify your email',
    text: `
      Welcome to the app. Please verify your email by clicking on the link below:
     ${APP_LINK}/verify/${verificationToken}
    `
  };
};
