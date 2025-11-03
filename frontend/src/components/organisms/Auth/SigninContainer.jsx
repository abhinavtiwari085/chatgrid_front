import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignin } from '@/hooks/apis/auth/useSignin';
import { useAuth } from '@/hooks/context/useAuth';
import { joinWorkspaceRequest } from '@/apis/workspaces';

import { SigninCard } from './SigninCard';

export const SigninContainer = () => {

    const navigate = useNavigate();

    const [validationError, setValidationError] = useState(null);

    const [signinForm, setSigninForm] = useState({
        email: '',
        password: ''
    });

    const { isSuccess, isPending, error, signinMutation } = useSignin();
    const { auth } = useAuth();

    const onSigninFormSubmit = async (e) => {
        e.preventDefault();

        if(!signinForm.email || !signinForm.password) {
            console.log('Please fill all the fields');
            setValidationError({ message: 'Please fill all the fields' });
            return;
        }
        setValidationError(null);
        await signinMutation({
            email: signinForm.email,
            password: signinForm.password
        });
    };

    useEffect(() => {
        async function postLoginJoinIfNeeded() {
            const token = auth?.token;
            if (!token) return;
            let pending = null;
            try {
                const raw = localStorage.getItem('pendingWorkspaceJoin');
                pending = raw ? JSON.parse(raw) : null;
            } catch {}
            if (pending?.workspaceId && pending?.joinCode) {
                try {
                    await joinWorkspaceRequest({ workspaceId: pending.workspaceId, joinCode: pending.joinCode, token });
                    localStorage.removeItem('pendingWorkspaceJoin');
                    navigate(`/workspaces/${pending.workspaceId}`, { replace: true });
                    return;
                } catch (e) {
                    // fall back to home if join fails
                    localStorage.removeItem('pendingWorkspaceJoin');
                }
            }
            navigate('/home', { replace: true });
        }
        if (isSuccess || (auth?.user && auth?.token)) {
            postLoginJoinIfNeeded();
        }
    }, [isSuccess, auth?.user, auth?.token, navigate]);

    return (
        <SigninCard 
            onSigninFormSubmit={onSigninFormSubmit}
            signinForm={signinForm} 
            setSigninForm={setSigninForm}
            validationError={validationError}
            error={error}
            isSuccess={isSuccess}
            isPending={isPending}
        />
    );
};
