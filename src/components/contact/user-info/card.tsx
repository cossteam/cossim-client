import React from 'react';
import ContactCard from './contact-card';
import NotContactCard from '@/components/user/not-contact-card';

interface UserCardProps {
    userId: string;
    isContact: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ userId, isContact }) => {
    return (
        <>
            {isContact ? (
                <ContactCard userId={userId} />
            ) : (
                <NotContactCard userId={userId} />
            )}
        </>
    );
}

export default UserCard;