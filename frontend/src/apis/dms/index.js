import axios from '@/config/axiosConfig';

export const createOrGetDM = async ({ token, workspaceId, memberId }) => {
  const response = await axios.post(
    '/dms',
    { workspaceId, memberId },
    {
      headers: { 'x-access-token': token }
    }
  );
  return response?.data?.data; // channel
};

export const listUserDMs = async ({ token, workspaceId }) => {
  const response = await axios.get(`/dms/${workspaceId}`, {
    headers: { 'x-access-token': token }
  });
  return response?.data?.data; // channels[]
};

export const createDMInvite = async ({ token, workspaceId, email }) => {
  const response = await axios.post(
    '/dms/invite',
    { workspaceId, email },
    {
      headers: { 'x-access-token': token }
    }
  );
  return response?.data?.data;
};

export const listDMInvites = async ({ token, workspaceId }) => {
  const response = await axios.get(`/dms/invites/${workspaceId}`, {
    headers: { 'x-access-token': token }
  });
  return response?.data?.data; // invites[]
};

export const listAllDMInvites = async ({ token }) => {
  const response = await axios.get('/dms/invites', {
    headers: { 'x-access-token': token }
  });
  return response?.data?.data; // invites[]
};

export const actOnDMInvite = async ({ token, inviteId, action }) => {
  const url = `/dms/invite/${inviteId}/${action}`; // accept|reject
  const response = await axios.post(url, {}, {
    headers: { 'x-access-token': token }
  });
  return response?.data?.data;
};
