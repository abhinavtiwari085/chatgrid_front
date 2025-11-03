import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/context/useAuth';

import { ProtectedRoute } from '@/components/molecules/ProtectedRoute/ProtectedRoute';
import { SigninContainer } from '@/components/organisms/Auth/SigninContainer';
import { SignupContainer } from '@/components/organisms/Auth/SignupContainer';
import { Auth } from '@/pages/Auth/Auth';
import { Home } from '@/pages/Home/Home';
import { Notfound } from '@/pages/Notfound/Notfound';

import { Channel } from './pages/Workspace/Channel/Channel';
import { JoinPage } from './pages/Workspace/JoinPage';
import { WorkspaceLayout } from './pages/Workspace/Layout';
import { DMList } from './pages/Workspace/DMs/DMList';
import { Notifications } from './pages/Workspace/Notifications/Notifications';

const RootRedirect = () => {
    const { auth } = useAuth();
    if (auth?.isLoading) return null;
    const target = auth?.user && auth?.token ? '/home' : '/auth/signin';
    return <Navigate to={target} replace />;
};

export const AppRoutes = () => {
    return (
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/signup" element={<Auth><SignupContainer /></Auth>} />
          <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/workspaces/:workspaceId" element={<ProtectedRoute><WorkspaceLayout>Workspace</WorkspaceLayout></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/channels/:channelId"
            element={<ProtectedRoute><WorkspaceLayout><Channel /></WorkspaceLayout></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/dms"
            element={<ProtectedRoute><WorkspaceLayout /></ProtectedRoute>} />
          <Route 
            path="/workspaces/:workspaceId/notifications"
            element={<ProtectedRoute><WorkspaceLayout /></ProtectedRoute>} />

          <Route path="/workspaces/join/:workspaceId" element={<JoinPage />} />
          <Route path="/*" element={<Notfound />} />
        </Routes>
    );
};
