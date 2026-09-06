import React from 'react';
import {
    BookOpen,
    Camera,
    Coins,
    Hammer,
    Helicopter,
    Map,
    MapPin,
    MessageCircle,
    Palette,
    Shuffle,
    Wifi,
    FileText,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNow } from '../../utils/useNow';

export interface PhoneProps extends React.HTMLAttributes<HTMLDivElement> {}

interface App {
    id: string;
    Icon: LucideIcon;
    color: string;
    offset?: boolean;
    hasNewMessage?: boolean;
    iconSize?: number;
}

// App icon colors match the upstream NookPhone palette — kept as inline
// styles to preserve 1:1 visual parity with the original implementation.
// Glyphs are lucide-react vectors (original art), not bundled bitmaps.
const apps: App[] = [
    { id: 'camera', Icon: Camera, color: '#B77DEE', hasNewMessage: true },
    { id: 'app', Icon: Coins, color: '#889DF0', offset: true },
    { id: 'critterpedia', Icon: BookOpen, color: '#F7CD67', iconSize: 84 },
    { id: 'diy', Icon: Hammer, color: '#E59266' },
    { id: 'shopping', Icon: Palette, color: '#F8A6B2' },
    { id: 'variant', Icon: Map, color: '#82D5BB', hasNewMessage: true, iconSize: 80 },
    { id: 'design', Icon: Shuffle, color: '#8AC68A', iconSize: 72 },
    { id: 'map', Icon: Helicopter, color: '#FC736D' },
    { id: 'chat', Icon: MessageCircle, color: '#D1DA49' },
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
                            <Wifi className="animal-phone-wifi" aria-hidden="true" />
                            <div>{displayHours}<span className="animal-time-colon">:</span>{displayMinutes}{ampm}</div>
                            <MapPin className="animal-phone-location" aria-hidden="true" />
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
                                <app.Icon
                                    className={cn(
                                        'animal-phone-app-icon',
                                        app.offset && 'animal-phone-app-icon-offset',
                                    )}
                                    size={app.iconSize ?? 76}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="animal-phone-page">
                        <FileText className="animal-phone-page-icon" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    );
});

Phone.displayName = 'Phone';
