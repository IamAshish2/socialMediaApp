import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../button'
import { useSignOutAccount } from '@/lib/React-Query/queriesAndMutations'
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';

const TopBar = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { mutateAsync: logoutUser, isSuccess } = useSignOutAccount();
    useEffect(() => {
        if (isSuccess) navigate('/sign-in');
    }, [isSuccess])

    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.svg"
                        width={130} height={325} />
                </Link>
                <div className='flex gap-4'>
                    <Button onClick={() => logoutUser()}
                        variant="ghost"
                        className='shad-button_ghost'
                    >
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`}>
                        <img src='assets/images/profile.png' width={42} height={32} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default TopBar
