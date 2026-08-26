import React from 'react';
import { Cursor } from '../Cursor';
import { cn } from '../../utils/cn';
import { useNow } from '../../utils/useNow';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'hud' | 'game';
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const zhWeekdays = ['日', '一', '二', '三', '四', '五', '六'];

export const Time = React.forwardRef<HTMLDivElement, TimeProps>(({ type = 'hud', className, ...rest }, ref) => {
    const currentTime = useNow();

    if (type === 'game') {
        const month = currentTime.getMonth() + 1;
        const day = currentTime.getDate();
        const weekday = zhWeekdays[currentTime.getDay()];
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');

        return (
            <div ref={ref} className={cn('animal-time-game', className)} {...rest}>
                <div className="animal-time-game-clock">
                    {hours}
                    <span className="animal-time-game-colon">:</span>
                    {minutes}
                </div>
                <div className="animal-time-game-divider" />
                <div className="animal-time-game-date">
                    <span className="animal-time-game-monthday">{month}月{day}日</span>
                    <span className="animal-time-game-weekday">{weekday}</span>
                </div>
            </div>
        );
    }

    return (
        <Cursor>
            <div
                ref={ref}
                className={cn('animal-time', className)}
                {...rest}
            >
                <div className="animal-time-date">
                    <span className="animal-time-weekday">
                        {weekdays[currentTime.getDay()]}
                    </span>
                    <span className="animal-time-monthday">
                        {months[currentTime.getMonth()]} {currentTime.getDate()}
                    </span>
                </div>
                <div className="animal-time-clock">
                    {currentTime.getHours().toString().padStart(2, '0')}
                    <span className="animal-time-colon">:</span>
                    {currentTime.getMinutes().toString().padStart(2, '0')}
                </div>
            </div>
        </Cursor>
    );
});

Time.displayName = 'Time';
