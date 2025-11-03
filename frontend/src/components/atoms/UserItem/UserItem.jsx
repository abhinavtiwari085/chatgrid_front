import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cva } from 'class-variance-authority';
import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { cn } from '@/lib/utils';

const userItemVariants = cva(
    'flex items-center gap-1.5 justify-start font-normal h-7 px-4 mt-2 text-sm',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc]',
                active: 'text-[#481350] bg-white/90 hover:bg-white/80'
            }
        },
        defaultVariants: 'default'
    }
);

export const UserItem = ({
    id,
    label = 'Member',
    title, // string used for initials
    suffix, // ReactNode to render after name (e.g., Admin)
    rightContent, // ReactNode right-aligned (e.g., unread badge)
    image,
    variant,
    to,
    onClick,
    showActive = false
}) => {
    console.log('incoming label', label);
    const { workspace } = useCurrentWorkspace();

    return (
        <Button
            className={cn(userItemVariants({variant}), 'justify-between')}
            variant="transparent"
            size="sm"
            asChild={!!to}
            onClick={onClick}
        >
            {to ? (
                <Link to={to} className='flex items-center gap-1.5 w-full'> 
                    <div className='relative'>
                        <Avatar>
                            <AvatarImage src={image} className='rounded-md' />
                            <AvatarFallback
                                className='rounded-md bg-sky-500 text-white'
                            >
                                {(title || label).charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {showActive && (
                            <span className='absolute -bottom-0.5 -right-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#1a1d21]' />
                        )}
                    </div>
                    <span className='text-sm truncate'>
                        {title || label}
                        {suffix}
                    </span>
                    <div className='ml-auto'>{rightContent}</div>
                </Link>
            ) : (
                <div className='flex items-center gap-1.5 w-full'>
                    <div className='relative'>
                        <Avatar>
                            <AvatarImage src={image} className='rounded-md' />
                            <AvatarFallback className='rounded-md bg-sky-500 text-white'>
                                {(title || label).charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {showActive && (
                            <span className='absolute -bottom-0.5 -right-0.5 inline-block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#1a1d21]' />
                        )}
                    </div>
                    <span className='text-sm truncate'>
                        {title || label}
                        {suffix}
                    </span>
                    <div className='ml-auto'>{rightContent}</div>
                </div>
            )}
        </Button>
    );
};
