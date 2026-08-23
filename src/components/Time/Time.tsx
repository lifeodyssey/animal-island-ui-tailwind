import React from 'react';
import { Cursor } from '../Cursor';
import { cn } from '../../utils/cn';
import { useNow } from '../../utils/useNow';

export type TimeType = 'hud' | 'game';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekdaysCN = ['日', '一', '二', '三', '四', '五', '六'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface TimeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    /** 显示风格: hud（左右结构）| game（上下结构），默认 hud */
    type?: TimeType;
}

export const Time = React.forwardRef<HTMLDivElement, TimeProps>(({ className, type = 'hud', ...rest }, ref) => {
    const currentTime = useNow();

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');

    if (type === 'game') {
        return (
            <div ref={ref} className={cn('animal-time-game', className)} {...rest}>
                <div className="animal-time-game-time">
                    {hours}
                    <span className="animal-time-game-colon">:</span>
                    {minutes}
                </div>
                <div className="animal-time-game-divider" />
                <div className="animal-time-game-date">
                    <span className="animal-time-game-monthday">
                        {currentTime.getMonth() + 1}月{currentTime.getDate()}日
                    </span>
                    <span className="animal-time-game-weekday">{weekdaysCN[currentTime.getDay()]}</span>
                </div>
            </div>
        );
    }

    return (
        <Cursor>
            <div ref={ref} className={cn('animal-time', className)} {...rest}>
                <div className="animal-time-date">
                    <span className="animal-time-weekday">
                        {weekdays[currentTime.getDay()]}
                    </span>
                    <span className="animal-time-monthday">
                        {months[currentTime.getMonth()]} {currentTime.getDate()}
                    </span>
                </div>
                <div className="animal-time-clock">
                    {hours}
                    <span className="animal-time-colon">:</span>
                    {minutes}
                </div>
            </div>
        </Cursor>
    );
});

Time.displayName = 'Time';
