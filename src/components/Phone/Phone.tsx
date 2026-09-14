import React from 'react';
import { WifiIcon, LocationIcon, FileIcon } from '../Icon/src';
import { getArtworkStyle, type ArtworkName } from '../Icon/artwork';
import { cn } from '../../utils/cn';
import { useNow } from '../../utils/useNow';

export interface PhoneProps extends React.HTMLAttributes<HTMLDivElement> {}

interface App {
    id: string;
    artwork: ArtworkName;
    color: string;
    offset?: boolean;
    hasNewMessage?: boolean;
}

const apps: App[] = [
    { id: 'camera', artwork: 'camera', color: '#B77DEE', hasNewMessage: true },
    { id: 'app', artwork: 'travel', color: '#889DF0', offset: true },
    { id: 'critterpedia', artwork: 'encyclopedia', color: '#F7CD67' },
    { id: 'diy', artwork: 'diy', color: '#E59266' },
    { id: 'shopping', artwork: 'design', color: '#F8A6B2' },
    { id: 'variant', artwork: 'map', color: '#82D5BB', hasNewMessage: true },
    { id: 'design', artwork: 'passport', color: '#8AC68A' },
    { id: 'map', artwork: 'helicopter', color: '#FC736D' },
    { id: 'chat', artwork: 'chat', color: '#D1DA49' },
];

export const Phone = React.forwardRef<HTMLDivElement, PhoneProps>(({ className, ...rest }, ref) => {
    const time = useNow();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return (
        <div
            ref={ref}
            className={cn('animal-phone-container', className)}
            {...rest}
        >
            <div className="animal-phone">
                <div className="animal-phone-screen">
                    <div className="animal-phone-date">
                        <div className="animal-phone-status">
                            <WifiIcon className="animal-phone-wifi" aria-hidden={true} />
                            <div>{displayHours}<span className="animal-time-colon">:</span>{displayMinutes}{ampm}</div>
                            <LocationIcon className="animal-phone-location" aria-hidden={true} />
                        </div>
                        <div className="animal-phone-welcome">Welcome!</div>
                    </div>
                    <div className="animal-phone-apps">
                        {apps.map((app) => (
                            <div
                                key={app.id}
                                className={cn('animal-phone-app', app.offset && 'animal-phone-app-offset')}
                                style={{ backgroundColor: app.color }}
                            >
                                {app.hasNewMessage && <span className="animal-phone-badge" />}
                                <span
                                    className="animal-phone-app-icon"
                                    style={{ ...getArtworkStyle(app.artwork), width: 112, height: 112 }}
                                    aria-hidden="true"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="animal-phone-page">
                        <FileIcon className="animal-phone-page-icon" aria-hidden={true} />
                    </div>
                </div>
            </div>
        </div>
    );
});

Phone.displayName = 'Phone';
