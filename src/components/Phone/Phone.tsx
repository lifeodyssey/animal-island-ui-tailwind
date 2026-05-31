import React from 'react';
import { cn } from '../../utils/cn';
import { useNow } from '../../utils/useNow';

export interface PhoneProps extends React.HTMLAttributes<HTMLDivElement> {}

interface App {
    id: string;
    iconClass: string;
    color: string;
    offset?: boolean;
    hasNewMessage?: boolean;
    iconWidth?: number;
}

// App icon colors match the upstream NookPhone palette — kept as inline
// styles to preserve 1:1 visual parity with the original implementation.
const apps: App[] = [
    { id: 'camera', iconClass: 'animal-icon-camera', color: '#B77DEE', hasNewMessage: true },
    { id: 'app', iconClass: 'animal-icon-miles', color: '#889DF0', offset: true },
    { id: 'critterpedia', iconClass: 'animal-icon-critterpedia', color: '#F7CD67', iconWidth: 105 },
    { id: 'diy', iconClass: 'animal-icon-diy', color: '#E59266' },
    { id: 'shopping', iconClass: 'animal-icon-design', color: '#F8A6B2' },
    { id: 'variant', iconClass: 'animal-icon-map', color: '#82D5BB', hasNewMessage: true, iconWidth: 90 },
    { id: 'design', iconClass: 'animal-icon-variant', color: '#8AC68A', iconWidth: 80 },
    { id: 'map', iconClass: 'animal-icon-helicopter', color: '#FC736D' },
    { id: 'chat', iconClass: 'animal-icon-chat', color: '#D1DA49' },
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
                            <span className="animal-icon animal-phone-wifi" />
                            <div>{displayHours}<span className="animal-time-colon">:</span>{displayMinutes}{ampm}</div>
                            <span className="animal-icon animal-phone-location" />
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
                                    className={cn(
                                        'animal-phone-app-icon',
                                        app.iconClass,
                                        app.offset && 'animal-phone-app-icon-offset',
                                    )}
                                    style={app.iconWidth ? { width: app.iconWidth } : undefined}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="animal-phone-page">
                        <span className="animal-icon animal-phone-page-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
});

Phone.displayName = 'Phone';
